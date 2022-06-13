import React, { useState, useEffect } from 'react';
import { CheckCircleOutlined, RedoOutlined } from '@ant-design/icons';
import { Tabs, Card, Form, Table, Spin, Select, Divider, Button, Modal } from 'antd';
import './index.less';
export interface boardInfo extends Record<string, any> {
  mode: string;
  curClusterId: any;
  onClose: () => any;
}

export function AlarmModal(props: boardInfo) {
  const { onClose, mode, curClusterId } = props;
  useEffect(() => {
    if (curClusterId) {
    } else {
      return;
    }
  }, [mode]);

  return (
    <Modal
      title="告警详情"
      visible={mode !== 'HIDE'}
      width={900}
      onCancel={() => {
        onClose();
      }}
      footer={null}
    >
      <Table columns={[]}></Table>
    </Modal>
  );
}
