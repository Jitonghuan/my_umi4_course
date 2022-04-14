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
  const { deployInfo, onOperate, envTypeCode, envCode, status, ...others } = props;
  // const { deployStatus, envs, deploySubStates, jenkinsUrl } = deployInfo || {};
  const { metadata, branchInfo, envInfo, buildInfo } = deployInfo || {};
  const { buildUrl } = buildInfo;
  const isError = status === 'error';

  const handleRebuildClick = () => {
    onOperate('retryDeployStart');

    Modal.confirm({
      title: '确定要重新构建吗?',
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        await retryBuild({ id: deployInfo.id, envCode });
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
      status={status}
      description={
        // isLoading && (
        <>
          {/* 浙一日常环境下的部署步骤显示jenkins链接,构建步骤下不显示。其他环境都是构建步骤下显示Jenkins详情 */}
          {buildUrl && !envInfo.deployEnvs?.includes('zy-daily') ? (
            <div style={{ marginTop: 2 }}>
              <a target="_blank" href={buildUrl}>
                构建详情
              </a>
            </div>
          ) : null}
          {isError && (
            <Button style={{ marginTop: 4, paddingLeft: 4, paddingRight: 4 }} onClick={handleRebuildClick}>
              重新构建
            </Button>
          )}
        </>
        // )
      }
    />
  );
}
