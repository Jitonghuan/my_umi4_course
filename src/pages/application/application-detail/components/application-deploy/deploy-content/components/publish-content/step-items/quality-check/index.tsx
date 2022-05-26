// quality check step
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/05 21:09

import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Steps } from '@cffe/h2o-design';
import {} from '@/pages/application/service';
import { StepItemProps } from '../../types';
import QualityCheckResult from './quality-check-result';

// 质量卡点结果前的状态
const prevDeployStatus = ['merging', 'mergeErr', 'conflict', 'qualityChecking'];

/** 质量卡点 */
export default function QualityCheckStep(props: StepItemProps) {
  const { deployInfo, deployStatus, onOperate, envTypeCode, isFrontend, status, ...others } = props;
  const isFinishCheck = status === 'finish' && envTypeCode === 'test' && !isFrontend;
  const isLoading = status === 'process';
  const isError = status === 'error';

  return (
    <Steps.Step
      {...others}
      title="质量卡点"
      icon={isLoading && <LoadingOutlined />}
      status={status}
      description={<QualityCheckResult visible={isFinishCheck} deployInfo={deployInfo} />}
    />
  );
}
