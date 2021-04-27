/**
 * PublishBranch
 * @description 待发布分支
 * @author moting.nq
 * @create 2021-04-15 10:22
 */

import React, { useState, useContext } from 'react';
import { Steps, Button, message, Modal, Checkbox } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import HulkTable from '@cffe/vc-hulk-table';
import { createTableSchema } from './schema';
import DetailContext from '../../../../../context';
import { createDeploy, updateFeatures } from '../../../../../../service';
import { IProps } from './types';
import './index.less';

const rootCls = 'publish-branch-compo';
const { confirm } = Modal;
const hospitalMap: Record<string, any[]> = {
  g3a: [{ label: '浙一', value: 'zheyi' }],
  gmc: [
    { label: '天台', value: 'tiantai' },
    { label: '巍山', value: 'weishan' },
  ],
};

const PublishBranch = ({
  hasPublishContent,
  deployInfo,
  dataSource,
  onSubmitBranch,
  env,
}: IProps) => {
  const { appData } = useContext(DetailContext);
  const { belong, appCode } = appData || {};

  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>(
    [],
  );
  const [deployVisible, setDeployVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [deployEnv, setDeployEnv] = useState<any[]>();

  const submit = () => {
    const filter = dataSource
      .filter((el) => selectedRowKeys.includes(el.id))
      .map((el) => el.branchName);
    // 如果有发布内容，接口调用为 更新接口，否则为 创建接口
    if (hasPublishContent) {
      return updateFeatures({
        id: deployInfo.id,
        features: filter,
      }).then((res: any) => {
        if (!res.success) {
          message.error(res.errorMsg);
          throw Error;
        }
      });
    }

    return createDeploy({
      appCode: appCode!,
      env,
      features: filter,
      hospitals: env === 'prod' ? deployEnv : undefined,
    }).then((res: any) => {
      if (!res.success) {
        message.error(res.errorMsg);
        throw Error;
      }
    });
  };

  const submitClick = () => {
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

PublishBranch.defaultProps = {};

export default PublishBranch;
