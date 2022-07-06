import React from 'react';
import { Steps } from 'antd';
import { StepItemProps } from '../../types';
import { LoadingOutlined } from '@ant-design/icons';

/** 创建任务 */
export default function CreateTaskStep(props: StepItemProps) {
  const { deployInfo, deployStatus, onOperate, envTypeCode, status, ...others } = props;
  const isLoading = status === 'process';

  return (
    <Steps.Step
      {...others}
      title="创建任务"
      icon={isLoading && <LoadingOutlined />}
      status={status}
    />
  );
}
