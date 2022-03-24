// delete feature step
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/05 21:09

import React, { useEffect, useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Steps, Button } from 'antd';
import { retryDelFeature, venusAnalyze } from '@/pages/application/service';
import { StepItemProps } from '../../types';

/** 删除feature */
export default function DeleteFeatureStep(props: StepItemProps) {
  const { deployInfo, deployStatus, onOperate, envTypeCode, isFrontend, appData, steps, status, ...others } = props;
  const [venusLoading, setVenusLoading] = useState<boolean>(false);

  const isLoading = deployStatus === 'deletingFeature';
  const isError = deployStatus === 'deleteFeatureErr';

  const handleRetryDelClick = async () => {
    try {
      await retryDelFeature({ id: deployInfo.id });
    } finally {
      onOperate('deleteFeatureRetryEnd');
    }
  };

  async function analyze() {
    setVenusLoading(true);
    await venusAnalyze({
      appCode: appData.appCode,
      gitUrl: appData.gitAddress,
    });
    setVenusLoading(false);
  }

  useEffect(() => {
    if (steps && steps >= 7 && isFrontend && !venusLoading) {
      void analyze();
    }
  }, [deployStatus]);

  return (
    <Steps.Step
      {...others}
      title="删除feature"
      icon={isLoading && <LoadingOutlined />}
      // status={isError ? 'error' : others.status}
      status={status}
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
