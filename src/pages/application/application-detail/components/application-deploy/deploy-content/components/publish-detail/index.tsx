/**
 * PublishDetail
 * @description 发布详情
 * @author moting.nq
 * @create 2021-04-15 10:11
 */

import React from 'react';
import { Descriptions, Button, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { cancelDeploy } from '../../../../../../service';
import { IProps } from './types';
import { doDeployReuseApi } from './service';
import './index.less';
import { postRequest } from '@/utils/request';

const rootCls = 'publish-detail-compo';
const { confirm } = Modal;

const PublishDetail = ({ deployInfo, env, onOperate }: IProps) => {
  const handleDelopy = async () => {
    // console.log('deployInfo', deployInfo);
    // const resp = postRequest(doDeployReuseApi, {
    //   data: {
    //     id:
    //     hospitals
    //   }
    // })
  };

  // console.log('env', env);

  return (
    <div className={rootCls}>
      <div className={`${rootCls}__right-top-btns`}>
        {env !== 'prod' && (
          <Button
            type="primary"
            onClick={() => {
              onOperate('deployNextEnvStart');

              confirm({
                title: '确定要把当前部署分支发布到下一个环境中？',
                icon: <ExclamationCircleOutlined />,
                onOk: () => {
                  // TODO
                  handleDelopy();
                  // return updateFeatures({
                  //   id: deployInfo.id,
                  // }).then(() => {
                  //   onOperate('deployNextEnvEnd');
                  // });
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
        <Descriptions.Item label="CRID">{deployInfo?.planId}</Descriptions.Item>
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
    </div>
  );
};

PublishDetail.defaultProps = {};

export default PublishDetail;
