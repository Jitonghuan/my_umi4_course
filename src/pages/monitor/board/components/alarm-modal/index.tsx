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
  const [labelsInfo, setLabelsInfo] = useState<any>([]);
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
        //处理数据
        let arry: any = [];
        if (res.length !== 0) {
          res?.map((item: any) => {
            for (const key in item.labels) {
              const element = item.labels[key];

              arry.push({
                label: key,
                value: element,
              });
            }
          });
        }

        setLabelsInfo(arry);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Modal
      title="告警详情"
      visible={mode !== 'HIDE'}
      width={1000}
      onCancel={() => {
        onClose();
      }}
      footer={null}
    >
      <Table
        columns={alarmTableSchema}
        expandable={{
          expandedRowRender: (record: any) => (
            <p style={{ margin: 0 }}>
              {labelsInfo.length !== 0 &&
                labelsInfo?.map((item: any) => {
                  return (
                    <li>
                      {' '}
                      <span>
                        <b>{item?.label}:</b>
                      </span>{' '}
                      <span className="labels-info-content">{item?.value}</span>
                    </li>
                  );
                })}
            </p>
          ),
          rowExpandable: (record) => Object.keys(record?.labels).length !== 0,
        }}
        dataSource={dataSource}
        loading={loading}
      ></Table>
    </Modal>
  );
}
