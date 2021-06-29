/**
 * PublishContent
 * @description 发布内容
 * @author moting.nq
 * @create 2021-04-15 10:22
 */

import React, { useState } from 'react';
import { Modal, Button, message, Popconfirm } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import HulkTable from '@cffe/vc-hulk-table';
import ProdSteps from './prod-steps';
import OtherEnvSteps from './other-env-steps';
import { createTableSchema } from './schema';
import { createDeploy, updateFeatures, restartApp } from '../../../../../../service';
import { IProps } from './types';
import './index.less';

const rootCls = 'publish-content-compo';
const { confirm } = Modal;

const PublishContent = ({ appCode, envTypeCode, deployedList, deployInfo, onOperate }: IProps) => {
  const isProd = envTypeCode === 'prod';

  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  return (
    <div className={rootCls}>
      <div className={`${rootCls}__title`}>发布内容</div>

      {isProd ? (
        <ProdSteps appCode={appCode} deployInfo={deployInfo} onOperate={onOperate} envTypeCode={envTypeCode} />
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
                    onOk() {
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
                  await restartApp({ appCode, envCode: deployInfo.envs });
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
    </div>
  );
};

PublishContent.defaultProps = {};

export default PublishContent;
