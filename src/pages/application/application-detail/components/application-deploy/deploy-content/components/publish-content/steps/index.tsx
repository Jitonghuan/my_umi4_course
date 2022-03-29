import { useMemo, useState, useEffect } from 'react';
import { Steps } from 'antd';
import StepItem from './step-item';
import { initial } from 'lodash';

// 判断多环境前面的线条以及环境名是否要变蓝
const changeColor = (data: any, env?: any) => {
  let flag = false;
  if (Array.isArray(env)) {
    for (let item of env) {
      if (data[item] && data[item][0] && data[item][0].nodeStatus !== 'wait') {
        return true;
      }
    }
  }
  if (env && data[env]) {
    let res = data[env];
    return res[0].nodeStatus !== 'wait';
  }
  return flag;
};

//单个stepsComp
//连续的单环境是一个单独的stepsComp 遇到多环境节点 有几个环境就有几个stepComb
const StepsComp = ({ items, current, initial, ...other }: any) => (
  <Steps initial={initial} className="publish-content-compo__steps">
    {items && items.map((item: any) => <StepItem title={item.title} status={item.nodeStatus} {...other} />)}
  </Steps>
);

// 单环境
const SingelEnvSteps = (props: any) => (
  <div>
    <StepsComp {...props} />
  </div>
);

// 多环境
const MultiEnvSteps = (props: any) => {
  const { initial, env, ...other } = props;

  return (
    <div style={{ margin: '0 15px' }}>
      <div className={`sub_process-wrapper ${changeColor(props, env) ? 'sub_process-wrapper-active' : ''}`}>
        {env.map((envKey: any, index: number) => (
          <div
            key={envKey}
            className={`sub_process sub_process-${index} ${changeColor(props, envKey) ? 'sub_process-active' : ''}`}
          >
            <span className="sub_process-title">{envKey}</span>
            <StepsComp {...other} initial={initial} items={props[envKey]} />
          </div>
        ))}
      </div>
    </div>
  );
};
export default function DeploySteps(props: any) {
  const { stepData, deployInfo, onSpin, stopSpin, ...other } = props;
  const [data, setData] = useState<any>([]);
  useEffect(() => {
    if (stepData.length !== 0) {
      const data = handleData(stepData);
      setData(data);
    }
  }, [stepData]);

  // 处理数据 将拿到的一维数组处理成二维数组 连续单个节点的合成一个二维数组 多环境的直接是对象
  // [{单},{单},{多},{多},{单},{单}]=>[[{单},{单}],{多},{多},[{单},{单}]]
  const handleData = (value: any) => {
    let res: any = [];
    for (var index = 0; index < value.length; index++) {
      const element = value[index];
      if (element.nodeType === 'single') {
        const curr = res[res.length - 1];
        if (curr && Array.isArray(curr)) {
          curr.push(element);
        } else {
          res.push([element]);
        }
      } else {
        res.push(element);
      }
    }
    return res;
  };

  // 获取每个stepComp的initial值
  const getInitValue = (currentIndex: number) => {
    if (data.length === 0) {
      return;
    }
    let init = 0;
    for (let i = 0; i < currentIndex; i++) {
      let element = data[i];
      if (Array.isArray(element)) {
        init = init + element.length;
      } else {
        init = init + element[element.env[0]].length;
      }
    }
    return init;
  };

  return (
    <div className="publish-content-compo-wrapper" style={{ display: 'flex' }}>
      {data.map((item: any, index: number) =>
        !Array.isArray(item) ? (
          <MultiEnvSteps {...item} {...props} initial={getInitValue(index)} />
        ) : (
          <SingelEnvSteps items={item} {...props} initial={getInitValue(index)} />
        ),
      )}
    </div>
  );
}
