import React, { useState } from 'react';
import { Button, Table, Descriptions } from 'antd';
import { getImportantErrorList, getPageErrorInfo } from '../../../../server';
import { CloseOutlined } from '@ant-design/icons';
import { Drawer } from '@cffe/h2o-design';
interface IProps {
  dataSource: DataSourceItem[];
  loading: boolean;
  total: number;
  getParam: (data: any) => any;
  type: string;
}

interface DataSourceItem {
  id: number;
  url?: string;
  colSpan?: number;
  rowSpan?: number;
  d1?: string;
  count?: number;
  len: number;
  i: number;
}

const ResourceErrorTable = ({ dataSource, total, loading, getParam, type }: IProps) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [detail, setDetail] = useState<any>({});

  async function getDetail(record: any) {
    const res = await getImportantErrorList(
      getParam({
        d1: record.d1,
        d2: record.url,
        searchType: type,
        queryDetail: true,
      }),
    );
    const data = res?.data || [];
    setDetail(data[0]?._source || {});
  }

  const handleClose = () => {
    setShowDetail(false);
    setDetail({});
  };

  return (
    <div className="error-list-wrapper">
      {/* <div className="list-title">错误列表</div> */}
      <div className="list-content">
        <Table
          dataSource={dataSource}
          bordered
          loading={loading}
          rowKey="id"
          pagination={{
            total,
          }}
          onRow={(record) => {
            return {
              onClick: (event) => {
                setSelectedRowKeys([record.id]);
                setShowDetail(true);
                void getDetail(record);
              }, // 点击行
            };
          }}
          rowClassName={(record) => (record.id === selectedRowKeys[0] ? 'row-active' : '')}
          columns={[
            {
              title: '资源路径',
              dataIndex: 'd1',
              ellipsis: {
                showTitle: true,
              },
            },
            {
              title: '次数',
              dataIndex: 'count',
              width: '80px',
              align: 'right',
            },
            {
              title: '操作',
              width: '90px',
              align: 'center',
              render: () => <Button type="link">详情</Button>,
            },
          ]}
        />
      </div>
      <Drawer visible={showDetail} title="错误信息" onClose={() => setShowDetail(false)} className="fe-error-detail">
        <Descriptions bordered column={2} labelStyle={{ width: 140 }}>
          <Descriptions.Item label="错误文件" span={2}>
            {detail.d1}
          </Descriptions.Item>
          <Descriptions.Item label="页面url" span={2}>
            {detail.url}
          </Descriptions.Item>
          <Descriptions.Item label="UA信息" span={2}>
            {detail.ua}
          </Descriptions.Item>
          <Descriptions.Item label="用户" span={2}>
            {detail.name}
          </Descriptions.Item>
          <Descriptions.Item label="科室" span={2}>
            {detail.deptName}
          </Descriptions.Item>
          <Descriptions.Item label="终端信息" span={2}>
            {detail.terminalInfo
              ? Object.keys(JSON.parse(detail.terminalInfo)).map((key: any) => (
                  <div>
                    {key}: {JSON.parse(detail.terminalInfo)[key]}
                  </div>
                ))
              : ''}
          </Descriptions.Item>
        </Descriptions>
      </Drawer>
    </div>
  );
};

export default ResourceErrorTable;
