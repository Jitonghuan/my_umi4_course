/**
 * PublishDetail
 * @description 发布详情
 * @author moting.nq
 * @create 2021-04-15 10:11
 */

import React, { useState, useContext, useEffect, useMemo } from 'react';
import { Descriptions, Button, Modal, message, Checkbox } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import DetailContext from '../../../../../context';
import {
  cancelDeploy,
  deployReuse,
  queryEnvsReq,
} from '../../../../../../service';
import { IProps } from './types';
import './index.less';

const rootCls = 'publish-detail-compo';
const { confirm } = Modal;

const PublishDetail = ({ deployInfo, env, onOperate }: IProps) => {
  const { appData } = useContext(DetailContext);
  const { appCategoryCode } = appData || {};

  const [deployVisible, setDeployVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [deployEnv, setDeployEnv] = useState<any[]>();
  const [envDataList, setEnvDataList] = useState([]);

  useEffect(() => {
    if (!appCategoryCode) return;
    queryEnvsReq({
      categoryCode: appCategoryCode as string,
      envTypeCode: env,
    }).then((data) => {
      setEnvDataList(data.list);
    });
  }, [appCategoryCode, env]);

  const envNames = useMemo(() => {
    const { envs } = deployInfo;
    const namesArr: any[] = [];
    if (envs?.indexOf(',') > -1) {
      const list = envs?.split(',') || [];
      envDataList?.forEach((item: any) => {
        list?.forEach((v: any) => {
          if (item?.envCode === v) {
            namesArr.push(item.envName);
          }
        });
      });
      return namesArr.join(',');
    }
    return (envDataList as any).find((v: any) => v.envCode === envs)?.envName;
  }, [envDataList, deployInfo]);

  return (
    <div className={rootCls}>
      <div className={`${rootCls}__right-top-btns`}>
        {env === 'cDev' && (
          <Button
            type="primary"
            onClick={() => {
              onOperate('deployNextEnvStart');
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
        <Descriptions.Item label="发布环境">{envNames}</Descriptions.Item>
        <Descriptions.Item label="冲突分支" span={3}>
          {deployInfo?.conflictFeature}
        </Descriptions.Item>
        <Descriptions.Item label="合并分支" span={3}>
          {deployInfo?.features}
        </Descriptions.Item>
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
            options={envDataList || []}
          />
        </div>
      </Modal>
    </div>
  );
};

PublishDetail.defaultProps = {};

export default PublishDetail;
