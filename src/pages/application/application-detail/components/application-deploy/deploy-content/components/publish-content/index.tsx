// 发布内容
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/05 22:57

import React, { useState, useContext } from 'react';
import { Modal, Button, message, Popconfirm, Table } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import DetailContext from '@/pages/application/application-detail/context';
import { datetimeCellRender } from '@/utils';
import { createDeploy, updateFeatures, restartApp } from '@/pages/application/service';
import { IProps } from './types';
import BackendDevEnvSteps from './backend-steps/dev';
import BackendTestEnvSteps from './backend-steps/test';
import BackendPreEnvSteps from './backend-steps/pre';
import BackendProdEnvSteps from './backend-steps/prod';
import FrontendDevEnvSteps from './frontend-steps/dev';
import FrontendTestEnvSteps from './frontend-steps/test';
import FrontendPreEnvSteps from './frontend-steps/pre';
import FrontendProdEnvSteps from './frontend-steps/prod';
import './index.less';

const rootCls = 'publish-content-compo';

const backendStepsMapping: Record<string, typeof BackendDevEnvSteps> = {
  dev: BackendDevEnvSteps,
  test: BackendTestEnvSteps,
  pre: BackendPreEnvSteps,
  prod: BackendProdEnvSteps,
};
const frontendStepsMapping: Record<string, typeof FrontendDevEnvSteps> = {
  dev: FrontendDevEnvSteps,
  test: FrontendTestEnvSteps,
  pre: FrontendPreEnvSteps,
  prod: FrontendProdEnvSteps,
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

  const isFrontend = appData?.appType === 'frontend';
  const CurrSteps = isFrontend ? frontendStepsMapping[envTypeCode] : backendStepsMapping[envTypeCode];

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
            {!isFrontend && (
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
            )}
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
      >
        <Table.Column dataIndex="id" title="ID" width={80} />
        <Table.Column dataIndex="branchName" title="分支名" />
        <Table.Column dataIndex="desc" title="变更原因" />
        <Table.Column dataIndex="gmtCreate" title="创建时间" width={160} render={datetimeCellRender} />
        <Table.Column dataIndex="createUser" title="创建人" width={80} />
      </Table>
    </div>
  );
}
