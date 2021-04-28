/**
 * PublishDetail
 * @description 发布详情
 * @author moting.nq
 * @create 2021-04-15 10:11
 */

import React, { useState, useContext } from 'react';
import { Descriptions, Button, Modal, message, Checkbox } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import DetailContext from '../../../../../context';
import { cancelDeploy, deployReuse } from '../../../../../../service';
import { IProps } from './types';
import './index.less';

const rootCls = 'publish-detail-compo';
const { confirm } = Modal;
const hospitalMap: Record<string, any[]> = {
  g3a: [{ label: '浙一', value: 'zheyi' }],
  gmc: [
    { label: '天台', value: 'tiantai' },
    { label: '巍山', value: 'weishan' },
  ],
};

const PublishDetail = ({ deployInfo, env, onOperate }: IProps) => {
  const { appData } = useContext(DetailContext);
  const { belong } = appData || {};

  const [deployVisible, setDeployVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [deployEnv, setDeployEnv] = useState<any[]>();

  return (
    <div className={rootCls}>
      <div className={`${rootCls}__right-top-btns`}>
        {env !== 'prod' && (
          <Button
            type="primary"
            onClick={() => {
              onOperate('deployNextEnvStart');

              // 部署到生产环境
              if (env === 'poc') {
                setDeployVisible(true);
                return;
              }

              confirm({
                title: '确定要把当前部署分支发布到下一个环境中？',
                icon: <ExclamationCircleOutlined />,
                onOk: () => {
                  return deployReuse({ id: deployInfo.id }).then((res) => {
                    if (res.success) {
                      message.success('操作成功，正在部署中...');
                      onOperate('deployNextEnvSuccess');
                      return;
                    }
                  });
                },
                onCancel() {
                  onOperate('deployNextEnvEnd');
                },
              });
            }}
          >
            部署到下个环境
          </Button>
        )}

        <Button
          type="primary"
          danger
          onClick={() => {
            onOperate('cancelDeployStart');

            confirm({
              title: '确定要取消当前发布吗？',
              icon: <ExclamationCircleOutlined />,
              onOk() {
                return cancelDeploy({
                  id: deployInfo.id,
                }).then(() => {
                  onOperate('cancelDeployEnd');
                });
              },
              onCancel() {
                onOperate('cancelDeployEnd');
              },
            });
          }}
        >
          取消发布
        </Button>
      </div>

      <Descriptions
        title="发布详情"
        labelStyle={{ color: '#5F677A', textAlign: 'right' }}
        contentStyle={{ color: '#000' }}
      >
        <Descriptions.Item label="CRID">{deployInfo?.id}</Descriptions.Item>
        <Descriptions.Item label="部署分支">
          {deployInfo?.releaseBranch}
        </Descriptions.Item>
        <Descriptions.Item label="冲突分支">
          {deployInfo?.conflictFeature}
        </Descriptions.Item>
        <Descriptions.Item label="合并分支">
          {deployInfo?.features}
        </Descriptions.Item>
        {env === 'prod' && (
          <Descriptions.Item label="发布院区">
            {deployInfo?.hospitals}
          </Descriptions.Item>
        )}
      </Descriptions>

      <Modal
        title="选择发布环境"
        visible={deployVisible}
        confirmLoading={confirmLoading}
        onOk={() => {
          setConfirmLoading(true);

          return deployReuse({ id: deployInfo.id })
            .then((res) => {
              if (res.success) {
                message.success('操作成功，正在部署中...');
                setDeployVisible(false);
                onOperate('deployNextEnvEnd');
              }
            })
            .finally(() => setConfirmLoading(false));
        }}
        onCancel={() => {
          setDeployVisible(false);
          setConfirmLoading(false);
          onOperate('deployNextEnvEnd');
        }}
      >
        <div>
          <span>发布环境：</span>
          <Checkbox.Group
            value={deployEnv}
            onChange={(v) => setDeployEnv(v)}
            options={hospitalMap[belong!] || []}
          />
        </div>
      </Modal>
    </div>
  );
};

PublishDetail.defaultProps = {};

export default PublishDetail;
