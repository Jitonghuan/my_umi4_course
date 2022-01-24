// test steps
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/05 22:44

import React from 'react';
import { Steps } from 'antd';
import { StepsProps } from '../types';
import CreateTaskStep from '../step-items/create-task';
import MergeReleaseStep from '../step-items/merge-release';
import QualityCheckStep from '../step-items/quality-check';
import BuildingStep from '../step-items/building';
import DeployingStep from '../step-items/deploying';
import FinishedStep from '../step-items/finished';

const deployStatusMapping: Record<string, number> = {
  // 合并release
  merging: 1.1,
  mergeErr: 1.2,
  conflict: 1.2,
  // 单测卡点
  qualityChecking: 2.1,
  qualityFailed: 2.2,
  // 构建
  building: 3.1,
  buildErr: 3.2,
  buildAborted: 3.2,
  // 部署
  deploying: 4.1,
  deployErr: 4.2,
  deployAborted: 4.2,
  // 完成
  deployFinish: 5,
  deployed: 5,
};

export default function TestEnvSteps({ deployInfo, onOperate }: StepsProps) {
  const { deployStatus, envs, deploySubStates, jenkinsUrl } = deployInfo || {};
  let status = deployStatusMapping[deployStatus] || -1;
  if (deployStatus === 'deployAborted') {
    status = -1;
  }

  const payload = { deployInfo, onOperate, deployStatus: deployInfo.deployStatus, envTypeCode: 'test' };
  const envList = envs ? envs.split(',') : [];

  function getItemByKey(listStr: string, envCode: string) {
    try {
      const list = listStr ? JSON.parse(listStr) : [];
      const item = list.find((val: any) => val.envCode === envCode);
      return item || {};
    } catch (e) {
      return listStr
        ? {
            subJenkinsUrl: listStr,
          }
        : {};
    }
  }

  function getSubStateStatus(envCode: string) {
    const item = getItemByKey(deploySubStates, envCode);
    return item?.subState || 'other';
  }

  function getCurrentStatus(envCode: string) {
    const subState = getSubStateStatus(envCode);
    const status = deployStatusMapping[subState] || -1;
    return parseInt(status + '');
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
                  <QualityCheckStep {...payload} deployStatus={getSubStateStatus(envCode)} envCode={envCode} />
                  <BuildingStep
                    {...payload}
                    deployStatus={getSubStateStatus(envCode)}
                    jenkinsUrl={getItemByKey(jenkinsUrl, envCode).subJenkinsUrl}
                    envCode={envCode}
                  />
                  <DeployingStep {...payload} deployStatus={getSubStateStatus(envCode)} envCode={envCode} />
                  <FinishedStep {...payload} deployStatus={getSubStateStatus(envCode)} envCode={envCode} />
                </Steps>
              </div>
            ))}
          </div>
        </>
      ) : (
        <Steps className="publish-content-compo__steps" current={parseInt(status + '')}>
          <CreateTaskStep {...payload} />
          <MergeReleaseStep {...payload} />
          <QualityCheckStep {...payload} />
          <BuildingStep
            {...payload}
            deployStatus={getSubStateStatus(envList[0])}
            jenkinsUrl={getItemByKey(jenkinsUrl, envList[0]).subJenkinsUrl}
            envCode={envList[0]}
          />
          <DeployingStep {...payload} deployStatus={getSubStateStatus(envList[0])} envCode={envList[0]} />
          <FinishedStep {...payload} deployStatus={getSubStateStatus(envList[0])} envCode={envList[0]} />
        </Steps>
      )}
    </div>
  );
}
