/**
 * PublishContent
 * @description 发布内容
 * @author moting.nq
 * @create 2021-04-15 10:22
 */

import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import HulkTable from '@cffe/vc-hulk-table';
import ProdSteps from './prod-steps';
import OtherEnvSteps from './other-env-steps';
import { createTableSchema } from './schema';
import { cancelDeploy, reCommit, withdrawFeatures } from '@/pages/application/service';
import { IProps } from './types';
import DeploySteps from '@/pages/application/application-detail/components/application-deploy/deploy-content/components/publish-content/steps';
import './index.less';
import PipeLineManage from '../../../../application-deploy/pipelineManage';

const rootCls = 'publish-content-compo';
const { confirm } = Modal;

const PublishContent = ({
  appCode,
  envTypeCode,
  deployedList,
  deployInfo,
  pipelineCode,
  onSpin,
  stopSpin,
  onOperate,
  newPublish 
}: IProps) => {
  const isProd = envTypeCode === 'cProd';
  let { metadata, status, envInfo } = deployInfo || {};
  const { deployNodes } = status || {};
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  function getItemByKey(obj: any, envCode: string) {
    try {
      if (obj) {
        const keyList = Object.keys(obj) || [];
        if (keyList.length !== 0 && envCode) {
          return obj[envCode];
        } else {
          return '';
        }
      }
    } catch {
      return '';
    }
  }

  function onCancelDeploy(envCode?: string) {
    Modal.confirm({
      title: '确定要取消当前发布吗？',
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        return cancelDeploy({
          id: metadata?.id,
          envCode: envTypeCode,
        }).then(() => {});
      },
    });
  }

  return (
    <div className={rootCls}>
      <div className={`${rootCls}__title`}>发布内容</div>
      <div className={`${rootCls}__right-top-btns`}>
        {deployNodes?.length !== 0 && (
          <Button
            danger
            onClick={() => {
              onCancelDeploy();
            }}
          >
            取消发布
          </Button>
        )}
      </div>
      <DeploySteps
        stepData={deployNodes}
        deployInfo={deployInfo}
        pipelineCode={pipelineCode}
        appCode={appCode}
        onSpin={onSpin}
        stopSpin={stopSpin}
        onOperate={onOperate}
        isFrontend={false}
        envTypeCode={envTypeCode}
        deployedList={deployedList}
        getItemByKey={getItemByKey}
        isSecondPage={true}
      />

      <div className={`${rootCls}__list-wrap`}>
        <div className={`${rootCls}__list-header`}>
          <span className={`${rootCls}__list-header-text`}>内容列表</span>
          <div className={`${rootCls}__list-header-btns`}>
            {!isProd && (
              <Button
                type="primary"
                disabled={!selectedRowKeys.length}
                onClick={() => {
                  onOperate('retryDeployStart');

                  confirm({
                    title: '确定要重新提交吗?',
                    icon: <ExclamationCircleOutlined />,
                    onOk() {
                      const filter = deployedList
                        .filter((el) => selectedRowKeys.includes(el.id))
                        .map((el) => el.branchName);
                      return reCommit({
                        id: metadata.id,
                        features: filter,
                      }).then(() => {
                        onOperate('retryDeployEnd');
                      });
                    },
                    onCancel() {
                      onOperate('retryDeployEnd');
                    },
                  });
                }}
              >
                重新提交
              </Button>
            )}
            <Button
              type="primary"
              disabled={!selectedRowKeys.length}
              onClick={() => {
                onOperate('batchExitStart');

                confirm({
                  title: '确定要批量退出吗?',
                  icon: <ExclamationCircleOutlined />,
                  onOk() {
                    return withdrawFeatures({
                      // appCode,
                      // envTypeCode,
                      features: deployedList
                        .filter((item) => selectedRowKeys.includes(item.id))
                        .map((item) => item.branchName),
                      // isClient: true,
                      id: metadata?.id,
                    }).then((res) => {
                      if(res?.code===1001){
                        Modal.error({
                          title: '退出分支出错！',
                          content: res?.errorMsg,
                        });
                      }
                      onOperate('batchExitEnd');
                    });
                  },
                  onCancel() {
                    onOperate('batchExitEnd');
                  },
                });
              }}
            >
              退出分支
            </Button>
          </div>
        </div>

        <HulkTable
          rowKey="id"
          className={`${rootCls}__list-table`}
          dataSource={deployedList}
          pagination={false}
          bordered
          scroll={{ x: '100%' }}
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys,
            onChange: (selectedRowKeys: React.Key[]) => {
              setSelectedRowKeys(selectedRowKeys as any);
            },
          }}
          columns={createTableSchema() as any}
        />
      </div>
    </div>
  );
};

PublishContent.defaultProps = {};

export default PublishContent;
