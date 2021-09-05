// deploying step
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/05 21:09

import React, { useState } from 'react';
import { LoadingOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Steps, Button, Modal } from 'antd';
import { retryDeploy } from '@/pages/application/service';
import { StepItemProps } from '../../types';
import DeployModal from './deploy-modal';

export default function DeployingStep(props: StepItemProps) {
  const { deployInfo, deployStatus, onOperate, envTypeCode, ...others } = props;

  const isLoading =
    deployStatus === 'deploying' || deployStatus === 'deployWait' || deployStatus === 'deployWaitBatch2';
  const isError = deployStatus === 'deployErr' || deployStatus === 'deployAborted';

  const [deployVisible, setDeployVisible] = useState(false);

  return (
    <>
      <Steps.Step
        {...others}
        title="部署"
        icon={isLoading && <LoadingOutlined />}
        status={isError ? 'error' : others.status}
        description={
          (isError || isLoading) && (
            <>
              {/* dev  显示错误详情 */}
              {isError && envTypeCode === 'dev' && deployInfo.deployErrInfo && (
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
              {/* test, pre, prod 显示 jenkins 详情 */}
              {envTypeCode !== 'dev' && deployInfo.jenkinsUrl && (
                <div style={{ marginTop: 2 }}>
                  <a target="_blank" href={deployInfo.jenkinsUrl}>
                    查看Jenkins详情
                  </a>
                </div>
              )}
              {isError && (
                <Button
                  style={{ marginTop: 4 }}
                  onClick={() => {
                    onOperate('retryDeployStart');
                    Modal.confirm({
                      title: '确定要重新部署吗?',
                      icon: <ExclamationCircleOutlined />,
                      onOk: async () => {
                        await retryDeploy({ id: deployInfo.id });
                        onOperate('retryDeployEnd');
                      },
                      onCancel() {
                        onOperate('retryDeployEnd');
                      },
                    });
                  }}
                >
                  重新部署
                </Button>
              )}
              {/* prod 需要确认部署 */}
              {envTypeCode === 'prod' && isLoading && (
                <a
                  style={{ marginTop: 4 }}
                  onClick={() => {
                    setDeployVisible(true);
                  }}
                >
                  确认部署
                </a>
              )}
            </>
          )
        }
      />
      <DeployModal
        visible={deployVisible}
        deployInfo={deployInfo}
        onCancel={() => setDeployVisible(false)}
        onOperate={onOperate}
        envTypeCode="prod"
      />
    </>
  );
}
