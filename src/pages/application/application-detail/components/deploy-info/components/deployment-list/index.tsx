import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Form, Modal, Radio, message, Table, Empty } from 'antd';
import { columns } from './columns';

export interface DeployContentProps {
  dataSource: any;
  loading: boolean;
}

export default function DeploymentList(props: DeployContentProps) {
  const { dataSource, loading } = props;
  return (
    <>
      <h3>控制器（deployment）事件：</h3>
      <Table
        scroll={{ y: window.innerHeight - 564 }}
        pagination={false}
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        locale={{ emptyText: <Empty description="没有事件" image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}
      />
    </>
  );
}
