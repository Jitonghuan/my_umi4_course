// pre steps
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/05 22:42

import React from 'react';
import { Button, Steps } from 'antd';
import { StepsProps } from '../types';
import CreateTaskStep from '../step-items/create-task';
import MergeReleaseStep from '../step-items/merge-release';
import BuildingStep from '../step-items/building';
import DeployingStep from '../step-items/deploying';
import FinishedStep from '../step-items/finished';

const deployStatusMapping: Record<string, number> = {
  // 合并release
  merging: 1.1,
  mergeErr: 1.2,
  conflict: 1.2,
  // 构建
  building: 2.1,
  buildErr: 2.2,
  buildAborted: 2.2,
  // 部署
  deploying: 3.1,
  deployErr: 3.2,
  deployAborted: 3.2,
  // 完成
  deployFinish: 4,
  deployed: 4,
  multiEnvDeploying: 2,
};

export default function PreEnvSteps({
  deployInfo,
  onOperate,
  getItemByKey,
  onCancelDeploy,
  onSpin,
  stopSpin,
  deployedList,
  isFrontend,
}: StepsProps) {
  const { deployStatus, envs, deploySubStates, jenkinsUrl } = deployInfo || {};

  const payload = {
    deployInfo,
    onOperate,
    deployStatus: deployInfo.deployStatus,
    envTypeCode: 'pre',
    onSpin,
    stopSpin,
    deployedList,
    isFrontend,
  };
  const envList = envs ? envs.split(',') : [];

  function getSubStateStatus(envCode: string) {
    const item = getItemByKey(deploySubStates, envCode);
    return item?.subState || 'other';
  }

  function getCurrentStatus(envCode: string) {
    const subState = getSubStateStatus(envCode);
    const status = deployStatusMapping[subState] || -1;
    return parseInt(status + '');
  }

  let status = deployStatusMapping[deployStatus] || -1;
  if (deployStatus === 'deployAborted') {
    status = -1;
  } else if (deployStatus === 'multiEnvDeploying' && envList.length < 2) {
    status = getCurrentStatus(envList[0]);
  }

  return (
    <div className="publish-content-compo-wrapper">
      {envList.length > 1 ? (
        <>
          <Steps className="publish-content-compo__steps" current={parseInt(status + '')}>
            <CreateTaskStep {...payload} />
            <MergeReleaseStep {...payload} />
          </Steps>
          <div className={`sub_process-wrapper ${parseInt(status + '') > 1 ? 'sub_process-wrapper-active' : ''}`}>
            {envList.map((envCode, i) => (
              <div
                key={envCode}
                className={`sub_process sub_process-${i} ${getCurrentStatus(envCode) > 1 ? 'sub_process-active' : ''}`}
              >
                <span className="sub_process-title">{envCode}</span>
                <Steps initial={2} current={getCurrentStatus(envCode)} className="sub_process-steps">
                  <BuildingStep
                    {...payload}
                    deployStatus={getSubStateStatus(envCode)}
                    jenkinsUrl={getItemByKey(jenkinsUrl, envCode).subJenkinsUrl}
                    envCode={envCode}
                  />
                  <DeployingStep
                    {...payload}
                    deployStatus={getSubStateStatus(envCode)}
                    envCode={envCode}
                    jenkinsUrl={getItemByKey(jenkinsUrl, envCode).subJenkinsUrl}
                  />
                  <FinishedStep {...payload} deployStatus={getSubStateStatus(envCode)} envCode={envCode} />
                </Steps>
                {parseInt(status + '') > 1 && parseInt(status + '') < 4 ? (
                  <Button type="link" className="cancel-btn" onClick={() => onCancelDeploy && onCancelDeploy(envCode)}>
                    取消发布
                  </Button>
                ) : null}
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <Steps className="publish-content-compo__steps single-publish__steps" current={parseInt(status + '')}>
            <CreateTaskStep {...payload} />
            <MergeReleaseStep {...payload} />
            <BuildingStep
              {...payload}
              deployStatus={getSubStateStatus(envList[0])}
              jenkinsUrl={getItemByKey(jenkinsUrl, envList[0]).subJenkinsUrl}
              envCode={envList[0]}
            />
            <DeployingStep
              {...payload}
              deployStatus={getSubStateStatus(envList[0])}
              envCode={envList[0]}
              jenkinsUrl={getItemByKey(jenkinsUrl, envList[0]).subJenkinsUrl}
            />
            <FinishedStep {...payload} deployStatus={getSubStateStatus(envList[0])} envCode={envList[0]} />
          </Steps>
          {parseInt(status + '') > 1 && parseInt(status + '') < 4 ? (
            <Button danger className="single-cancel-btn" onClick={() => onCancelDeploy && onCancelDeploy(envList[0])}>
              取消发布
            </Button>
          ) : null}
        </>
      )}
    </div>
  );
}
