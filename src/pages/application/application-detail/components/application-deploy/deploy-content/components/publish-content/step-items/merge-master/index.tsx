//
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/05 21:09

import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Steps, Button } from 'antd';
import { retry } from '@/pages/application/service';
import { StepItemProps } from '../../types';

/** 合并master */
export default function MergeMasterStep(props: StepItemProps) {
  const { deployInfo, onOperate, envTypeCode, status, env = '', ...others } = props;
  const { metadata } = deployInfo || {};
  const isLoading = status === 'process';
  const isError = status === 'error';

  const retryMergeMasterClick = async () => {
    try {
      const params = { id: metadata?.id };
      if (env) {
        Object.assign(params, { envCode: env });
      }
      await retry({ ...params });
    } finally {
      onOperate('mergeMasterRetryEnd');
    }
  };

  return (
    <Steps.Step
      {...others}
      title="合并master"
      icon={isLoading && <LoadingOutlined />}
      status={status}
      description={
        isError && (
          <>
            {/* {deployInfo.mergeWebUrl && (
              <div style={{ marginTop: 2 }}>
                <a target="_blank" href={deployInfo.mergeWebUrl}>
                  查看合并详情
                </a>
              </div>
            )} */}
            <Button style={{ marginTop: 4 }} onClick={retryMergeMasterClick}>
              重试
            </Button>
          </>
        )
      }
    />
  );
}
