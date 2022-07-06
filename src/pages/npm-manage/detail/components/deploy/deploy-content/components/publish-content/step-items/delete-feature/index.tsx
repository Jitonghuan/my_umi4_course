import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Steps, Button } from 'antd';
import {  retry } from '@/pages/application/service';
import { StepItemProps } from '../../types';

/** 删除feature */
export default function DeleteFeatureStep(props: StepItemProps) {
  const {
    deployInfo,
    deployStatus,
    onOperate,
    envTypeCode,
    env = '',
    isFrontend,
    appData,
    steps,
    status,
    ...others
  } = props;
  const { metadata } = deployInfo || {};
  const isError = status === 'error';
  const isLoading = status === 'process';

  const handleRetryDelClick = async () => {
    try {
      const params = { id: metadata?.id };
      if (env) {
        Object.assign(params, { envCode: env });
      }
      await retry({ ...params });
    } finally {
      onOperate('deleteFeatureRetryEnd');
    }
  };

  return (
    <Steps.Step
      {...others}
      title="删除feature"
      status={status}
      icon={isLoading && <LoadingOutlined />}
      description={
        isError && (
          <>
            <Button style={{ marginTop: 4 }} onClick={handleRetryDelClick}>
              重试
            </Button>
          </>
        )
      }
    />
  );
}
