/**
 * OtherEnvSteps
 * @description 非生产环境-发布步骤
 * @author moting.nq
 * @create 2021-04-25 15:06
 */

import React, { useMemo, useState } from 'react';
import { Steps, Button, Modal, Radio } from 'antd';
import { LoadingOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { retryMerge, retryDeploy, retryBuild } from '../../../../../../../service';
import { IProps, Status } from './types';
// import './index.less';

const { Step } = Steps;
const { confirm } = Modal;

const rootCls = 'publish-content-compo';

const ProdSteps = ({ envTypeCode, deployInfo, onOperate }: IProps) => {
  const status = useMemo<Status>(() => {
    const { deployStatus } = deployInfo || {};

    if (!deployInfo || !deployInfo.id) return 0;

    // 合并release
    // deployStatus: merging\mergeErr\conflict, 有 mergeWebUrl 则展示
    if (deployStatus === 'merging') {
      return 1.1;
    }
    if (deployStatus === 'mergeErr' || deployStatus === 'conflict') {
      return 1.2;
    }

    //构建
    if (deployStatus === 'building') {
      return 2.1;
    }
    if (deployStatus === 'buildErr' || deployStatus === 'buildAborted') {
      return 2.2;
    }

    // 部署
    if (deployStatus === 'deploying') {
      return 3.1;
    }
    if (deployStatus === 'deployErr' || deployStatus === 'deployAborted') {
      return 3.2;
    }

    //执行完成
    if (deployStatus === 'deployFinish' || deployStatus === 'deployed') {
      return 4;
    }

    return 0;
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
        {/* XXX 卡点 */}
        <Step title="质量卡点" description="任务已跳过" status="finish" />
        <Step
          title="构建"
          icon={status === 2.1 && <LoadingOutlined />}
          status={status === 2.2 ? 'error' : undefined}
          description={
            (status === 2.2 || status === 2.1) && (
              <>
                {deployInfo.jenkinsUrl && (envTypeCode == 'dev' || envTypeCode == 'test') && (
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
                    {deployInfo.deployErrInfo && (envTypeCode == 'dev' || envTypeCode == 'test') && (
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
};

ProdSteps.defaultProps = {};

export default ProdSteps;
