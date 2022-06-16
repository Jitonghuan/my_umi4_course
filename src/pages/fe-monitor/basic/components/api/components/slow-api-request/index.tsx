import React from 'react';
import { Input, Table } from '@cffe/h2o-design';
import moment from 'moment';

interface IProps {
  dataSource: any[];
  loading: boolean;
  pageTotal: number | undefined;
}

const SlowApiRequest = (props: IProps) => {

  const { dataSource, loading, pageTotal } = props;
  return (
    <Table
      dataSource={dataSource}
      bordered
      scroll={{ x: '100%' }}
      rowKey="ts"
      loading={loading}
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
        {
          title: '页面',
          dataIndex: 'url',
          width: '250px',
          ellipsis: {
            showTitle: false,
          },
          render: (text) => <Input bordered={false} disabled value={text}></Input>,
        },
        {
          title: 'TraceId',
          width: '250px',
          render: (value, record) => <span>{record.d3?.split('-')[1] || '-'}</span>,
        },
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
          render: (value, record) => (
            <span>{moment(Number(record.ts)).format('YYYY-MM-DD HH:mm:ss') || '-'}</span>
          ),
        },
        {
          title: '入参',
          dataIndex: 'd5',
          width: '400px',
          ellipsis: {
            showTitle: false,
          },
          render: (text) => <Input bordered={false} disabled value={text}></Input>,
        },
      ]}
      pagination={{
        total: pageTotal,
      }}
    />
  )
}

export default SlowApiRequest
