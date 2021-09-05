/**
 * TestEnvSteps
 * @description 测试环境-发布步骤
 * @author moting.nq
 * @create 2021-04-25 15:06
 */

import React, { useMemo } from 'react';
import { Steps, Button, Modal } from 'antd';
import { LoadingOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { retryMerge, retryDeploy, retryBuild } from '@/pages/application/service';
import { StepsProps } from '../../types';
import QualityCheckResult from './quality-check-result';

const { Step } = Steps;
const { confirm } = Modal;

const rootCls = 'publish-content-compo';

const deployStatusMapping: Record<string, number> = {
  // 合并release
  merging: 1.1,
  mergeErr: 1.2,
  conflict: 1.2,
  // 单测卡点
  qualityChecking: 2.1,
  qualityFailed: 2.2,
  // 构建
  building: 3.1,
  buildErr: 3.2,
  buildAborted: 3.2,
  // 部署
  deploying: 4.1,
  deployErr: 4.2,
  deployAborted: 4.2,
  // 完成
  deployFinish: 5,
  deployed: 5,
};

export default function TestEnvSteps({ deployInfo, onOperate }: StepsProps) {
  const { deployStatus } = deployInfo || {};
  const status = deployStatusMapping[deployStatus] || 0;

  return (
    <>
      <Steps className={`${rootCls}__steps`} current={parseInt(status + '')}>
        <Step title="创建任务" />
        <Step
          title="合并release"
          icon={deployStatus === 'merging' && <LoadingOutlined />}
          status={deployStatus === 'mergeErr' ? 'error' : undefined}
          description={
            deployStatus === 'conflict' && (
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
          title="质量卡点"
          icon={deployStatus === 'qualityChecking' && <LoadingOutlined />}
          status={deployStatus === 'qualityFailed' ? 'error' : undefined}
          description={<QualityCheckResult visible={status >= 2.2} deployInfo={deployInfo} />}
        />
        <Step
          title="构建"
          icon={deployStatus === 'building' && <LoadingOutlined />}
          status={['buildErr', 'buildAborted'].includes(deployStatus) ? 'error' : undefined}
          description={
            ['building', 'buildErr', 'buildAborted'].includes(deployStatus) && (
              <>
                {deployInfo.jenkinsUrl && (
                  <div style={{ marginTop: 2 }}>
                    <a target="_blank" href={deployInfo.jenkinsUrl}>
                      查看Jenkins详情
                    </a>
                  </div>
                )}
                {['buildErr', 'buildAborted'].includes(deployStatus) && (
                  <Button
                    style={{ marginTop: 4 }}
                    onClick={() => {
                      onOperate('retryDeployStart');

                      confirm({
                        title: '确定要重新构建吗?',
                        icon: <ExclamationCircleOutlined />,
                        onOk: async () => {
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
          icon={status === 4.1 && <LoadingOutlined />}
          status={status === 4.2 ? 'error' : undefined}
          description={
            (status === 4.2 || status === 4.1) && (
              <>
                {status === 4.2 && (
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
