import React, { useEffect } from 'react';
import { CheckCircleOutlined, RedoOutlined } from '@ant-design/icons';
import { Form, Table, Modal } from 'antd';
import { alarmTableSchema } from './schema';
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
      <Table
        columns={alarmTableSchema}
        expandable={{
          expandedRowRender: (record: any) => <p style={{ margin: 0 }}>{record?.lables || '--'}</p>,
          rowExpandable: (record) => record.name !== 'Not Expandable',
        }}
        dataSource={[]}
      ></Table>
    </Modal>
  );
}
