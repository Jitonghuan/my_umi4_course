// 回滚前端版本
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/05 11:34

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {Modal, message, Table, Empty, Radio} from 'antd';
import { EnvDataVO, AppItemVO } from '@/pages/application/interfaces';
import { datetimeCellRender } from '@/utils';
import { rollbackFeApp } from '@/pages/application/service';
import { FeVersionItemVO } from './types';
import './index.less';

export interface RollbackVersionProps {
  appData?: AppItemVO;
  envItem?: EnvDataVO;
  versionList?: FeVersionItemVO[];
  onClose: () => any;
  onSubmit: () => any;
}

export default function RollbackVersion(props: RollbackVersionProps) {
  const { appData, envItem, versionList, onClose, onSubmit } = props;
  const [pdaDeployType, setPdaDeployType] = useState('bundles');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    if (!envItem) return;

    setSelectedRowKeys([]);
  }, [envItem]);

  function deployTypeChange(value: string) {
    setPdaDeployType(value);
    setSelectedRowKeys([]);
  }

  function getList () {
    if (appData?.feType === 'pda') {
      return versionList?.filter((val) => val.pdaDeployType === pdaDeployType);
    }
    return versionList;
  }

  const handleOk = useCallback(async () => {

    let param = {
      appCode: appData?.appCode,
      envCode: envItem?.envCode,
      version: selectedRowKeys[0],
    }
    if (appData?.feType === 'pda') {
      Object.assign(param, {
        pdaDeployType
      })
    }
    await rollbackFeApp(param);

    message.success('操作成功！');
    onSubmit();
  }, [appData, envItem, versionList, selectedRowKeys]);

  const currVersion = useMemo(() => {
    if (appData?.feType === 'pda') {
      return versionList?.find((n) => n.pdaDeployType === pdaDeployType && n.isActive === 0);
    }
    return versionList?.find((n) => n.isActive === 0);
  }, [versionList, pdaDeployType]);

  function getStatusName(status: number) {
    switch (status) {
      case 0:
        return '当前';
      case 2:
        return '部署中';
      case 3:
        return '部署失败';
      default:
        return '历史';
    }
  }

  return (
    <Modal
      visible={!!envItem}
      title="选择回滚版本"
      width={800}
      maskClosable={false}
      onCancel={onClose}
      onOk={handleOk}
      okButtonProps={{ disabled: !selectedRowKeys.length }}
    >
      {
        appData?.feType === 'pda' && (
          <div style={{marginBottom: '10px'}}>
            <span>打包类型：</span>
            <Radio.Group onChange={(e) => deployTypeChange(e.target.value)} value={pdaDeployType}>
              <Radio value='bundles'>bundles</Radio>
              <Radio value='apk'>apk</Radio>
            </Radio.Group>
          </div>
        )
      }
      <Table
        dataSource={getList() || []}
        rowClassName={(record) => {
          if (record.isActive === 0) {
            return 'table-color-rollback';
          } else if (record.isActive === 2) {
            return 'table-rollback-deployling';
          } else {
            return 'table-rollback';
          }
        }}
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
        <Table.Column dataIndex="gmtCreate" title="发布时间" render={datetimeCellRender} width={200} />
        <Table.Column dataIndex="gmtModify" title="修改时间" render={datetimeCellRender} width={200} />
        <Table.Column dataIndex="createUser" title="发布人" />
        <Table.Column dataIndex="modifyUser" title="更新人" />
        <Table.Column
          dataIndex="isActive"
          title="状态"
          render={(value: number) => {
            return getStatusName(value);
          }}
        />
      </Table>
    </Modal>
  );
}
