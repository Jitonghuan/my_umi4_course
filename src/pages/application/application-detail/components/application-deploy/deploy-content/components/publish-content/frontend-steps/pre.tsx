// pre steps
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/05 22:42

import React from 'react';
import { Steps } from 'antd';
import { StepsProps } from '../types';
import CreateTaskStep from '../step-items/create-task';
import MergeReleaseStep from '../step-items/merge-release';
import BuildingStep from '../step-items/building';
import PushResourceStep from '../step-items/push-resource';
import PushVersionStep from '../step-items/push-version';
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
  // 推送前端资源
  pushFeResource: 3.1,
  pushFeResourceErr: 3.2,
  // 推送前端版本
  pushVersion: 4.1,
  pushVersionErr: 4.2,
  // 完成
  deployFinish: 5,
  deployed: 5,
  multiEnvDeploying: 2,
};

export default function PreEnvSteps({ deployInfo, onOperate, getItemByKey }: StepsProps) {
  const { deployStatus, envs, deploySubStates, jenkinsUrl, buildType } = deployInfo;
  const status = deployStatusMapping[deployStatus] || -1;
  const envList = envs ? envs.split(',') : [];

  const payload = { deployInfo, onOperate, deployStatus: deployInfo.deployStatus, envTypeCode: 'pre' };

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
            {buildType === 'singleBuild' ? (
              <BuildingStep
                {...payload}
                deployStatus={getSubStateStatus(envList[0])}
                jenkinsUrl={getItemByKey(jenkinsUrl, envList[0]).subJenkinsUrl}
                envCode={envList[0]}
              />
            ) : null}
          </Steps>
          <div
            className={`sub_process-wrapper ${parseInt(status + '') > 1 ? 'sub_process-wrapper-active' : ''}`}
            style={{ marginLeft: buildType === 'singleBuild' ? '480px' : '330px' }}
          >
            {envList.map((envCode, i) => (
              <div
                key={envCode}
                className={`sub_process sub_process-${i} ${getCurrentStatus(envCode) > 1 ? 'sub_process-active' : ''}`}
              >
                <span className="sub_process-title">{envCode}</span>
                <Steps initial={2} current={getCurrentStatus(envCode)} className="sub_process-steps">
                  {buildType !== 'singleBuild' ? (
                    <BuildingStep
                      {...payload}
                      deployStatus={getSubStateStatus(envCode)}
                      jenkinsUrl={getItemByKey(jenkinsUrl, envCode).subJenkinsUrl}
                      envCode={envCode}
                    />
                  ) : null}
                  <PushResourceStep {...payload} deployStatus={getSubStateStatus(envCode)} envCode={envCode} />
                  <PushVersionStep {...payload} deployStatus={getSubStateStatus(envCode)} envCode={envCode} />
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
          <BuildingStep
            {...payload}
            deployStatus={getSubStateStatus(envList[0])}
            jenkinsUrl={getItemByKey(jenkinsUrl, envList[0]).subJenkinsUrl}
            envCode={envList[0]}
          />
          <PushResourceStep {...payload} deployStatus={getSubStateStatus(envList[0])} envCode={envList[0]} />
          <PushVersionStep {...payload} deployStatus={getSubStateStatus(envList[0])} envCode={envList[0]} />
          <FinishedStep {...payload} deployStatus={getSubStateStatus(envList[0])} envCode={envList[0]} />
        </Steps>
      )}
    </div>
  );
}
