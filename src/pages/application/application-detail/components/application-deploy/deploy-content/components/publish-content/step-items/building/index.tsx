// building steps
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/05 21:12

import React from 'react';
import { LoadingOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Steps, Button, Modal } from 'antd';
import { retryBuild } from '@/pages/application/service';
import { StepItemProps } from '../../types';

/** 构建 */
export default function BuildingStep(props: StepItemProps) {
  const { deployInfo, deployStatus, onOperate, envTypeCode, ...others } = props;

  const isLoading = deployStatus === 'building';
  const isError = deployStatus === 'buildErr' || deployStatus === 'buildAborted';

  const handleRebuildClick = () => {
    onOperate('retryDeployStart');

    Modal.confirm({
      title: '确定要重新构建吗?',
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        await retryBuild({ id: deployInfo.id });
        onOperate('retryDeployEnd');
      },
      onCancel: () => {
        onOperate('retryDeployEnd');
      },
    });
  };

  return (
    <Steps.Step
      {...others}
      title="构建"
      icon={isLoading && <LoadingOutlined />}
      status={isError ? 'error' : others.status}
      description={
        (isError || isLoading) && (
          <>
            {deployInfo.jenkinsUrl && (
              <div style={{ marginTop: 2 }}>
                <a target="_blank" href={deployInfo.jenkinsUrl}>
                  查看Jenkins详情
                </a>
              </div>
            )}
            {isError && (
              <Button style={{ marginTop: 4 }} onClick={handleRebuildClick}>
                重新构建
              </Button>
            )}
          </>
        )
      }
    />
  );
}
