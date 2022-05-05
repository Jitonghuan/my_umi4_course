// building steps
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/05 21:12

import React, { useContext, useState } from 'react';
import { LoadingOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Steps, Button, Modal, message } from 'antd';
import { retryBuild, retry } from '@/pages/application/service';
import { StepItemProps } from '../../types';
import DetailContext from '@/pages/application/project-environment/environment-deploy/context';
import { downloadSource, listAppEnv } from '@/pages/application/service';
import { getRequest } from '@/utils/request';
import appConfig from '@/app.config';

/** 构建 */
export default function BuildingStep(props: StepItemProps) {
  const { deployInfo, onOperate, envTypeCode, envCode, status, getItemByKey, env = '', item, ...others } = props;
  // const { deployStatus, envs, deploySubStates, jenkinsUrl } = deployInfo || {};
  const { deployingBatch, confirm } = item || {};
  const { appData } = useContext(DetailContext);
  const [supportEnv, setSupportEnv] = useState<any>([]);
  const [disabled, setDisabled] = useState<boolean>(false);
  const { metadata, branchInfo, envInfo, buildInfo } = deployInfo || {};
  const { buildUrl } = buildInfo || {};
  const isNotFrontend = appData?.appType !== 'frontend';

  // const url = getItemByKey(buildUrl, env) ? getItemByKey(buildUrl, env) : '';

  const url = getItemByKey(buildUrl, 'singleBuild')
    ? getItemByKey(buildUrl, 'singleBuild')
    : getItemByKey(buildUrl, env)
    ? getItemByKey(buildUrl, env)
    : '';
  const isError = status === 'error';
  const isLoading = status === 'process';

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
    <Steps.Step
      {...others}
      title="构建"
      status={status}
      icon={isLoading && <LoadingOutlined />}
      description={
        // isLoading && (
        <>
          {/* 浙一日常环境下的部署步骤显示jenkins链接,构建步骤下不显示。其他环境都是构建步骤下显示Jenkins详情 */}
          {url && !envInfo.deployEnvs?.includes('zy-daily') ? (
            <div style={{ marginTop: 2 }}>
              <a target="_blank" href={url}>
                构建详情
              </a>
            </div>
          ) : null}
          {status === 'finish' && supportEnv?.includes(env) && appConfig.PRIVATE_METHODS === 'public' && isNotFrontend && (
            <Button
              download
              style={{ marginTop: 4 }}
              target="_blank"
              disabled={disabled}
              href={`${downloadSource}?id=${metadata?.id}&envCode=${env}`}
              // disabled={downLoadStatus}
              onClick={() => {
                setDisabled(true);
                setTimeout(() => {
                  setDisabled(false);
                }, 10000);
                message.info('镜像开始下载');
              }}
            >
              下载镜像
            </Button>
          )}
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
