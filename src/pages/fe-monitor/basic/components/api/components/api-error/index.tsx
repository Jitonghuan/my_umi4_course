import React, { useEffect, useState } from 'react';
import { Button, Descriptions, Drawer, Form, Input, Popover, Table } from '@cffe/h2o-design';
import moment from 'moment';
import { searchApiList } from '@/pages/fe-monitor/basic/server';
import './index.less';

type type = 'serverError' | 'bizError'
interface IProps {
  type: type
  timeList: any
  appGroup: string;
  feEnv: string;
  getParam: () => any;
}

const APIError = (props: IProps) => {

  const [formInstance] = Form.useForm()
  const [dataSource, setDataSource] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [total, setTotal] = useState<number>(0)
  const [searchValue, setSearchValue] = useState<any>({})
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [detail, setDetail] = useState<any>({});

  const { type, getParam } = props

  useEffect(() => {
    onSearchSuccessRate(searchValue)
  }, [props.timeList, props.appGroup, props.feEnv])

  const handleSearch = async (value: any) => {
    setSearchValue(value)
    await onSearchSuccessRate(value)
  }

  const onSearchSuccessRate = async (value?: any) => {
    const { api, traceId } = value
    if (loading) {
      return
    };
    let params = getParam()
    params = { ...params, searchType: type };
    if (api) {
      params = { ...params, api };
    }
    if (traceId) {
      params = { ...params, traceId };
    }
    setLoading(true);

    const res = await searchApiList(params);
    setDataSource(res?.data || []);
    setTotal(res?.data?.length || 0);
    setLoading(false);
  }

  const getDetail = (record: any) => {
    setDetail(record);
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
          rowKey="d3"
          // scroll={{ x: '100%' }}
          loading={loading}
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
              width: '350px',
              ellipsis: true,
              render: (text) => (
                <Popover content={text}>
                  <div>{text}</div>
                </Popover>
              ),
            },
            // {
            //   title: '页面名称',
            //   dataIndex: 'url',
            //   width: '250px',
            //   render: (text) => <Input bordered={false} disabled value={text}></Input>,
            // },
            {
              title: '上报时间',
              width: '180px',
              render: (value, record) => (
                <span>{moment(Number(record.ts)).format('YYYY-MM-DD HH:mm:ss') || '-'}</span>
              ),
            },
            {
              title: '操作',
              width: '90px',
              align: 'center',
              render: () => <Button type="link">详情</Button>,
            },
          ]}
          pagination={{
            total: total,
          }}
        />
      </div>
      <Drawer
        title='API详情'
        visible={showDetail}
        onClose={() => { setShowDetail(false) }}
      >
        <Descriptions bordered column={2}>
          <Descriptions.Item label="api" span={2}>
            {detail.d1}
          </Descriptions.Item>
          <Descriptions.Item label="traceId" span={2}>
            {detail.d3?.split('-')[1] || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="页面" span={2}>
            {detail.url}
          </Descriptions.Item>
          <Descriptions.Item label="入参" span={2}>
            {detail.d5}
          </Descriptions.Item>
          <Descriptions.Item label="出参" span={2}>
            {detail.d4}
          </Descriptions.Item>
          <Descriptions.Item label="用户" span={2}>
            {detail.name}
          </Descriptions.Item>
          <Descriptions.Item label="UA" span={2}>
            {detail.ua}
          </Descriptions.Item>
        </Descriptions>
      </Drawer>
    </div>
  )
}

export default APIError
