// deploying step
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/05 21:09

import React, { useState } from 'react';
import { LoadingOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Steps, Button, Modal } from 'antd';
import { retryDeploy } from '@/pages/application/service';
import { StepItemProps } from '../../types';
import DeployModal from './deploy-modal';

/** 部署 */
export default function DeployingStep(props: StepItemProps) {
  const { deployInfo, deployStatus, onOperate, envTypeCode, envCode, ...others } = props;

  const isLoading =
    deployStatus === 'deploying' || deployStatus === 'deployWait' || deployStatus === 'deployWaitBatch2';
  const isError = deployStatus === 'deployErr';
  // || deployStatus === 'deployAborted';

  const [deployVisible, setDeployVisible] = useState(false);

  const handleShowErrorDetail = () => {
    Modal.info({
      content: deployInfo.deployErrInfo,
      title: '部署错误详情',
    });
  };

  const handleReDeployClick = () => {
    onOperate('retryDeployStart');

    Modal.confirm({
      title: '确定要重新部署吗?',
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        await retryDeploy({ id: deployInfo.id, envCode });
        onOperate('retryDeployEnd');
      },
      onCancel() {
        onOperate('retryDeployEnd');
      },
    });
  };

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
              {/* dev,test, pre,prod 在部署过程中出现错误时  显示错误详情 */}
              {/* {isError && deployInfo.deployErrInfo && (
                <Button type='primary' style={{ marginTop: 2 }} onClick={()=>{history.push(`/matrix/application/detail/deployInfo?appCode=${deployInfo?.appCode}&id=${deployInfo?.id}`)}}>
                  错误详情
                </Button>
              )} */}
              {/* 浙一日常环境下的部署步骤显示jenkins链接 */}
              {envTypeCode === 'pre' && deployInfo.jenkinsUrl && deployInfo.envs?.includes('zy-daily') && (
                <div style={{ marginTop: 2 }}>
                  <a target="_blank" href={deployInfo.jenkinsUrl}>
                    查看Jenkins详情
                  </a>
                </div>
              )}
              {/* prod环境 在部署过程中出现错误时 判断如果是在构建显示查看Jenkins详情，如果是部署出现错误显示部署错误详情*/}
              {envTypeCode === 'prod' && deployInfo.jenkinsUrl && (
                <div style={{ marginTop: 2 }}>
                  <a target="_blank" href={deployInfo.jenkinsUrl}>
                    查看Jenkins详情
                  </a>
                </div>
              )}

              {/* test, pre, prod 显示 jenkins 详情 */}
              {/* {envTypeCode !== 'dev' && deployInfo.jenkinsUrl && (
                <div style={{ marginTop: 2 }}>
                  <a target="_blank" href={deployInfo.}>
                    查看Jenkins详情
                  </a>
                </div>
              )} */}
              {isError && (
                <Button style={{ marginTop: 4 }} onClick={handleReDeployClick}>
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
