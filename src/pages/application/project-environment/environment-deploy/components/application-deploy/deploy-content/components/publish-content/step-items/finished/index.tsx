// finished step
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/05 21:09

import React, { useState } from 'react';
import { Steps, Button, message } from 'antd';
import { StepItemProps } from '../../types';
import { downloadImage } from '@/pages/application/service';

/** 执行完成 */
export default function FinishedStep(props: StepItemProps) {
  const { deployInfo, deployStatus, onOperate, envTypeCode, projectEnvCode, ...others } = props;
  // const [downLoadStatus, setDownLoadStatus] = useState(false);
  return (
    <Steps.Step
      {...others}
      title="完成"
      description={
        (deployStatus === 'deployFinish' || deployStatus === 'deployed') &&
        (projectEnvCode?.includes('zs-prd') ||
          projectEnvCode?.includes('zs-pre') ||
          projectEnvCode?.includes('xiehe')) && (
          <Button
            download
            style={{ marginTop: 4 }}
            target="_blank"
            href={`${downloadImage}?id=${deployInfo.id}`}
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