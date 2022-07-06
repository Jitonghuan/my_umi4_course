import React from 'react';
import { Steps } from 'antd';
import { StepItemProps } from '../../types';

/** 执行完成 */
export default function FinishedStep(props: StepItemProps) {
  const { deployInfo, deployStatus, onOperate, envTypeCode, status, env = '', ...others } = props;

  return <Steps.Step {...others} title="完成" status={status} />;
}
