import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Table } from '@cffe/h2o-design';
import moment from 'moment';
import './index.less'
import { searchApiList } from '@/pages/fe-monitor/basic/server';
interface IProps {
  timeList:any
  appGroup:string;
  feEnv:string;
  getParam: () => any;
}

const SuccessRate = (props: IProps) => {

  const [formInstance] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false)
  const [dataSource, setDataSource] = useState<any[]>([])
  const [total, setTotal] = useState<number | undefined>(0)

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
    let params = props.getParam()
    params={ ...params, searchType: 'successRate' };
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
    <>
      <div className='success-rate-search-bar'>
        <Form form={formInstance} layout="inline" className="monitor-filter-form" onFinish={handleSearch}>
          <Form.Item label="关键字" name="api">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit'>查询</Button>
          </Form.Item>
        </Form>
      </div>
      <div className='success-rate-table'>
        <Table
          dataSource={dataSource}
          bordered
          scroll={{ x: '100%' }}
          rowKey="ts"
          loading={loading}
          columns={[
            {
              title: 'API',
              dataIndex: 'api',
              width: '300px',
              ellipsis: {
                showTitle: false,
              },
              render: (text) => <Input bordered={false} disabled value={text}></Input>,
            },
            {
              title: '错误率',
              dataIndex: 'errorRate',
              width: '250px',
              ellipsis: {
                showTitle: false,
              },
              render: (text) => <Input bordered={false} disabled value={text}></Input>,
            },
            {
              title: '总数',
              dataIndex: 'allcount',
              width: '400px',
              ellipsis: {
                showTitle: false,
              },
              render: (text) => <Input bordered={false} disabled value={text}></Input>,
            },
            {
              title: '平均响应时长',
              dataIndex: 'avgtime',
              width: '250px',
              ellipsis: {
                showTitle: false,
              },
              render: (text,record) => record.avgtime.value||'-',
            },
          ]}
          pagination={{
            total: total
          }}
        />
      </div>
    </>
  )
}

export default SuccessRate
