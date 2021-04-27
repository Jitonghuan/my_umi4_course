/**
 * ProdSteps
 * @description 生产环境-发布步骤
 * @author moting.nq
 * @create 2021-04-24 09:03
 */

import React, { useMemo, useState } from 'react';
import { Steps, Button, Modal, Radio } from 'antd';
import { LoadingOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import DeployModal from './deploy-modal';
import {
  retryMerge,
  retryDeploy,
  reMergeMaster,
  retryDelFeature,
} from '../../../../../../../service';
import { IProps, Status } from './types';
// import './index.less';

const { Step } = Steps;
const { confirm } = Modal;

const rootCls = 'publish-content-compo';

const ProdSteps = ({ appCode, deployInfo, onOperate }: IProps) => {
  const [deployVisible, setDeployVisible] = useState(false);

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

    // 部署
    if (
      deployStatus === 'deployWait' ||
      deployStatus === 'deploying' ||
      deployStatus === 'deployWaitBatch2'
    ) {
      return 2.1;
    }
    if (deployStatus === 'deployErr' || deployStatus === 'deployAborted') {
      return 2.2;
    }

    // 合并master
    //  deployStatus: mergingMaster\mergeMasterErr
    if (deployStatus === 'mergingMaster') {
      return 3.1;
    }
    if (deployStatus === 'mergeMasterErr') {
      return 3.2;
    }

    // 删除feature
    // deletingFeature，deleteFeatureErr
    if (deployStatus === 'deletingFeature') {
      return 4.1;
    }
    if (deployStatus === 'deleteFeatureErr') {
      return 4.2;
    }

    if (deployStatus === 'deployFinish') {
      return 6;
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
                    retryMerge({ id: deployInfo.id }).finally(() =>
                      onOperate('mergeReleaseRetryEnd'),
                    );
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
                    reMergeMaster({ id: deployInfo.id }).finally(() =>
                      onOperate('mergeMasterRetryEnd'),
                    );
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
                    retryDelFeature({ id: deployInfo.id }).finally(() =>
                      onOperate('deleteFeatureRetryEnd'),
                    );
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
      />
    </>
  );
};

ProdSteps.defaultProps = {};

export default ProdSteps;
