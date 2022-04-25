// publish resource step
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/06 21:14

import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Steps, Button } from 'antd';
import { rePushFeResource, retry } from '@/pages/application/service';
import { StepItemProps } from '../../types';

/** 发布资源 */
export default function PushResourceStep(props: StepItemProps) {
  const { deployInfo, deployStatus, onOperate, envTypeCode, env = '', status, ...others } = props;
  const { metadata, branchInfo, envInfo, buildInfo } = deployInfo || {};
  // const isLoading = deployStatus === 'pushFeResource';
  // const isError = deployStatus === 'pushFeResourceErr';
  const isLoading = status === 'process';
  const isError = status === 'error';

  const handleRetryClick = async () => {
    try {
      const params = { id: metadata?.id };
      if (env) {
        Object.assign(params, { envCode: env });
      }
      await retry({ ...params });
    } finally {
      onOperate('rePushFeResourceEnd');
    }
  };

  return (
    <Steps.Step
      {...others}
      title="推送资源"
      icon={isLoading && <LoadingOutlined />}
      status={status}
      description={
        isError && (
          <Button type="primary" style={{ marginTop: 4 }} ghost onClick={handleRetryClick}>
            重试
          </Button>
        )
      }
    />
  );
}
