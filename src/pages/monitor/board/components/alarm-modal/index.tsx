import React, { useEffect, useState } from 'react';
import { Form, Table, Modal } from 'antd';
import { alarmTableSchema } from './schema';
import { queryClusterAlertInfo } from '../../service';
import './index.less';
export interface boardInfo extends Record<string, any> {
  mode: string;
  curClusterId: any;
  onClose: () => any;
}

export function AlarmModal(props: boardInfo) {
  const { onClose, mode, curClusterId } = props;
  const [dataSource, setDataSource] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    if (curClusterId) {
      queryAlarmList();
    } else {
      return;
    }
  }, [mode]);
  const queryAlarmList = () => {
    setLoading(true);
    queryClusterAlertInfo({ clusterId: curClusterId })
      .then((res) => {
        setDataSource(res);
      })
      .finally(() => {
        setLoading(false);
      });
  };

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
        dataSource={dataSource}
        loading={loading}
      ></Table>
    </Modal>
  );
}
