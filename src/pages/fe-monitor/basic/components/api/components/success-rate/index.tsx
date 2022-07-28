import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Table } from '@cffe/h2o-design';
import './index.less'
import { searchApiList } from '@/pages/fe-monitor/basic/server';
interface IProps {
  timeList: any
  appGroup: string;
  feEnv: string;
  getParam: () => any;
}

const orderMap: any = {
  "descend": "desc",
  "ascend": "asc"
}

const SuccessRate = (props: IProps) => {

  const [formInstance] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false)
  const [dataSource, setDataSource] = useState<any[]>([])
  const [total, setTotal] = useState<number | undefined>(0)
  const [formValue, setFormValue] = useState<any>({});
  const [sorter, setSorter] = useState<any>({
    sorType: 'allCount',
    sortField: 'desc'
  });

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
      return;
    }
    let params = props.getParam()
    params = { ...params, searchType: 'successRate', ...sorter };
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
          onChange={(newPagination,filters, sorter) => {
            const sorType = orderMap[sorter?.order];
            const sortField = sorter.field;
            setSorter({
              sorType,
              sortField
            });
            onSearchSuccessRate({
              ...formValue,
              sorType,
              sortField
            })
          }}
          columns={[
            {
              title: 'API',
              dataIndex: 'api',
              width: '400px',
              ellipsis: {
                showTitle: false,
              },
              render: (text) => <Input bordered={false} disabled value={text}></Input>,
            },
            {
              title: '错误率(百分比)',
              dataIndex: 'errorRate',
              width: '100px',
              sorter:true,
              ellipsis: {
                showTitle: false,
              },
              render: (text) => `${text} %`,
            },
            {
              title: '失败次数',
              dataIndex: 'errorCount',
              width: '100px',
              sorter:true,
              ellipsis: {
                showTitle: false,
              },
              render: (text) => <Input bordered={false} disabled value={text}></Input>,
            },
            {
              title: '请求次数',
              dataIndex: 'allCount',
              width: '100px',
              sorter:true,
              defaultSortOrder: 'descend',
              ellipsis: {
                showTitle: false,
              },
              render: (text) => <Input bordered={false} disabled value={text}></Input>,
            },
            {
              title: '平均响应时长(ms)',
              dataIndex: 'avgTime',
              width: '100px',
              sorter:true,
              ellipsis: {
                showTitle: false,
              },
              render: (text, record) => record.avgTime ? record.avgTime.toFixed(2)+' ms' : '-',
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
