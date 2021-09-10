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
  const { deployStatus } = deployInfo || {};
  const status = deployStatusMapping[deployStatus] || -1;

  const payload = { deployInfo, onOperate, deployStatus: deployInfo.deployStatus, envTypeCode: 'prod' };

  return (
    <Steps className="publish-content-compo__steps" size="small" current={parseInt(status + '')}>
      <CreateTaskStep {...payload} />
      <MergeReleaseStep {...payload} />
      <BuildingStep {...payload} />
      <PushResourceStep {...payload} />
      <GrayValidationStep {...payload} />
      <PushVersionStep {...payload} />
      <MergeMasterStep {...payload} />
      <DeleteFeatureStep {...payload} />
      <FinishedStep {...payload} />
    </Steps>
  );
}
