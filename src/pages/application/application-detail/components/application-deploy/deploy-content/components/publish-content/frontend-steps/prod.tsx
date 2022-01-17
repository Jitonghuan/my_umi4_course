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
  // 推送前端版本
  pushVersion: 5.1,
  pushVersionErr: 5.2,
  // 合并master
  mergingMaster: 6.1,
  mergeMasterErr: 6.2,
  // 删除feature
  deletingFeature: 7.1,
  deleteFeatureErr: 7.2,
  // 完成
  deployFinish: 8,
  deployed: 8,
};

export default function ProdEnvSteps({ deployInfo, onOperate }: StepsProps) {
  const { deployStatus, envs, deploySubStates, jenkinsUrl } = {
    id: 18617,
    appCode: 'gmc-emr',
    envTypeCode: 'test',
    releaseBranch: 'master',
    features: 'master',
    unMergedFeatures: '',
    conflictFeature: '',
    mergeWebUrl: '',
    deployStatus: 'multiEnvDeploying',
    deploySubStates:
      '[{"envCode":"gmc-test","subState":"building"},{"envCode":"hbos-test","subState":"verifyWait"},{"envCode":"gmc-dev","subState":"building"}]',
    envs: 'gmc-test,hbos-test,gmc-dev',
    deployedEnvs: 'gmc-test,hbos-test,gmc-dev',
    deployingEnv: 'gmc-test,hbos-test,gmc-dev',
    deployingEnvBatch: 0,
    tagName: '',
    jenkinsUrl:
      '[{"envCode":"gmc-test","subJenkinsUrl":"http://jenkins-gmc-dev.cfuture.shop/job/gmc-emr/550/console"},{"envCode":"hbos-test","subJenkinsUrl":"http://jenkins-gmc-dev.cfuture.shop/job/gmc-emr/551/console"}]',
    image:
      '[{"envCode":"gmc-test","image":"cfuture-harbor-registry-vpc.cn-hangzhou.cr.aliyuncs.com/c2f/hbos-emr:1638860778","deployTime":"2021-12-07 15:06:18"}]',
    jarPath: 'hbos-emr.jar',
    deployedTime: '',
    groupId: 'com.c2f.hbos',
    artifactId: 'hbos-emr-starter',
    version: '1.1.0-SNAPSHOT',
    deployType: 0,
    isActive: 1,
    deployErrInfo: '[{"envCode":"gmc-test","subErrInfo":"错误信息1"},{"envCode":"hbos-test","subErrInfo":"错误信息2"}]',
    filePath: '',
    createUser: '张久明',
    modifyUser: '张久明',
    gmtCreate: '2021-12-07T15:06:18+08:00',
    gmtModify: '2022-01-10T20:56:51+08:00',
  };
  const status = deployStatusMapping[deployStatus] || -1;

  const payload = { deployInfo, onOperate, deployStatus: deployInfo.deployStatus, envTypeCode: 'prod' };
  const envList = envs ? envs.split(',') : [];

  function getItemByKey(listStr: string, envCode: string) {
    const list = listStr ? JSON.parse(listStr) : [];
    const item = list.find((val: any) => val.envCode === envCode);
    return item || {};
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
          </Steps>

          <Steps
            className="last_process-wrapper"
            initial={6}
            style={{ left: getSubConW() }}
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
          >
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
