import React, { useState } from 'react';
import { Form, Table, Button, Popconfirm, Input, Select, message } from 'antd';
import './index.less';

export default function RightDetail(props: any) {
  const { cateId } = props;

  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [dataSource, setDataSource] = useState<Record<string, any>[]>([]);
  const [total, setTotal] = useState<number>(0);

  const onConfirm = () => {
    console.log('delete');
  };

  const operateRender = () => (
    <Popconfirm title="确定要删除此用例吗？" onConfirm={onConfirm}>
      <Button type="link">删除</Button>
    </Popconfirm>
  );

  return (
    <div className="test-workspace-test-case-right-detail">
      <div className="searchHeader">
        <Form layout="inline">
          <Form.Item label="用例标题:">
            <Input placeholder="输入标题" />
          </Form.Item>
          <Form.Item label="优先级:">
            <Select placeholder="选择优先级">
              <Select.Option value="123">123</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary">查询</Button>
          </Form.Item>
          <Form.Item>
            <Button type="primary">重制</Button>
          </Form.Item>
        </Form>
      </div>
      <div className="detail-container">
        <div className="add-btn-wrapper">
          <Button className="add-case-btn" type="primary">
            新增用例
          </Button>
        </div>
        <Table
          className="detail-table"
          dataSource={dataSource}
          loading={loading}
          pagination={{
            current: pageIndex,
            total,
            pageSize,
            showSizeChanger: true,
            onChange: (next) => setPageIndex(next),
            onShowSizeChange: (_, next) => setPageSize(next),
          }}
        >
          <Table.Column width={60} title="ID" render={(_: any, __: any, index: number) => index + 1}></Table.Column>
          <Table.Column dataIndex="categoryName" title="所属"></Table.Column>
          <Table.Column dataIndex="title" title="用例名称"></Table.Column>
          <Table.Column dataIndex="priority" title="优先级"></Table.Column>
          <Table.Column dataIndex="createUser" title="创建人"></Table.Column>
          <Table.Column dataIndex="gmtModify" title="更新时间"></Table.Column>
          <Table.Column title="操作" render={operateRender}></Table.Column>
        </Table>
      </div>
    </div>
  );
}
