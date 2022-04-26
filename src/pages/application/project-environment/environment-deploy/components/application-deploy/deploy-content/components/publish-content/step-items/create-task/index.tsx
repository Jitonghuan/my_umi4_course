// create task
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/05 21:05

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
      icon={isLoading && <LoadingOutlined />}
      title="创建任务"
      status={status}
      //  status={isError ? 'error' : others.status}
    />
  );
}
