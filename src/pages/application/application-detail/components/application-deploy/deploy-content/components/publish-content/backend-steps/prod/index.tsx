/**
 * ProdSteps
 * @description 生产环境-发布步骤
 * @author moting.nq
 * @create 2021-04-24 09:03
 */

import React, { useMemo, useState } from 'react';
import { Steps, Button, Modal } from 'antd';
import { LoadingOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import DeployModal from './deploy-modal';
import { retryMerge, retryDeploy, reMergeMaster, retryDelFeature } from '@/pages/application/service';
import { StepsProps } from '../../types';

const { Step } = Steps;
const { confirm } = Modal;

const rootCls = 'publish-content-compo';

const deployStatusMapping: Record<string, number> = {
  // 合并release
  // 有 mergeWebUrl 则展示
  merging: 1.1,
  mergeErr: 1.2,
  conflict: 1.2,
  // 部署
  deployWait: 2.1,
  deploying: 2.1,
  deployWaitBatch2: 2.1,
  deployErr: 2.2,
  deployAborted: 2.2,
  // 合并master
  mergingMaster: 3.1,
  mergeMasterErr: 3.2,
  // 删除feature
  deletingFeature: 4.1,
  deleteFeatureErr: 4.2,
  deployFinish: 5,
  deployed: 5,
};

export default function ProdEnvSteps({ deployInfo, onOperate }: StepsProps) {
  const [deployVisible, setDeployVisible] = useState(false);

  const status = useMemo(() => {
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
          title="部署"
          icon={status === 2.1 && <LoadingOutlined />}
          status={status === 2.2 ? 'error' : undefined}
          description={
            (status === 2.1 || status === 2.2) && (
              <>
                {deployInfo.jenkinsUrl && (
                  <div style={{ marginTop: 2 }}>
                    <a target="_blank" href={deployInfo.jenkinsUrl}>
                      查看Jenkins详情
                    </a>
                  </div>
                )}

                {status === 2.2 ? (
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
                ) : (
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
        <Step
          title="合并master"
          icon={status === 3.1 && <LoadingOutlined />}
          status={status === 3.2 ? 'error' : undefined}
          description={
            status === 3.2 && (
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
                    reMergeMaster({ id: deployInfo.id }).finally(() => onOperate('mergeMasterRetryEnd'));
                  }}
                >
                  重试
                </Button>
              </>
            )
          }
        />
        <Step
          title="删除feature"
          icon={status === 4.1 && <LoadingOutlined />}
          status={status === 4.2 ? 'error' : undefined}
          description={
            status === 4.2 && (
              <>
                <Button
                  style={{ marginTop: 4 }}
                  onClick={() => {
                    retryDelFeature({ id: deployInfo.id }).finally(() => onOperate('deleteFeatureRetryEnd'));
                  }}
                >
                  重试
                </Button>
              </>
            )
          }
        />
        <Step title="执行完成" />
      </Steps>

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
