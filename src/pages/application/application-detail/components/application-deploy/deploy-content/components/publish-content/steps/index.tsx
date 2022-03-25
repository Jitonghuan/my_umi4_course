import { useMemo } from 'react';
import { Steps } from 'antd';
import StepItem from './step-item';

const changeColor = (data: any, env?: any) => {
  let flag = false;
  if (env && data[env]) {
    let res = data[env];
    flag = res[0].nodeStatus !== 'await';
  }
  return flag;
};

//每一个stepsComp 连续的单环境是一个单独的stepsComp 遇到多环境节点 有几个环境就有几个stepComb
const StepsComp = ({ items, current, initial, ...other }: any) => (
  <Steps current={current} initial={initial} className="publish-content-compo__steps">
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
  const { nodeStatus, current, initial, env, ...other } = props;
  console.log(props);

  return (
    <div style={{ margin: '0 15px' }}>
      <div className={`sub_process-wrapper ${nodeStatus === 'finish' ? 'sub_process-wrapper-active' : ''}`}>
        {env.map((envKey: any, index: number) => (
          <div
            key={envKey}
            className={`sub_process sub_process-${index} ${changeColor(props, envKey) ? 'sub_process-active' : ''}`}
          >
            <span className="sub_process-title">{envKey}</span>
            <StepsComp {...other} current={current} initial={initial} items={props[envKey]} />
          </div>
        ))}
      </div>
    </div>
  );
};
export default function DeploySteps(props: any) {
  const { stepData, ...other } = props;

  const data: any = [[]];
  // 处理数据 将拿到的一维数组处理成二维数组 连续单个节点的合成一个二维数组 多环境的直接是对象
  // [{单},{单},{多},{多},{单},{单}]=>[[{单},{单}],{多},{多},[{单},{单}]]
  for (var index = 0; index < stepData.length; index++) {
    const element = stepData[index];
    if (element.nodeType === 'single') {
      data[data.length - 1].push(element);
    } else {
      data[data.length] = element;
      if (index < stepData.length - 1) {
        data[data.length] = [];
      }
    }
  }
  // console.log(data);

  return (
    <div className="publish-content-compo-wrapper" style={{ display: 'flex' }}>
      {data.map((item: any) =>
        !Array.isArray(item) ? <MultiEnvSteps {...item} {...props} /> : <SingelEnvSteps items={item} {...props} />,
      )}
    </div>
  );
}
