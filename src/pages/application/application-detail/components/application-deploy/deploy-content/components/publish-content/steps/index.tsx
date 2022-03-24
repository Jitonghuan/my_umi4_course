import { useMemo } from 'react';
import { Steps } from 'antd';
import StepItem from './step-item';
const { Step } = Steps;

const StepsComp = ({ items, current, initial, ...other }: any) => (
  <Steps current={current} initial={initial} className="publish-content-compo__steps">
    {items && items.map((item: any) => <StepItem title={item.title} status={item.nodeStatus} {...other} />)}
  </Steps>
);

export default function DeploySteps(props: any) {
  const { stepData, ...other } = props;
  // 单个环境
  const singles = useMemo(() => stepData?.filter((i: any) => i.nodeType === 'single'), [stepData]);
  // 多个环境
  const subjects = useMemo(() => stepData.find((i: any) => i.nodeType === 'subject'), [stepData]);
  // 多个环境发布时 用于控制环境名颜色
  const changeColor = (data: any, env?: any) => {
    let flag = false;
    if (env && data[env]) {
      let res = data[env];
      flag = res[0].nodeStatus !== 'await';
    }
    return flag;
  };
  return (
    <div className="publish-content-compo-wrapper" style={{ display: 'flex' }}>
      <div>
        <StepsComp items={singles} />
      </div>
      {subjects && (
        <div
          className={`sub_process-wrapper ${
            singles[singles.length - 1].nodeStatus === 'finish' ? 'sub_process-wrapper-active' : ''
          }`}
        >
          {subjects.env.map((envKey: any, index: number) => (
            <div
              key={envKey}
              className={`sub_process sub_process-${index} ${
                changeColor(subjects, envKey) ? 'sub_process-active' : ''
              }`}
            >
              <span className="sub_process-title">{envKey}</span>
              <StepsComp {...other} current={singles.length} initial={singles.length} items={subjects[envKey]} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
