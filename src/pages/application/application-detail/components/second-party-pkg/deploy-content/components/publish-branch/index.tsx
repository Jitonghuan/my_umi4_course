/**
 * PublishBranch
 * @description 待发布分支
 * @author moting.nq
 * @create 2021-04-15 10:22
 */

import React, { useState, useContext, useEffect } from 'react';
import { Steps, Button, message, Modal, Checkbox, Form, Select } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import HulkTable from '@cffe/vc-hulk-table';
import { createTableSchema } from './schema';
import DetailContext from '@/pages/application/application-detail/context';
import { createDeploy, updateFeatures, queryEnvsReq } from '@/pages/application/service';
import { IProps } from './types';
import './index.less';

const rootCls = 'publish-branch-compo';
const { confirm } = Modal;

export default function PublishBranch(props: IProps) {
  const { hasPublishContent, deployInfo, dataSource, onSubmitBranch, env } = props;
  const { appData } = useContext(DetailContext);
  const { appCategoryCode, appCode } = appData || {};

  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([]);
  const [deployVisible, setDeployVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [envDataList, setEnvDataList] = useState([]);
  const [deployEnv, setDeployEnv] = useState<any[]>();

  const submit = () => {
    const filter = dataSource.filter((el) => selectedRowKeys.includes(el.id)).map((el) => el.branchName);
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
      envTypeCode: env,
      features: filter,
      envCodes: deployEnv,
      isClient: true,
    }).then((res: any) => {
      if (!res.success) {
        message.error(res.errorMsg);
        throw Error;
      }
    });
  };

  const submitClick = () => {
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
  };

  useEffect(() => {
    if (!appCategoryCode) return;
    queryEnvsReq({
      categoryCode: appCategoryCode as string,
      envTypeCode: env,
      appCode,
    }).then((data) => {
      setEnvDataList(data.list);
    });
  }, [appCategoryCode, env]);

  return (
    <div className={rootCls}>
      <div className={`${rootCls}__title`}>待发布的分支</div>
      <div className={`${rootCls}__list-wrap`}>
        <div className={`${rootCls}__list-header`}>
          <span className={`${rootCls}__list-header-text`}>分支列表</span>

          <div className={`${rootCls}__list-header-btns`}>
            <Button type="primary" disabled={!selectedRowKeys?.length} onClick={submitClick}>
              提交分支
            </Button>
          </div>
        </div>

        <HulkTable
          rowKey="id"
          className={`${rootCls}__list-table`}
          dataSource={dataSource}
          bordered
          scroll={{ x: '100%' }}
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
          <Checkbox.Group value={deployEnv} onChange={(v) => setDeployEnv(v)} options={envDataList || []} />
        </div>
      </Modal>
    </div>
  );
}
