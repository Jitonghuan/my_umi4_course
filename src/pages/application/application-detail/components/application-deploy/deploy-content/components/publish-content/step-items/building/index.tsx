// building steps
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/05 21:12

import React, { useState } from 'react';
import { LoadingOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Steps, Button, Modal } from 'antd';
import { retryBuild, retry } from '@/pages/application/service';
import { StepItemProps } from '../../types';
import BatchDeployModal from '../deploying/batch-deploy-modal';

/** 构建 */
export default function BuildingStep(props: StepItemProps) {
  const { deployInfo, onOperate, envTypeCode, env = '', status, getItemByKey, item, ...others } = props;
  const { metadata, branchInfo, envInfo, buildInfo } = deployInfo || {};
  const { deployingBatch, confirm } = item || {};
  const { buildUrl } = buildInfo || {};
  // const url = getItemByKey(buildUrl, env) ? getItemByKey(buildUrl, env) : '';
  const url = getItemByKey(buildUrl, 'singleBuild')
    ? getItemByKey(buildUrl, 'singleBuild')
    : getItemByKey(buildUrl, env)
    ? getItemByKey(buildUrl, env)
    : '';
  console.log(url, 'url');
  const isError = status === 'error';
  const isLoading = status === 'process';
  const [deployVisible, setDeployVisible] = useState(false);

  const handleRebuildClick = () => {
    onOperate('retryDeployStart');

    Modal.confirm({
      title: '确定要重新构建吗?',
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        const params = { id: metadata?.id };
        if (env) {
          Object.assign(params, { envCode: env });
        }
        await retry({ ...params });
        onOperate('retryDeployEnd');
      },
      onCancel: () => {
        onOperate('retryDeployEnd');
      },
    });
  };

  return (
    <>
      <Steps.Step
        {...others}
        title="构建"
        status={status}
        icon={isLoading && <LoadingOutlined />}
        description={
          // isLoading && (
          <>
            {/* 浙一日常环境下的部署步骤显示jenkins链接,构建步骤下不显示。其他环境都是构建步骤下显示Jenkins详情 */}
            {url && !envInfo?.deployEnvs?.includes('zy-daily') ? (
              <div style={{ marginTop: 2 }}>
                <a target="_blank" href={url}>
                  构建详情
                </a>
              </div>
            ) : null}
            {isError && (
              <Button style={{ marginTop: 4, paddingLeft: 4, paddingRight: 4 }} onClick={handleRebuildClick}>
                重新构建
              </Button>
            )}
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
          // )
        }
      />
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
        jenkinsUrl={url}
      />
    </>
  );
}
