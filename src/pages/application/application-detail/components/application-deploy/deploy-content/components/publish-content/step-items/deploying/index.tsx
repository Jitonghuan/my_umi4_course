// deploying step
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/05 21:09

import React, { useState } from 'react';
import { LoadingOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Steps, Button, Modal } from 'antd';
import { retryDeploy, retry } from '@/pages/application/service';
import { StepItemProps } from '../../types';
// import DeployModal from './deploy-modal';
import BatchDeployModal from './batch-deploy-modal';

/** 部署 */
export default function DeployingStep(props: StepItemProps) {
  const {
    deployInfo,
    deployStatus,
    onOperate,
    envTypeCode,
    getItemByKey,
    env = '',
    status,
    item,
    waitConfirm,
    ...others
  } = props;
  const { metadata, branchInfo, envInfo, buildInfo } = deployInfo || {};
  const { deployingBatch, confirm } = item || {};
  const { buildUrl } = buildInfo || {};
  const jenkinsUrl = getItemByKey(buildUrl, env) || '';
  const isLoading = status === 'process';

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
        const params = { id: metadata?.id };
        if (env) {
          Object.assign(params, { envCode: env });
        }
        await retry({ ...params });
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
        status={status}
        description={
          (status === 'error' || status === 'process') && (
            <>
              {/* dev,test, pre,prod 在部署过程中出现错误时  显示错误详情 */}
              {/* {isError && deployInfo.deployErrInfo && (
                <Button type='primary' style={{ marginTop: 2 }} onClick={()=>{history.push(`/matrix/application/detail/deployInfo?appCode=${deployInfo?.appCode}&id=${deployInfo?.id}`)}}>
                  错误详情
                </Button>
              )} */}
              {/* 浙一日常环境下的部署步骤显示jenkins链接 */}
              {envTypeCode === 'pre' && jenkinsUrl && envInfo.deployEnvs?.includes('zy-daily') && (
                <div style={{ marginTop: 2 }}>
                  <a target="_blank" href={buildUrl}>
                    部署详情
                  </a>
                </div>
              )}
              {/* prod环境 在部署过程中出现错误时 判断如果是在构建显示查看Jenkins详情，如果是部署出现错误显示部署错误详情*/}
              {envTypeCode === 'prod' && jenkinsUrl && (
                <div style={{ marginTop: 2 }}>
                  <a target="_blank" href={jenkinsUrl}>
                    部署详情
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
              {status === 'error' && (
                <Button
                  style={{ marginTop: 4, marginLeft: '-22px', color: '#d48806' }}
                  type="link"
                  onClick={handleReDeployClick}
                >
                  重新部署
                </Button>
              )}
              {/* prod 需要确认部署 */}
              {confirm && confirm.waitConfirm && (
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

      {/* <DeployModal
        // visible={deployVisible}
        deployInfo={deployInfo}
        onCancel={() => setDeployVisible(false)}
        onOperate={onOperate}
        envTypeCode="prod"
      /> */}
      <BatchDeployModal
        visible={deployVisible}
        deployInfo={deployInfo}
        onCancel={() => setDeployVisible(false)}
        onOperate={onOperate}
        envTypeCode={envTypeCode}
        env={env}
        envs={deployInfo?.envInfo?.deployEnvs || []}
        status={status}
        deployingBatch={deployingBatch}
        id={metadata?.id}
        jenkinsUrl={jenkinsUrl}
      />
    </>
  );
}
