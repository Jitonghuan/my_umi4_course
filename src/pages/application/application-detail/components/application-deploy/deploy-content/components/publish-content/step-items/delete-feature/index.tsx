// delete feature step
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/05 21:09

import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Steps, Button } from 'antd';
import { retryDelFeature } from '@/pages/application/service';
import { StepItemProps } from '../../types';

/** 删除feature */
export default function DeleteFeatureStep(props: StepItemProps) {
  const { deployInfo, deployStatus, onOperate, envTypeCode, ...others } = props;

  const isLoading = deployStatus === 'deletingFeature';
  const isError = deployStatus === 'deleteFeatureErr';

  const handleRetryDelClick = async () => {
    try {
      await retryDelFeature({ id: deployInfo.id });
    } finally {
      onOperate('deleteFeatureRetryEnd');
    }
  };

  return (
    <Steps.Step
      {...others}
      title="删除feature"
      icon={isLoading && <LoadingOutlined />}
      status={isError ? 'error' : others.status}
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