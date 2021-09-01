/**
 * PublishContent
 * @description 发布内容
 * @author moting.nq
 * @create 2021-04-15 10:22
 * @modified 2021/08/30 moyan
 */

import React, { useState, useContext } from 'react';
import { Modal, Button, message, Popconfirm } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import DetailContext from '@/pages/application/application-detail/context';
import ProdSteps from './prod-steps';
import TestEnvSteps from './test-steps';
import OtherEnvSteps from './other-env-steps';
import { createDeploy, updateFeatures, restartApp } from '@/pages/application/service';
import { IProps } from './types';
import './index.less';

const rootCls = 'publish-content-compo';

export default function PublishContent(props: IProps) {
  const { appCode, envTypeCode, deployedList, deployInfo, onOperate } = props;
  const { appData } = useContext(DetailContext);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const isProd = envTypeCode === 'prod';

  // 重新部署
  const handleReDeploy = () => {
    onOperate('retryDeployStart');

    Modal.confirm({
      title: '确定要重新部署吗?',
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        const features = deployedList.filter((el) => selectedRowKeys.includes(el.id)).map((el) => el.branchName);

        return updateFeatures({
          id: deployInfo.id,
          features,
        }).then(() => {
          onOperate('retryDeployEnd');
        });
      },
      onCancel() {
        onOperate('retryDeployEnd');
      },
    });
  };

  // 批量退出
  const handleBatchExit = () => {
    onOperate('batchExitStart');

    Modal.confirm({
      title: '确定要批量退出吗?',
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        const features = deployedList
          .filter((item) => !selectedRowKeys.includes(item.id))
          .map((item) => item.branchName);

        return createDeploy({
          appCode,
          envTypeCode,
          features,
          isClient: false,
        }).then(() => {
          onOperate('batchExitEnd');
        });
      },
      onCancel() {
        onOperate('batchExitEnd');
      },
    });
  };

  return (
    <div className={rootCls}>
      <div className={`${rootCls}__title`}>发布内容</div>

      {envTypeCode === 'prod' ? (
        <ProdSteps deployInfo={deployInfo} onOperate={onOperate} envTypeCode={envTypeCode} />
      ) : envTypeCode === 'test' ? (
        <TestEnvSteps deployInfo={deployInfo} onOperate={onOperate} envTypeCode={envTypeCode} />
      ) : (
        <OtherEnvSteps deployInfo={deployInfo} onOperate={onOperate} envTypeCode={envTypeCode} />
      )}

      <div className={`${rootCls}__list-wrap`}>
        <div className={`${rootCls}__list-header`}>
          <span className={`${rootCls}__list-header-text`}>内容列表</span>

          {!isProd && (
            <div className={`${rootCls}__list-header-btns`}>
              <Button
                type="primary"
                disabled={!selectedRowKeys.length}
                onClick={() => {
                  onOperate('retryDeployStart');

                  confirm({
                    title: '确定要重新部署吗?',
                    icon: <ExclamationCircleOutlined />,
                    onOk() {
                      const filter = deployedList
                        .filter((el) => selectedRowKeys.includes(el.id))
                        .map((el) => el.branchName);
                      return updateFeatures({
                        id: deployInfo.id,
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
                重新部署
              </Button>
              <Button
                type="primary"
                disabled={!selectedRowKeys.length}
                onClick={() => {
                  onOperate('batchExitStart');

                  confirm({
                    title: '确定要批量退出吗?',
                    icon: <ExclamationCircleOutlined />,
                    onOk: async () => {
                      return createDeploy({
                        appCode,
                        envTypeCode,
                        features: deployedList
                          .filter((item) => !selectedRowKeys.includes(item.id))
                          .map((item) => item.branchName),
                        isClient: false,
                      }).then(() => {
                        onOperate('batchExitEnd');
                      });
                    },
                    onCancel() {
                      onOperate('batchExitEnd');
                    },
                  });
                }}
              >
                批量退出
              </Button>
              <Popconfirm
                title="确定要重启应用吗？"
                onConfirm={async () => {
                  await restartApp({ appCode, envCode: deployInfo.envs, appCategoryCode: appData?.appCategoryCode });
                  message.success('操作成功！');
                }}
              >
                <Button>重启</Button>
              </Popconfirm>
            </div>
          )}
        </div>

        <HulkTable
          rowKey="id"
          className={`${rootCls}__list-table`}
          dataSource={deployedList}
          pagination={false}
          rowSelection={
            isProd
              ? {}
              : {
                  type: 'checkbox',
                  selectedRowKeys,
                  onChange: (selectedRowKeys: React.Key[]) => {
                    setSelectedRowKeys(selectedRowKeys as any);
                  },
                }
          }
          columns={createTableSchema() as any}
        />
      </div>

      <Table
        rowKey="id"
        dataSource={deployedList}
        pagination={false}
        bordered
        rowSelection={
          isProd
            ? {}
            : {
                type: 'checkbox',
                selectedRowKeys,
                onChange: (selectedRowKeys: React.Key[]) => {
                  setSelectedRowKeys(selectedRowKeys as string[]);
                },
              }
        }
        columns={tableSchema}
      />
    </div>
  );
}
