// 生产环境-发布步骤
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/05 22:43

import React from 'react';
import { Steps } from 'antd';
import { StepsProps } from '../types';
import CreateTaskStep from '../step-items/create-task';
import MergeReleaseStep from '../step-items/merge-release';
import MergeMasterStep from '../step-items/merge-master';
import PushResourceStep from '../step-items/push-resource';
import GrayValidationStep from '../step-items/gray-validation';
import PushHTMLStep from '../step-items/push-html';
import DeleteFeatureStep from '../step-items/delete-feature';
import FinishedStep from '../step-items/finished';

const deployStatusMapping: Record<string, number> = {
  // 合并release
  merging: 1.1,
  mergeErr: 1.2,
  conflict: 1.2,
  // 推送前端资源
  pushFeResource: 2.1,
  pushFeResourceErr: 2.2,
  // 前端线上验证
  verifyWait: 3.1,
  verifyFailed: 3.2,
  // 推送前端版本
  pushVersion: 4.1,
  pushVersionErr: 4.2,
  // 合并master
  mergingMaster: 5.1,
  mergeMasterErr: 5.2,
  // 删除feature
  deletingFeature: 6.1,
  deleteFeatureErr: 6.2,
  // 完成
  deployFinish: 7,
  deployed: 7,
};

export default function ProdEnvSteps({ deployInfo, onOperate }: StepsProps) {
  const { deployStatus } = deployInfo || {};
  const status = deployStatusMapping[deployStatus] || -1;

  const payload = { deployInfo, onOperate, deployStatus: deployInfo.deployStatus, envTypeCode: 'prod' };

  return (
    <Steps className="publish-content-compo__steps" size="small" current={parseInt(status + '')}>
      <CreateTaskStep {...payload} />
      <MergeReleaseStep {...payload} />
      <PushResourceStep {...payload} />
      <GrayValidationStep {...payload} />
      <PushHTMLStep {...payload} />
      <MergeMasterStep {...payload} />
      <DeleteFeatureStep {...payload} />
      <FinishedStep {...payload} />
    </Steps>
  );
}
