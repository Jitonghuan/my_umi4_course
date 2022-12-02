import React, { useState, useEffect } from 'react';
import { Button, Tooltip, Table, Tag } from 'antd';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import AddSilence from './component/add-silence';
import ListSilence from './component/list-silence';
import './index.less';
import { getCluster, getCurrentAlerts } from './service';
import { Form, Select } from '@cffe/h2o-design';
import { datetimeCellRender } from '@/utils';

type statusTypeItem = {
  color: string;
  text: string;
};

const STATUS_TYPE: Record<string, statusTypeItem> = {
  refuse: { text: '拒绝处理', color: 'red' },
  firing: { text: '告警中', color: 'blue' },
  resolved: { text: '已修复', color: 'green' },
  terminate: { text: '中断处理', color: 'default' },
  silenced: { text: '静默中', color: 'default' },
};

export default function CurrentAlarm(props: any) {
  const [visible, setVisible] = useState(false);
  const [clusterCode, setClusterCode] = useState<number | null>(null);
  const [clusterList, setClusterList] = useState<any>([]);
  const [dataList, setDataList] = useState([]);
  const [addVisible, setAddVisible] = useState(false);
  const [addParam, setAddParam] = useState({});

  useEffect(() => {
    getCluster().then((res) => {
      if (res.success) {
        const data = res.data.map((item: any) => {
          return {
            label: item.clusterName,
            value: item.id,
          };
        });
        setClusterList(data);
        const localstorageData = JSON.parse(localStorage.getItem('__monitor_board_cluster_selected') || '{}');
        if (localstorageData?.clusterCode) {
          onClusterChange(localstorageData.clusterCode);
        } else {
          if (data?.[0]?.value) {
            onClusterChange(data?.[0]?.value);
          } else {
            setClusterCode(null);
          }
        }
      }
    });
  }, []);

  useEffect(() => {
    void handleSearch();
  }, [clusterCode]);

  async function handleSearch() {
    if (!clusterCode) {
      return;
    }
    const res = await getCurrentAlerts({
      clusterId: clusterCode,
    });
    setDataList(res?.data || []);
  }

  const onClusterChange = (value: number) => {
    setClusterCode(value);
    const localstorageData = { clusterCode: value };
    localStorage.setItem('__monitor_board_cluster_selected', JSON.stringify(localstorageData));
  };

  return (
    <>
      <FilterCard>
        <div style={{ display: 'flex', justifyContent: 'space-between', height: 30 }}>
          <div style={{ display: 'flex' }}>
            <Form style={{ marginRight: '10px' }}>
              <Form style={{ marginRight: '10px' }}>
                <Form.Item label="集群选择">
                  <Select
                    clearIcon={false}
                    style={{ width: '250px' }}
                    options={clusterList}
                    value={clusterCode}
                    onChange={onClusterChange}
                  />
                </Form.Item>
              </Form>
            </Form>
          </div>
          <div>
            <Button type="primary" onClick={() => setVisible(true)} style={{ margin: '0 10px' }}>
              静默列表
            </Button>
          </div>
        </div>
      </FilterCard>
      <ContentCard>
        <Table
          dataSource={dataList}
          rowKey="name"
          scroll={{ x: '100%' }}
          pagination={false}
          columns={[
            {
              title: '报警名称',
              dataIndex: 'alertname',
              width: 300,
            },
            {
              title: '报警描述',
              dataIndex: 'description',
              ellipsis: true,
              render: (text) => <Tooltip title={text}>{text}</Tooltip>,
            },
            {
              title: '报警日期',
              dataIndex: 'alertTime',
              key: 'alertTime',
              width: 200,
              render: (value) => <span>{datetimeCellRender(value)}</span>,
            },
            {
              title: '状态',
              dataIndex: 'state',
              key: 'state',
              width: 120,
              render: (text: number) => <Tag color={STATUS_TYPE[text]?.color}>{STATUS_TYPE[text]?.text}</Tag>,
            },
            {
              width: 140,
              title: '操作',
              fixed: 'right',
              dataIndex: 'operate',
              align: 'center',
              render: (_: any, record: any, index: number) => (
                <div className="action-cell">
                  <Button
                    type="link"
                    disabled={record.state === 'silenced'}
                    onClick={() => {
                      setAddParam({
                        clusterId: clusterCode + '',
                        labels: record.labels,
                      });
                      setAddVisible(true);
                    }}
                  >
                    静默
                  </Button>
                </div>
              ),
            },
          ]}
        />
        <AddSilence
          visible={addVisible}
          onClose={() => setAddVisible(false)}
          param={addParam}
          onConfirm={() => {
            setAddVisible(false);
            void handleSearch();
          }}
        />
        {visible && (
          <ListSilence
            visible={visible}
            onClose={() => setVisible(false)}
            param={{
              clusterId: clusterCode,
            }}
          />
        )}
      </ContentCard>
    </>
  );
}
