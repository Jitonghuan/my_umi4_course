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
  const { deployStatus } = deployInfo || {};
  const status = deployStatusMapping[deployStatus] || -1;

  const payload = { deployInfo, onOperate, deployStatus: deployInfo.deployStatus, envTypeCode: 'test' };

  return (
    <>
      <Steps className="publish-content-compo__steps" current={parseInt(status + '')}>
        <CreateTaskStep {...payload} />
        <MergeReleaseStep {...payload} />
        <QualityCheckStep {...payload} />
        <BuildingStep {...payload} />
        <DeployingStep {...payload} />
        <FinishedStep {...payload} />
      </Steps>
    </>
  );
}
