// finished step
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/05 21:09

import React from 'react';
import { Steps } from 'antd';
import { StepItemProps } from '../../types';

export default function FinishedStep(props: StepItemProps) {
  const { deployInfo, deployStatus, onOperate, envTypeCode, ...others } = props;

  return <Steps.Step {...others} title="执行完成" />;
}
