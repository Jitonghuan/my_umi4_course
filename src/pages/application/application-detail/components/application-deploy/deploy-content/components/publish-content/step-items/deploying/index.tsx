// deploying step
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/05 21:09

import React, { useState, useEffect } from 'react';
import { LoadingOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Steps, Button, Modal } from 'antd';
import { retryDeploy, retry } from '@/pages/application/service';
import { StepItemProps } from '../../types';
// import DeployModal from './deploy-modal';
import { history, Link } from 'umi';
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
    isFrontend = true,
    ...others
  } = props;
  const { metadata, branchInfo, envInfo, buildInfo } = deployInfo || {};
  const { deployingBatch, confirm } = item || {};
  const { id, appCode } = history.location.query || {};
  const { buildUrl } = buildInfo || {};
  const jenkinsUrl = getItemByKey(buildUrl, env) || '';
  const isLoading = status === 'process';
  const [deployVisible, setDeployVisible] = useState(false);

  useEffect(() => {
    if (status && status === 'finish') {
      setDeployVisible(false);
    }
  }, [status]);

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
          <>
            {/* dev,test, pre,prod 在部署过程中出现错误时  显示错误详情 */}
            {/* {isError && deployInfo.deployErrInfo && (
                <Button type='primary' style={{ marginTop: 2 }} onClick={()=>{history.push(`/matrix/application/detail/deployInfo?appCode=${deployInfo?.appCode}&id=${deployInfo?.id}`)}}>
                  错误详情
                </Button>
              )} */}
            {/* 浙一日常环境下的部署步骤显示jenkins链接 */}
            {/* {envTypeCode === 'pre' && jenkinsUrl && envInfo.deployEnvs?.includes('zy-daily') && (
                <div style={{ marginTop: 2 }}>
                  <a target="_blank" href={buildUrl}>
                    部署详情
                  </a>
                </div>
              )} */}
            {/* prod环境 在部署过程中出现错误时 判断如果是在构建显示查看Jenkins详情，如果是部署出现错误显示部署错误详情*/}
            {/* {envTypeCode === 'prod' && jenkinsUrl && (
                <div style={{ marginTop: 2 }}>
                  <a target="_blank" href={jenkinsUrl}>
                    部署详情
                  </a>
                </div>
              )} */}
            {confirm && confirm.waitConfirm && (
              <div>
                <a
                  style={{ marginTop: 2, marginLeft: -9 }}
                  onClick={() => {
                    setDeployVisible(true);
                  }}
                >
                  {confirm?.label}
                </a>
              </div>
            )}
            {status === 'process' && env && envTypeCode !== 'prod' && !isFrontend && (
              <div style={{ marginTop: 2 }}>
                <Button
                  size="small"
                  type="link"
                  style={{ marginLeft: '-22px' }}
                  onClick={() => {
                    localStorage.setItem('__init_env_tab__', envTypeCode);
                    history.replace({
                      pathname: `deployInfo`,
                      query: {
                        viewLogEnv: env || '',
                        viewLogEnvType: envTypeCode,
                        type: 'viewLog_goBack',
                        id: `${id}`,
                        appCode: appCode,
                      },
                    });
                  }}
                >
                  查看部署信息
                </Button>
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
              <Button style={{ marginLeft: '-22px', color: '#d48806' }} type="link" onClick={handleReDeployClick}>
                重新部署
              </Button>
            )}
            {/* prod 需要确认部署 */}
          </>
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
        showBuildUrl={false}
      />
    </>
  );
}
