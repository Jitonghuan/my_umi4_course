// dependency check step
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/05 21:09

import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Steps } from 'antd';
import { StepItemProps } from '../../types';
import DependencyCheckResult from './dependency-check-result';

// 依赖检测结果前的状态
const prevDeployStatus = ['merging', 'mergeErr', 'conflict', 'qualityChecking'];

/** 依赖检测 */
export default function QualityCheckStep(props: StepItemProps) {
  const { deployInfo, deployStatus, onOperate, envTypeCode, isFrontend, status, ...others } = props;
  const isFinishCheck = (status === 'finish' || status === 'error') && !isFrontend;
  const isLoading = status === 'process';
  const isError = status === 'error';
  console.log('--------------deployInfo-----------', deployInfo);

  return (
    <Steps.Step
      {...others}
      title="依赖检测"
      icon={isLoading && <LoadingOutlined />}
      status={status}
      description={<DependencyCheckResult visible={isFinishCheck} deployInfo={deployInfo} status={status} />}
    />
  );
}
