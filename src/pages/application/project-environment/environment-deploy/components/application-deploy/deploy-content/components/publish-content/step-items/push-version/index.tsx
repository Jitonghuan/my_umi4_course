// publish html step
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/06 21:14

import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Steps, Button } from 'antd';
import { rePushFeVersion, retry } from '@/pages/application/service';
import { StepItemProps } from '../../types';

/** 发布HTML */
export default function PushVersionStep(props: StepItemProps) {
  const { deployInfo, deployStatus, onOperate, envTypeCode, env = '', ...others } = props;
  const { metadata, branchInfo, envInfo, buildInfo } = deployInfo || {};

  // const isLoading = deployStatus === 'pushVersion';
  // const isWait = deployStatus === 'deployWait' || deployStatus == 'verifySuccess';
  // const isError = deployStatus === 'pushVersionErr';
  const isLoading = status === 'process';
  const isWait = status === 'await';
  const isError = status === 'error';

  const handleRetryClick = async () => {
    try {
      const params = { id: metadata?.id };
      if (env) {
        Object.assign(params, { envCode: env });
      }
      await retry({ ...params });
    } finally {
      onOperate('rePushFeVersionEnd');
    }
  };

  return (
    <Steps.Step
      {...others}
      title="推送版本"
      icon={isLoading && <LoadingOutlined />}
      status={isError ? 'error' : others.status}
      description={
        <>
          {isWait && <span>等待推送</span>}
          {isError && (
            <Button type="primary" style={{ marginTop: 4 }} ghost onClick={handleRetryClick}>
              重试
            </Button>
          )}
        </>
      }
    />
  );
}
