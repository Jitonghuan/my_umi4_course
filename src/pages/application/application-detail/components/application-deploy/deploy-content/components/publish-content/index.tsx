/**
 * PublishContent
 * @description 发布内容
 * @author moting.nq
 * @create 2021-04-15 10:22
 * @modified 2021/08/30 moyan
 */

import React, { useState, useContext } from 'react';
import { Table, Modal, Button, message, Popconfirm } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import DetailContext from '@/pages/application/application-detail/context';
import { tableSchema } from './schema';
import { createDeploy, updateFeatures, restartApp } from '@/pages/application/service';
import { IProps, StepsProps } from './types';
import DevEnvSteps from './backend-steps/dev';
import TestEnvSteps from './backend-steps/test';
import PreEnvSteps from './backend-steps/pre';
import ProdEnvSteps from './backend-steps/prod';
import './index.less';

const rootCls = 'publish-content-compo';

const StepsMapping: Record<string, (props: StepsProps) => JSX.Element> = {
  dev: DevEnvSteps,
  test: TestEnvSteps,
  pre: PreEnvSteps,
  prod: ProdEnvSteps,
};

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

  const CurrSteps = StepsMapping[envTypeCode];

  return (
    <div className={rootCls}>
      <div className={`${rootCls}__title`}>发布内容</div>

      <CurrSteps deployInfo={deployInfo} onOperate={onOperate} />

      <div className="table-caption" style={{ marginTop: 16 }}>
        <h4>内容列表</h4>
        {!isProd && (
          <div className="caption-right">
            <Button type="primary" disabled={!selectedRowKeys.length} onClick={handleReDeploy}>
              重新部署
            </Button>
            <Button type="primary" disabled={!selectedRowKeys.length} onClick={handleBatchExit}>
              批量退出
            </Button>
            <Popconfirm
              title="确定要重启应用吗？"
              onConfirm={async () => {
                await restartApp({
                  appCode,
                  envCode: deployInfo.envs,
                  appCategoryCode: appData?.appCategoryCode,
                });
                message.success('操作成功！');
              }}
            >
              <Button>重启</Button>
            </Popconfirm>
          </div>
        )}
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
