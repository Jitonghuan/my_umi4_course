/*
 * @Author: shixia.ds
 * @Date: 2021-11-17 16:07:16
 * @Description:
 */
import React, { useEffect, useState } from 'react';
import { Form, Select, Tag, Input, Table, Button, message } from 'antd';
import { FilterCard, ContentCard } from '@/components/vc-page-content';
import PageContainer from '@/components/page-container';
import './index.less';

const tracking = () => {
  const [trackList, setTrackList] = useState<any[]>([]);
  const [paramOptions, setParamOptions] = useState([{ label: 'key1', value: 'key1' }]);
  const [selectParams, setSelectParams] = useState<any>({
    'key1-value1': { key1: 'value1' },
    'key2-value2': { key2: 'value2' },
  });
  const [form] = Form.useForm();

  useEffect(() => {}, []);

  const columns = [
    {
      title: 'trace ID',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '生产日期',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '接口名称',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '所属应用',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '耗时',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '服务端',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '客户端',
      dataIndex: 'description',
      key: 'description',
    },
  ];

  const deleteParams = (e: React.MouseEvent<HTMLElement, MouseEvent>, key: string) => {
    e.preventDefault();
    const index = getSelectParams(key);
    const newSelectParams = JSON.parse(JSON.stringify(selectParams));
    if (index !== -1) {
      delete newSelectParams[key];
    }
    setSelectParams(newSelectParams);
  };

  const addParams = (values: any) => {
    const { param, value } = values;
    const key = `${param}-${value}`;
    const index = getSelectParams(key);
    const newSelectParams = JSON.parse(JSON.stringify(selectParams));
    if (index !== -1) {
      message.info('此参数和参数值已存在');
    } else {
      newSelectParams[key] = {};
      newSelectParams[key][param] = value;
      setSelectParams(newSelectParams);
    }
  };

  const searchTracking = () => {};

  const getSelectParams = (key: string) => {
    return Object.keys(selectParams).findIndex((item) => item == key);
  };

  return (
    <PageContainer className="tracking-page">
      <FilterCard>
        <Form form={form} layout="inline" onFinish={addParams}>
          <Form.Item label="参数" name="param" rules={[{ required: true, message: '请选择参数' }]}>
            <Select options={paramOptions} style={{ width: '300px' }} placeholder="选取参数" />
          </Form.Item>
          <Form.Item name="value" rules={[{ required: true, message: '请输入参数的值' }]}>
            <Input style={{ width: '400px' }} allowClear placeholder="参数值" />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit">添加查询参数</Button>
          </Form.Item>
        </Form>
      </FilterCard>
      <div className="tag-card">
        {Object.keys(selectParams).length > 0
          ? Object.keys(selectParams).map((key: any) => {
              return (
                <Tag
                  closable
                  onClose={(e) => {
                    deleteParams(e, key);
                  }}
                  key={key}
                >
                  {JSON.stringify(selectParams[key])}
                </Tag>
              );
            })
          : null}
      </div>
      <ContentCard>
        <div className="tracking-table-header">
          <h3>追踪列表</h3>
        </div>
        <Table dataSource={trackList} columns={columns} />
      </ContentCard>
    </PageContainer>
  );
};

export default tracking;
