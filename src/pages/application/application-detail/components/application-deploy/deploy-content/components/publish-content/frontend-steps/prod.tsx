// 生产环境-发布步骤
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/05 22:43

import React from 'react';
import { Steps } from 'antd';
import { StepsProps } from '../types';
import CreateTaskStep from '../step-items/create-task';
import MergeReleaseStep from '../step-items/merge-release';
import MergeMasterStep from '../step-items/merge-master';
import BuildingStep from '../step-items/building';
import PushResourceStep from '../step-items/push-resource';
import GrayValidationStep from '../step-items/gray-validation';
import PushVersionStep from '../step-items/push-version';
import DeleteFeatureStep from '../step-items/delete-feature';
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
  // 前端线上验证
  verifyWait: 4.1,
  verifyFailed: 4.2,
  verifySuccess: 5.0,
  // 推送前端版本
  pushVersion: 5.1,
  pushVersionErr: 5.2,
  pushVersionSuccess: 6.0,
  // 合并master
  mergingMaster: 6.1,
  mergeMasterErr: 6.2,
  // 删除feature
  deletingFeature: 7.1,
  deleteFeatureErr: 7.2,
  // 完成
  deployFinish: 8,
  deployed: 8,
  multiEnvDeploying: 2,
};

export default function ProdEnvSteps({ deployInfo, onOperate, getItemByKey }: StepsProps) {
  const { deployStatus, envs, deploySubStates, jenkinsUrl, buildType } = deployInfo;
  const status = deployStatusMapping[deployStatus] || -1;

  const payload = { deployInfo, onOperate, deployStatus: deployInfo.deployStatus, envTypeCode: 'prod' };
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

  function getSubConW() {
    const $el = document.querySelector('.prod-sub_process-wrapper');
    return $el ? $el.clientWidth + 'px' : '10px';
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

          <Steps
            className="last_process-wrapper"
            initial={6}
            style={{ left: getSubConW(), marginLeft: buildType === 'singleBuild' ? '480px' : '330px' }}
            current={parseInt(status + '')}
          >
            <MergeMasterStep {...payload} />
            <DeleteFeatureStep {...payload} />
            <FinishedStep {...payload} />
          </Steps>

          <div
            className={`prod-sub_process-wrapper sub_process-wrapper ${
              parseInt(status + '') > 1 ? 'sub_process-wrapper-active' : ''
            } ${parseInt(status + '') > 5 ? 'sub_process-wrapper-finish' : ''}`}
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
                  <GrayValidationStep {...payload} deployStatus={getSubStateStatus(envCode)} envCode={envCode} />
                  <PushVersionStep {...payload} deployStatus={getSubStateStatus(envCode)} envCode={envCode} />
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
          <GrayValidationStep {...payload} deployStatus={getSubStateStatus(envList[0])} envCode={envList[0]} />
          <PushVersionStep {...payload} deployStatus={getSubStateStatus(envList[0])} envCode={envList[0]} />
          <MergeMasterStep {...payload} />
          <DeleteFeatureStep {...payload} />
          <FinishedStep {...payload} />
        </Steps>
      )}
    </div>
  );
}
