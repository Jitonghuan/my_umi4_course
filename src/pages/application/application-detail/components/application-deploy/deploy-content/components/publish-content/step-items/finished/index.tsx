// finished step
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/05 21:09

import React, { useState } from 'react';
import { Steps, Button } from 'antd';
import { StepItemProps } from '../../types';
import { downloadImage } from '@/pages/application/service';

/** 执行完成 */
export default function FinishedStep(props: StepItemProps) {
  const { deployInfo, deployStatus, onOperate, envTypeCode, ...others } = props;
  const [downLoadStatus, setDownLoadStatus] = useState(false);

  return (
    <Steps.Step
      {...others}
      title="执行完成"
      description={
        deployStatus === 'deployFinish' &&
        deployInfo.envs?.includes('zs-prd') && (
          <Button
            download
            style={{ marginTop: 4 }}
            target="_blank"
            href={`${downloadImage}?id=${deployInfo.id}`}
            disabled={downLoadStatus}
            onClick={() => setDownLoadStatus(true)}
          >
            下载镜像
          </Button>
        )
      }
    />
  );
}
