import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Form, Modal, Radio, message, Table, Empty } from 'antd';
import { columns } from './columns';

export default function DeploymentList() {
  return (
    <>
      <h3>控制器（deployment）事件：</h3>
      <Table
        columns={columns}
        locale={{ emptyText: <Empty description="没有事件" image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}
      />
    </>
  );
}
