// 生产环境-发布步骤
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/05 22:43

import React from 'react';
import { Steps } from 'antd';
import { StepsProps } from '../types';
import CreateTaskStep from '../step-items/create-task';
import MergeReleaseStep from '../step-items/merge-release';
import DeployingStep from '../step-items/deploying';
import MergeMasterStep from '../step-items/merge-master';
import DeleteFeatureStep from '../step-items/delete-feature';
import FinishedStep from '../step-items/finished';

const deployStatusMapping: Record<string, number> = {
  // 合并release
  merging: 1.1,
  mergeErr: 1.2,
  conflict: 1.2,
  // 部署
  deployWait: 2.1,
  deploying: 2.1,
  deployWaitBatch2: 2.1,
  deployErr: 2.2,
  deployAborted: 2.2,
  // 合并master
  mergingMaster: 3.1,
  mergeMasterErr: 3.2,
  // 删除feature
  deletingFeature: 4.1,
  deleteFeatureErr: 4.2,
  // 完成
  deployFinish: 5,
  deployed: 5,
  multiEnvDeploying: 2,
};

export default function ProdEnvSteps({ deployInfo, onOperate, onSpin, stopSpin, deployedList }: StepsProps) {
  const { deployStatus } = deployInfo || {};
  let status = deployStatusMapping[deployStatus] || -1;
  if (deployStatus === 'deployAborted') {
    status = -1;
  }

  const payload = {
    deployInfo,
    onOperate,
    deployStatus: deployInfo.deployStatus,
    envTypeCode: 'prod',
    onSpin,
    stopSpin,
    deployedList,
  };

  return (
    <div className="publish-content-compo-wrapper">
      <Steps className="publish-content-compo__steps single-publish__steps" current={parseInt(status + '')}>
        <CreateTaskStep {...payload} />
        <MergeReleaseStep {...payload} />
        <DeployingStep {...payload} />
        <MergeMasterStep {...payload} />
        <DeleteFeatureStep {...payload} />
        <FinishedStep {...payload} />
      </Steps>
    </div>
  );
}
