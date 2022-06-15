import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Table } from '@cffe/h2o-design';
import moment from 'moment';
import { searchApiList } from '@/pages/fe-monitor/basic/server';
import './index.less';

type type = 'serverError' | 'bizError'
interface IProps {
  type:type
  timeList:any
  appGroup:string;
  feEnv:string;
  getParam: () => any;
}

const APIError = (props: IProps) => {

  const [formInstance] = Form.useForm()
  const [dataSource, setDataSource] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [total, setTotal] = useState<number>(0)

  const { type, getParam } = props

  useEffect(() => {
    onSearchSuccessRate()
  }, [props.timeList,props.appGroup,props.feEnv])

  const handleSearch = async (value: any) => {
    await onSearchSuccessRate(value)
  }

  const onSearchSuccessRate = async (value?: any) => {
    if (loading) {
      return
    };
    let params = getParam()
    params = { ...params, searchType: type };
    if (value) {
      params = { ...params, ...value };
    }
    setLoading(true);

    const res = await searchApiList(params);
    setDataSource(res?.data || []);
    setTotal(res?.data?.length || 0);
    setLoading(false);
  }

  return (
    <div className='api-error-table'>
      <div className='search'>
        <Form form={formInstance} layout="inline" onFinish={handleSearch}>
          <Form.Item label="关键字" name="api">
            <Input />
          </Form.Item>
          <Form.Item label="traceId" name="traceId">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit'>查询</Button>
          </Form.Item>
        </Form>
      </div>
      <div className='table'>
        <Table
          dataSource={dataSource}
          bordered
          rowKey="ts"
          scroll={{ x: '100%' }}
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
              title: 'TraceId',
              width: '350px',
              render: (value, record) => <span>{record.d3?.split('-')[1] || '-'}</span>,
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
            {
              title: '出参',
              dataIndex: 'd4',
              width: '350px',
              ellipsis: {
                showTitle: false,
              },
              render: (text) => <Input bordered={false} disabled value={text}></Input>,
            },
            {
              title: '耗时(秒)',
              width: '100px',
              align: 'right',
              render: (value, record) => <span>{(record.timing / 1000).toFixed(2) || 0}</span>,
            },
            {
              title: '页面名称',
              dataIndex: 'url',
              width: '250px',
              render: (text) => <Input bordered={false} disabled value={text}></Input>,
            },
            {
              title: '上报时间',
              width: '180px',
              render: (value, record) => (
                <span>{moment(Number(record.ts)).format('YYYY-MM-DD HH:mm:ss') || '-'}</span>
              ),
            },
          ]}
          pagination={{
            total: total,
          }}
        />
      </div>
    </div>
  )
}

export default APIError
