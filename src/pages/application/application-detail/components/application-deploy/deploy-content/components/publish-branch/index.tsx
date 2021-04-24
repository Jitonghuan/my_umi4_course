/**
 * PublishBranch
 * @description 待发布分支
 * @author moting.nq
 * @create 2021-04-15 10:22
 */

import React, { useState } from 'react';
import { Steps, Button, message, Modal, Checkbox } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import HulkTable from '@cffe/vc-hulk-table';
import { createTableSchema } from './schema';
import { createDeploy } from '../../../../../../service';
import { IProps } from './types';
import './index.less';

const rootCls = 'publish-branch-compo';
const { confirm } = Modal;

const PublishBranch = ({
  dataSource,
  onSubmitBranch,
  appCode,
  env,
}: IProps) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>();
  const [deployVisible, setDeployVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [deployEnv, setDeployEnv] = useState<any[]>();

  const submit = () => {
    return createDeploy({
      appCode,
      env,
      features: selectedRowKeys!,
      hospitals: env === 'prod' ? deployEnv : undefined,
    }).then((res: any) => {
      if (!res.success) {
        message.error(res.errorMsg);
        throw Error;
      }
    });
  };

  const submitClick = () => {
    onSubmitBranch?.('start');

    // 非生产环境
    if (env !== 'prod') {
      confirm({
        title: '确定要提交发布吗?',
        icon: <ExclamationCircleOutlined />,
        onOk() {
          return submit().then(() => {
            onSubmitBranch?.('end');
          });
        },
        onCancel() {
          onSubmitBranch?.('end');
        },
      });
      return;
    }

    // 生产环境
    setDeployVisible(true);
  };

  return (
    <div className={rootCls}>
      <div className={`${rootCls}__title`}>待发布的分支</div>

      <div className={`${rootCls}__list-wrap`}>
        <div className={`${rootCls}__list-header`}>
          <span className={`${rootCls}__list-header-text`}>分支列表</span>

          <div className={`${rootCls}__list-header-btns`}>
            <Button disabled={!selectedRowKeys?.length} onClick={submitClick}>
              提交分支
            </Button>
          </div>
        </div>

        <HulkTable
          rowKey="id"
          size="small"
          className={`${rootCls}__list-table`}
          dataSource={dataSource}
          pagination={false}
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys,
            onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
              setSelectedRowKeys(selectedRowKeys as any);
            },
          }}
          columns={createTableSchema() as any}
        />
      </div>

      <Modal
        title="选择发布环境"
        visible={deployVisible}
        confirmLoading={confirmLoading}
        onOk={() => {
          setConfirmLoading(true);
          return submit()
            .then(() => {
              setDeployVisible(false);
              onSubmitBranch?.('end');
            })
            .finally(() => setConfirmLoading(false));
        }}
        onCancel={() => {
          setDeployVisible(false);
          setConfirmLoading(false);
          onSubmitBranch?.('end');
        }}
      >
        <div>
          <span>发布环境：</span>
          {/* TODO 数据哪里来 */}
          <Checkbox.Group
            value={deployEnv}
            onChange={(v) => setDeployEnv(v)}
            options={[
              { label: '天台', value: '1' },
              { label: '巍山', value: '2' },
            ]}
          />
        </div>
      </Modal>
    </div>
  );
};

PublishBranch.defaultProps = {};

export default PublishBranch;
