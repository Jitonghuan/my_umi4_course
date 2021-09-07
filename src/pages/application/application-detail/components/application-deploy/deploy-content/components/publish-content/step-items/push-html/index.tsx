// publish html step
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/06 21:14

import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Steps, Button } from 'antd';
import { rePushFeVersion } from '@/pages/application/service';
import { StepItemProps } from '../../types';

/** 发布HTML */
export default function PushHTMLStep(props: StepItemProps) {
  const { deployInfo, deployStatus, onOperate, envTypeCode, ...others } = props;

  const isLoading = deployStatus === 'pushVersion';
  const isError = deployStatus === 'pushVersionErr';

  const handleRetryClick = async () => {
    try {
      await rePushFeVersion({ id: deployInfo.id });
    } finally {
      onOperate('rePushFeVersionEnd');
    }
  };

  return (
    <Steps.Step
      {...others}
      title="发布HTML"
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
