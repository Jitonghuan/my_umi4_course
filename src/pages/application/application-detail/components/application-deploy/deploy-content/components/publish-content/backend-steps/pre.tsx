// pre steps
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/05 22:42

import React from 'react';
import { Steps } from 'antd';
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
};

export default function PreEnvSteps({ deployInfo, onOperate }: StepsProps) {
  const { deployStatus } = deployInfo || {};
  const status = deployStatusMapping[deployStatus] || -1;

  const payload = { deployInfo, onOperate, deployStatus: deployInfo.deployStatus, envTypeCode: 'pre' };

  return (
    <>
      <Steps className="publish-content-compo__steps" current={parseInt(status + '')}>
        <CreateTaskStep {...payload} />
        <MergeReleaseStep {...payload} />
        <BuildingStep {...payload} />
        <DeployingStep {...payload} />
        <FinishedStep {...payload} />
      </Steps>
    </>
  );
}
