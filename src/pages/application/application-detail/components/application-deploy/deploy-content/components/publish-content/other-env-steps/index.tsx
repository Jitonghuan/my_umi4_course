/**
 * OtherEnvSteps
 * @description 非生产环境-发布步骤
 * @author moting.nq
 * @create 2021-04-25 15:06
 */

import React, { useMemo } from 'react';
import { Steps, Button, Modal } from 'antd';
import { LoadingOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { retryMerge, retryDeploy, retryBuild } from '../../../../../../../service';
import { IProps, Status } from './types';

const { Step } = Steps;
const { confirm } = Modal;

const rootCls = 'publish-content-compo';

const deployStatusMapping: Record<string, Status> = {
  // 合并release
  merging: 1.1,
  mergeErr: 1.2,
  conflict: 1.2,
  // 构建
  building: 2.1,
  buildErr: 2.2,
  buildAborted: 2.2,
  // 部署
  deploying: 3.1,
  deployErr: 3.2,
  deployAborted: 3.2,
  // 完成
  deployFinish: 4,
  deployed: 4,
};

export default function ProdSteps({ envTypeCode, deployInfo, onOperate }: IProps) {
  const status = useMemo<Status>(() => {
    const { deployStatus } = deployInfo || {};

    if (!deployInfo || !deployInfo.id) return 0;

    return deployStatusMapping[deployStatus] || 0;
  }, [deployInfo]);

  return (
    <>
      <Steps className={`${rootCls}__steps`} current={parseInt(status + '')}>
        <Step title="创建任务" />
        <Step
          title="合并release"
          icon={status === 1.1 && <LoadingOutlined />}
          status={status === 1.2 ? 'error' : undefined}
          description={
            status === 1.2 && (
              <>
                {deployInfo.mergeWebUrl && (
                  <div style={{ marginTop: 2 }}>
                    <a target="_blank" href={deployInfo.mergeWebUrl}>
                      查看合并详情
                    </a>
                  </div>
                )}
                <Button
                  style={{ marginTop: 4 }}
                  onClick={() => {
                    retryMerge({ id: deployInfo.id }).finally(() => onOperate('mergeReleaseRetryEnd'));
                  }}
                >
                  重试
                </Button>
              </>
            )
          }
        />
        <Step
          title="构建"
          icon={status === 2.1 && <LoadingOutlined />}
          status={status === 2.2 ? 'error' : undefined}
          description={
            (status === 2.2 || status === 2.1) && (
              <>
                {deployInfo.jenkinsUrl && envTypeCode === 'dev' && (
                  <div style={{ marginTop: 2 }}>
                    <a target="_blank" href={deployInfo.jenkinsUrl}>
                      查看Jenkins详情
                    </a>
                  </div>
                )}
                {status === 2.2 && (
                  <Button
                    style={{ marginTop: 4 }}
                    onClick={() => {
                      onOperate('retryDeployStart');

                      confirm({
                        title: '确定要重新构建吗?',
                        icon: <ExclamationCircleOutlined />,
                        onOk() {
                          return retryBuild({ id: deployInfo.id }).then(() => {
                            onOperate('retryDeployEnd');
                          });
                        },
                        onCancel() {
                          onOperate('retryDeployEnd');
                        },
                      });
                    }}
                  >
                    重新构建
                  </Button>
                )}
              </>
            )
          }
        />
        <Step
          title="部署"
          icon={status === 3.1 && <LoadingOutlined />}
          status={status === 3.2 ? 'error' : undefined}
          description={
            (status === 3.2 || status === 3.1) && (
              <>
                {deployInfo.jenkinsUrl && envTypeCode === 'pre' && (
                  <div style={{ marginTop: 2 }}>
                    <a target="_blank" href={deployInfo.jenkinsUrl}>
                      查看Jenkins详情
                    </a>
                  </div>
                )}
                {status === 3.2 && (
                  <>
                    {deployInfo.deployErrInfo && envTypeCode === 'dev' && (
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
                        confirm({
                          title: '确定要重新部署吗?',
                          icon: <ExclamationCircleOutlined />,
                          onOk() {
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
        <Step title="执行完成" />
      </Steps>
    </>
  );
}
