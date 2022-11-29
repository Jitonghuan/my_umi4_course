import React, {useEffect, useState} from 'react';
import {Button, Descriptions, Drawer, Form, Input, Table} from '@cffe/h2o-design';
import moment from 'moment';
import { getSlowApiList } from "@/pages/fe-monitor/basic/server";

interface IProps {
  timeList: any;
  appGroup: string;
  feEnv: string;
  getParam: () => any;
}

const SlowApiRequest = (props: IProps) => {
  const { getParam } = props;
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [detail, setDetail] = useState<any>({});
  const [searchValue, setSearchValue] = useState<any>({});

  const [timeOutTotal, setTimeOutTotal] = useState<number>(0);
  const [timeOutData, setTimeOutData] = useState<any[]>([]);
  const [timeOutLoading, setTimeOutLoading] = useState<boolean>(false);

  useEffect(() => {
    void onSearchTimeOut(searchValue);
  }, [props.timeList, props.appGroup, props.feEnv]);


  async function onSearchTimeOut(searchValue?: any) {
    if (timeOutLoading) {
      return;
    }
    setTimeOutLoading(true);
    const res = await getSlowApiList({
      ...getParam(),
      ...searchValue || {}
    });
    setTimeOutData(res?.data || []);
    setTimeOutTotal(res?.data?.length || 0);
    setTimeOutLoading(false);
  }

  const handleSearch = async (value: any) => {
    setSearchValue(value);
    void onSearchTimeOut(value);
  };

  const getDetail = (record: any) => {
    setDetail(record);
  };

  return (
    <>
      <div className="success-rate-search-bar">
        <Form layout="inline" className="monitor-filter-form" onFinish={handleSearch}>
          <Form.Item label="关键字" name="api">
            <Input allowClear />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Form.Item>
        </Form>
      </div>
      <Table
        dataSource={timeOutData}
        bordered
        scroll={{ x: '100%' }}
        rowKey="ts"
        loading={timeOutLoading}
        rowClassName={(record) => (record.d3 === selectedRowKeys[0] ? 'row-active' : '')}
        onRow={(record) => {
          return {
            onClick: (event) => {
              setSelectedRowKeys([record.d3]);
              setShowDetail(true);
              getDetail(record);
            }, // 点击行
          };
        }}
        columns={[
          {
            title: 'API',
            dataIndex: 'd1',
            width: '300px',
            ellipsis: {
              showTitle: false,
            },
            render: (text) => <Input bordered={false} disabled value={text}></Input>,
          },
          // {
          //   title: '页面',
          //   dataIndex: 'url',
          //   width: '250px',
          //   ellipsis: {
          //     showTitle: false,
          //   },
          //   render: (text) => <Input bordered={false} disabled value={text}></Input>,
          // },
          {
            title: '耗时(秒)',
            width: '100px',
            align: 'right',
            dataIndex: 'timing',
            render: (value, record) => <span>{(record.timing / 1000).toFixed(2) || 0}</span>,
          },
          {
            title: '上报时间',
            width: '180px',
            render: (value, record) => <span>{moment(Number(record.ts)).format('YYYY-MM-DD HH:mm:ss') || '-'}</span>,
          },
          {
            title: '操作',
            width: '90px',
            align: 'center',
            render: () => <Button type="link">详情</Button>,
          },
        ]}
        pagination={{
          total: timeOutTotal,
        }}
      />
      <Drawer
        title="API详情"
        visible={showDetail}
        onClose={() => {
          setShowDetail(false);
        }}
      >
        <Descriptions bordered column={2}>
          <Descriptions.Item label="api" span={2}>
            {detail.d1}
          </Descriptions.Item>
          <Descriptions.Item label="traceId" span={2}>
            {detail.d3}
          </Descriptions.Item>
          <Descriptions.Item label="页面" span={2}>
            {detail.url}
          </Descriptions.Item>
          <Descriptions.Item label="入参" span={2}>
            {detail.d5}
          </Descriptions.Item>
        </Descriptions>
      </Drawer>
    </>
  );
};

export default SlowApiRequest;
