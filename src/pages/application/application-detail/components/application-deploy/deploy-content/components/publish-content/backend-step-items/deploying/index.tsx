// deploying step
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/05 21:09

import React from 'react';
import { LoadingOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Steps, Button, Modal } from 'antd';
import { retryDeploy } from '@/pages/application/service';
import { StepItemProps } from '../../types';

export default function DeployingStep(props: StepItemProps) {
  const { deployInfo, deployStatus, onOperate, envTypeCode, ...others } = props;

  const isLoading = deployStatus === 'deploying';
  const isError = deployStatus === 'deployErr' || deployStatus === 'deployAborted';

  return (
    <Steps.Step
      {...others}
      title="部署"
      icon={isLoading && <LoadingOutlined />}
      status={isError ? 'error' : undefined}
      description={
        (isError || isLoading) && (
          <>
            {isError && (
              <>
                {deployInfo.deployErrInfo && (
                  <div
                    style={{ marginTop: 2 }}
                    onClick={() => {
                      Modal.info({
                        content: deployInfo.deployErrInfo,
                        title: '部署错误详情',
                      });
                    }}
                  >
                    部署错误详情
                  </div>
                )}
                <Button
                  style={{ marginTop: 4 }}
                  onClick={() => {
                    onOperate('retryDeployStart');
                    Modal.confirm({
                      title: '确定要重新部署吗?',
                      icon: <ExclamationCircleOutlined />,
                      onOk: async () => {
                        return retryDeploy({ id: deployInfo.id }).then(() => {
                          onOperate('retryDeployEnd');
                        });
                      },
                      onCancel() {
                        onOperate('retryDeployEnd');
                      },
                    });
                  }}
                >
                  重新部署
                </Button>
              </>
            )}
          </>
        )
      }
    />
  );
}
