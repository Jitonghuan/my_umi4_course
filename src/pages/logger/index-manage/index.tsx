// 索引管理
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/11/23 19:10

import React, { useState, useEffect, useCallback } from 'react';
import { Input, Table, Popconfirm, Button, Drawer, Form, Select } from 'antd';
import PageContainer from '@/components/page-container';
import { ContentCard } from '@/components/vc-page-content';
import { getRequest } from '@/utils/request';
import { datetimeCellRender } from '@/utils';
import { useEnvOptions, useCreateIndexMode } from '../search/hooks';

export default function DemoPageList() {
  const [addIndexForm] = Form.useForm();
  const [envOptions] = useEnvOptions();
  const [createIndexMode] = useCreateIndexMode();
  const [keyword, setKeyword] = useState<string>('');
  const [addIndexVisiable, setAddIndexVisiable] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [dataSource, setDataSource] = useState<Record<string, any>[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  useEffect(() => {}, [pageIndex, pageSize]);
  //提交新增数据
  const handleSubmit = () => {
    const paramsdata = addIndexForm.getFieldsValue();
    let envCode = paramsdata?.envCode;
    let fields = paramsdata?.fields;
    let indexMode = paramsdata?.indexMode;
    console.log('paramsdata', paramsdata);
    setAddIndexVisiable(false);
    createIndexMode(envCode, fields, indexMode);
  };

  return (
    <PageContainer>
      <Drawer
        title={'新增索引'}
        visible={addIndexVisiable}
        onClose={() => {
          setAddIndexVisiable(false);
        }}
        width={400}
        footer={
          <div className="drawer-custom-footer">
            <Button type="primary" onClick={handleSubmit}>
              保存
            </Button>
            <Button
              type="default"
              onClick={() => {
                setAddIndexVisiable(false);
              }}
            >
              取消
            </Button>
          </div>
        }
      >
        <Form form={addIndexForm} labelCol={{ flex: '120px' }}>
          <Form.Item label="环境Code" name="envCode" rules={[{ required: true, message: '请输入环境Code' }]}>
            <Select options={envOptions} style={{ width: 140 }} placeholder="请选择" />
          </Form.Item>
          <Form.Item label="日志库(索引模式)" name="indexMode">
            <Input placeholder="请输入" style={{ width: 140 }} />
          </Form.Item>
          <Form.Item label="字段" name="fields" rules={[{ required: true }]}>
            <Input style={{ width: 140 }} />
          </Form.Item>
        </Form>
      </Drawer>
      <ContentCard>
        <div className="test-page-header" style={{ float: 'right', marginBottom: 8 }}>
          <Button
            type="primary"
            onClick={() => {
              setAddIndexVisiable(true);
            }}
          >
            新增
          </Button>
        </div>
        <Table
          dataSource={dataSource}
          loading={loading}
          rowKey="id"
          rowSelection={{
            selectedRowKeys,
            onChange: (next) => setSelectedRowKeys(next),
          }}
          pagination={{
            current: pageIndex,
            total,
            pageSize,
            showSizeChanger: true,
            onChange: (next) => setPageIndex(next),
            onShowSizeChange: (_, next) => setPageSize(next),
          }}
        >
          <Table.Column title="序号" dataIndex="id" width={60} />
          <Table.Column title="环境Code" dataIndex="name" ellipsis />
          <Table.Column title="日志库(索引模式)" dataIndex="desc" ellipsis />
          <Table.Column title="字段" dataIndex="createUser" width={140} />
          <Table.Column
            title="操作"
            width={120}
            render={(_, record: Record<string, any>, index) => (
              <div className="action-cell">
                <a>编辑</a>
                <Popconfirm title="确定要删除吗？" onConfirm={() => console.log(record, index)}>
                  <a>删除</a>
                </Popconfirm>
              </div>
            )}
          />
        </Table>
      </ContentCard>
    </PageContainer>
  );
}
