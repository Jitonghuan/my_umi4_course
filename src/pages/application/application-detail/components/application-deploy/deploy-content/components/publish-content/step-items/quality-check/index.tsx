// quality check step
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/05 21:09

import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Steps } from 'antd';
import {} from '@/pages/application/service';
import { StepItemProps } from '../../types';
import QualityCheckResult from './quality-check-result';

// 质量卡点结果前的状态
const prevDeployStatus = ['merging', 'mergeErr', 'conflict', 'qualityChecking'];

export default function QualityCheckStep(props: StepItemProps) {
  const { deployInfo, deployStatus, onOperate, envTypeCode, ...others } = props;

  const isLoading = deployStatus === 'qualityChecking';
  const isError = deployStatus === 'qualityFailed';
  const isFinishCheck = deployStatus && !prevDeployStatus.includes(deployStatus);

  return (
    <Steps.Step
      {...others}
      title="质量卡点"
      icon={isLoading && <LoadingOutlined />}
      status={isError ? 'error' : others.status}
      description={<QualityCheckResult visible={isFinishCheck} deployInfo={deployInfo} />}
    />
  );
}
