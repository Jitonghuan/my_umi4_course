// merge release
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/05 21:09

import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Steps, Button } from 'antd';
import { retryMerge } from '@/pages/application/service';
import { StepItemProps } from '../../types';

export default function MergeReleaseStep(props: StepItemProps) {
  const { deployInfo, deployStatus, onOperate, envTypeCode, ...others } = props;

  const isLoading = deployStatus === 'merging';
  const isError = deployStatus === 'mergeErr' || deployStatus === 'conflict';

  const retryMergeClick = async () => {
    try {
      await retryMerge({ id: deployInfo.id });
    } finally {
      onOperate('mergeReleaseRetryEnd');
    }
  };

  return (
    <Steps.Step
      {...others}
      title="合并release"
      icon={isLoading && <LoadingOutlined />}
      status={isError ? 'error' : others.status}
      description={
        isError && (
          <>
            {deployInfo.mergeWebUrl && (
              <div style={{ marginTop: 2 }}>
                <a target="_blank" href={deployInfo.mergeWebUrl}>
                  查看合并详情
                </a>
              </div>
            )}
            <Button style={{ marginTop: 4 }} onClick={retryMergeClick}>
              重试
            </Button>
          </>
        )
      }
    />
  );
}
