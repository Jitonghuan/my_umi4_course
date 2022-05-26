// finished step
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/05 21:09

import React, { useState } from 'react';
import { Steps, Button, message } from '@cffe/h2o-design';
import { StepItemProps } from '../../types';
import { downloadSource } from '@/pages/application/service';

/** 执行完成 */
export default function FinishedStep(props: StepItemProps) {
  const { deployInfo, deployStatus, onOperate, envTypeCode, status, env = '', ...others } = props;
  const { metadata, branchInfo, envInfo, buildInfo } = deployInfo || {};
  // const [downLoadStatus, setDownLoadStatus] = useState(false);
  return <Steps.Step {...others} title="完成" status={status} />;
}
