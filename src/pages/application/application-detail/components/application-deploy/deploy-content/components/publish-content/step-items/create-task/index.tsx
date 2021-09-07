// create task
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/05 21:05

import React from 'react';
import { Steps } from 'antd';
import { StepItemProps } from '../../types';
/** 创建任务 */
export default function CreateTaskStep(props: StepItemProps) {
  const { deployInfo, deployStatus, onOperate, envTypeCode, ...others } = props;

  return <Steps.Step {...others} title="创建任务" />;
}
