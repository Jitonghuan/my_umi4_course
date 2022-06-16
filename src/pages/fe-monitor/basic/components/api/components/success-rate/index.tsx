import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Table } from '@cffe/h2o-design';
import moment from 'moment';
import './index.less'
import { searchApiList } from '@/pages/fe-monitor/basic/server';
interface IProps {
  timeList: any
  appGroup: string;
  feEnv: string;
  getParam: () => any;
}

const SuccessRate = (props: IProps) => {

  const [formInstance] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false)
  const [dataSource, setDataSource] = useState<any[]>([])
  const [total, setTotal] = useState<number | undefined>(0)
  const [formValue, setFormValue] = useState<any>({})

  useEffect(() => {
    onSearchSuccessRate(formValue)
  }, [props.timeList, props.appGroup, props.feEnv])


  const handleSearch = async (value: any) => {
    setFormValue(value)
    await onSearchSuccessRate(value)
  }

  const onSearchSuccessRate = async (value?: any) => {
    const { api } = value
    if (loading) {
      return
    };
    let params = props.getParam()
    params = { ...params, searchType: 'successRate' };
    if (api) {
      params = { ...params, api };
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
            <Input allowClear />
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
              title: '错误率(百分比)',
              dataIndex: 'errorRate',
              width: '250px',
              ellipsis: {
                showTitle: false,
              },
              render: (text) => `${text} %`,
            },
            {
              title: '请求次数',
              dataIndex: 'allcount',
              width: '400px',
              ellipsis: {
                showTitle: false,
              },
              render: (text) => <Input bordered={false} disabled value={text}></Input>,
            },
            {
              title: '平均响应时长(ms)',
              dataIndex: 'avgtime',
              width: '250px',
              ellipsis: {
                showTitle: false,
              },
              render: (text, record) => record?.avgtime?.value? record.avgtime.value.toFixed(2)+' ms' : '-',
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
