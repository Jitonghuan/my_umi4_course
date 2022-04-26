// finished step
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/05 21:09

import React, { useState } from 'react';
import { Steps, Button, message } from 'antd';
import { StepItemProps } from '../../types';
import { downloadSource } from '@/pages/application/service';

/** 执行完成 */
export default function FinishedStep(props: StepItemProps) {
  const { deployInfo, deployStatus, onOperate, envTypeCode, projectEnvCode, status, env = '', ...others } = props;
  const { metadata, branchInfo, envInfo, buildInfo } = deployInfo || {};
  // const [downLoadStatus, setDownLoadStatus] = useState(false);
  return (
    <Steps.Step
      {...others}
      title="完成"
      status={status}
      description={
        status === 'finish' &&
        (projectEnvCode?.includes('zs-prd') ||
          projectEnvCode?.includes('zs-pre') ||
          projectEnvCode?.includes('xiehe')) && (
          <Button
            download
            style={{ marginTop: 4 }}
            target="_blank"
            href={`${downloadSource}?id=${metadata.id}&envCode=${env}`}
            // disabled={downLoadStatus}
            onClick={() => {
              message.info('镜像开始下载');
            }}
          >
            下载镜像
          </Button>
        )
      }
    />
  );
}
