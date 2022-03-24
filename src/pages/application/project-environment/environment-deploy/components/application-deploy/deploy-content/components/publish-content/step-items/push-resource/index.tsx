// publish resource step
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/06 21:14

import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Steps, Button } from 'antd';
import { rePushFeResource } from '@/pages/application/service';
import { StepItemProps } from '../../types';

/** 发布资源 */
export default function PushResourceStep(props: StepItemProps) {
  const { deployInfo, deployStatus, onOperate, envTypeCode, envCode, ...others } = props;

  const isLoading = deployStatus === 'pushFeResource';
  const isError = deployStatus === 'pushFeResourceErr';

  const handleRetryClick = async () => {
    try {
      await rePushFeResource({ id: deployInfo.id, envCode });
    } finally {
      onOperate('rePushFeResourceEnd');
    }
  };

  return (
    <Steps.Step
      {...others}
      title="推送资源"
      icon={isLoading && <LoadingOutlined />}
      status={isError ? 'error' : others.status}
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
