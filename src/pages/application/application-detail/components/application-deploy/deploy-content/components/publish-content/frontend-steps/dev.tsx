// dev steps
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/05 22:33

import React from 'react';
import { Steps } from 'antd';
import { StepsProps } from '../types';
import CreateTaskStep from '../step-items/create-task';
import MergeReleaseStep from '../step-items/merge-release';
import BuildingStep from '../step-items/building';
import PushResourceStep from '../step-items/push-resource';
import PushHTMLStep from '../step-items/push-html';
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
};

export default function DevEnvSteps({ deployInfo, onOperate }: StepsProps) {
  const { deployStatus } = deployInfo || {};
  const status = deployStatusMapping[deployStatus] || -1;

  const payload = { deployInfo, onOperate, deployStatus: deployInfo.deployStatus, envTypeCode: 'dev' };

  return (
    <>
      <Steps className="publish-content-compo__steps" current={parseInt(status + '')}>
        <CreateTaskStep {...payload} />
        <MergeReleaseStep {...payload} />
        <BuildingStep {...payload} />
        <PushResourceStep {...payload} />
        <PushHTMLStep {...payload} />
        <FinishedStep {...payload} />
      </Steps>
    </>
  );
}
