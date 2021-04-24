/**
 * PublishContent
 * @description 发布内容
 * @author moting.nq
 * @create 2021-04-15 10:22
 */

import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import { LoadingOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import HulkTable, { usePaginated } from '@cffe/vc-hulk-table';
import { useEffectOnce } from 'white-react-use';
import ProdSteps from './prod-steps';
import { createTableSchema } from './schema';
import { retryDeploy } from '../../../../../../service';
import { IProps } from './types';
import './index.less';

const rootCls = 'publish-content-compo';
const { confirm } = Modal;

const PublishContent = ({
  appCode,
  env,
  deployedList,
  deployInfo,
  onOperate,
}: IProps) => {
  const isProd = env === 'prod';

  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>();

  return (
    <div className={rootCls}>
      <div className={`${rootCls}__title`}>发布内容</div>

      {isProd ? (
        <ProdSteps
          appCode={appCode}
          deployInfo={deployInfo}
          onOperate={onOperate}
        />
      ) : null}

      <div className={`${rootCls}__list-wrap`}>
        <div className={`${rootCls}__list-header`}>
          <span className={`${rootCls}__list-header-text`}>内容列表</span>

          {!isProd && (
            <div className={`${rootCls}__list-header-btns`}>
              <Button
                onClick={() => {
                  onOperate('retryDeployStart');

                  confirm({
                    title: '确定要重新部署吗?',
                    icon: <ExclamationCircleOutlined />,
                    onOk() {
                      // TODO 接口不对
                      return retryDeploy({ ids: selectedRowKeys }).then(() => {
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
              <Button>批量退出</Button>
              <Button>重启</Button>
            </div>
          )}
        </div>

        <HulkTable
          rowKey="id"
          size="small"
          className={`${rootCls}__list-table`}
          dataSource={deployedList}
          pagination={false}
          rowSelection={
            isProd
              ? undefined
              : {
                  type: 'checkbox',
                  selectedRowKeys,
                  onChange: (
                    selectedRowKeys: React.Key[],
                    selectedRows: any[],
                  ) => {
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
