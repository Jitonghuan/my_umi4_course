// 回滚前端版本
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/05 11:34

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Modal, message, Table, Empty } from 'antd';
import { EnvDataVO, AppItemVO } from '@/pages/application/interfaces';
import { datetimeCellRender } from '@/utils';
import { rollbackFeApp } from '@/pages/application/service';
import { FeVersionItemVO } from './types';

export interface RollbackVersionProps {
  appData?: AppItemVO;
  envItem?: EnvDataVO;
  versionList?: FeVersionItemVO[];
  onClose: () => any;
  onSubmit: () => any;
}

export default function RollbackVersion(props: RollbackVersionProps) {
  const { appData, envItem, versionList, onClose, onSubmit } = props;
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    if (!envItem) return;

    setSelectedRowKeys([]);
  }, [envItem]);

  const handleOk = useCallback(async () => {
    await rollbackFeApp({
      appCode: appData?.appCode,
      envCode: envItem?.envCode,
      version: selectedRowKeys[0],
    });

    message.success('操作成功！');
    onSubmit();
  }, [appData, envItem, versionList, selectedRowKeys]);

  const currVersion = useMemo(() => {
    return versionList?.find((n) => n.isActive === 0);
  }, [versionList]);

  return (
    <Modal
      visible={!!envItem}
      title="选择回滚版本"
      width={666}
      maskClosable={false}
      onCancel={onClose}
      onOk={handleOk}
      okButtonProps={{ disabled: !selectedRowKeys.length }}
    >
      <Table
        dataSource={versionList || []}
        rowSelection={{
          selectedRowKeys,
          type: 'radio',
          onChange: (nextKeys) => setSelectedRowKeys(nextKeys),
          getCheckboxProps: (record) => ({
            // 不能选择当前版本或部署中的版本
            disabled: record.isActive !== 1,
          }),
        }}
        onRow={(record) => ({
          onClick: () => {
            if (record.isActive !== 1) return;
            setSelectedRowKeys([record.version]);
          },
        })}
        rowKey="version"
        pagination={false}
        bordered
        locale={{ emptyText: <Empty description="没有可回滚的版本" image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}
        title={() => (
          <div className="rollback-modal-header">
            <span>当前版本：{currVersion?.version || '--'}</span>
            <span>
              {envItem?.envName} ({envItem?.envCode})
            </span>
          </div>
        )}
      >
        <Table.Column dataIndex="version" title="版本号" />
        <Table.Column dataIndex="gmtModify" title="发布时间" render={datetimeCellRender} width={160} />
        <Table.Column dataIndex="modifyUser" title="发布人" />
        <Table.Column
          dataIndex="isActive"
          title="状态"
          render={(value: number) => {
            return value === 0 ? '当前' : value === 2 ? '部署中' : '历史';
          }}
        />
      </Table>
    </Modal>
  );
}
