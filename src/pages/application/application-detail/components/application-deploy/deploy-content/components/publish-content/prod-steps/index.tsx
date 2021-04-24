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

  // TODO
  const status = useMemo<Status>(() => {
    return 6;
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
                <div style={{ margin: '2px 0 4px' }}>
                  <a target="_blank" href={deployInfo.mergeWebUrl}>
                    查看合并详情
                  </a>
                </div>
                <Button
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
                <div style={{ margin: '2px 0 4px' }}>
                  <a target="_blank" href={deployInfo.jenkinsUrl}>
                    查看Jenkins详情
                  </a>
                </div>

                {status === 2.2 ? (
                  <Button
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
                <div style={{ margin: '2px 0 4px' }}>
                  <a target="_blank" href={deployInfo.mergeWebUrl}>
                    查看合并详情
                  </a>
                </div>
                <Button
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
