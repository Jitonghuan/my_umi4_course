// 详情页-基本信息
// @author JITONGHUAN <muxi@come-future.com>
// @create 2022/06/24 17:10

import { useEffect, useState } from 'react';
import { Button, Table, Space, Tag, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { datetimeCellRender } from '@/utils';
import { getHistoryReleaseList, useRollbackRelease } from '../../hook';
import LogDetail from './log-detail';

export interface PorpsItem {
  record: any;
  curClusterName: string;
}
type releaseStatus = {
  text: string;
  type: any;
  disabled: boolean;
};

export default function deliveryDescription(props: PorpsItem) {
  const { record, curClusterName } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [releaseData, setReleaseData] = useState<any>([]);
  const [mode, setMode] = useState<boolean>(false);
  const [curRecord, setCurRecord] = useState<any>({});
  const [rollBackLoading, rollbackRelease] = useRollbackRelease();

  useEffect(() => {
    if (curClusterName) {
      queryHistoryReleaseList();
    }
  }, []);
  const queryHistoryReleaseList = () => {
    getHistoryReleaseList({
      releaseName: record?.releaseName,
      namespace: record?.namespace,
      clusterName: curClusterName,
    })
      .then((res) => {
        setReleaseData(res || []);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const confirm = (record: any) => {
    Modal.confirm({
      title: '回滚提示',
      icon: <ExclamationCircleOutlined />,
      content: `${record?.releaseName}应用回滚到版本：${record?.revision}，请确认！`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        rollbackRelease({
          releaseName: record?.releaseName,
          namespace: record?.namespace,
          revision: record?.revision,
          clusterName: curClusterName,
        }).then(() => {
          queryHistoryReleaseList();
        });
      },
    });
  };
  const columns = [
    {
      title: '发布名称',
      dataIndex: 'releaseName',
      // width: '30%',
    },
    {
      title: '命名空间',
      dataIndex: 'namespace',
      width: '16%',
    },
    {
      title: '更新时间',
      dataIndex: 'updated',
      width: '10%',
      render: (value: string) => datetimeCellRender(value),
    },
    {
      title: ' 版本',
      dataIndex: 'app_version',
      width: '10%',
    },

    {
      title: '操作',
      dataIndex: 'option',
      width: 240,
      render: (_: string, record: any) => (
        <Space>
          <a
            onClick={() => {
              setMode(true);
              setCurRecord(record);
            }}
          >
            详情
          </a>
          <a onClick={() => confirm(record)}>回滚</a>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <LogDetail
        mode={mode}
        curRecord={curRecord}
        curClusterName={curClusterName}
        onCancle={() => {
          setMode(false);
        }}
        onSave={() => {
          setMode(false);
          queryHistoryReleaseList();
        }}
      />
      <Table
        rowKey="id"
        dataSource={releaseData}
        bordered
        columns={columns}
        loading={loading}
        pagination={{
          total: releaseData?.length,
          pageSize: 20,
          showSizeChanger: false,
          showTotal: () => `总共 ${releaseData?.length} 条数据`,
        }}
      ></Table>
    </div>
  );
}
