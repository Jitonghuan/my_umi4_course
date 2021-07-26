// 上下布局页面 主页
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/07/23 14:20

import React, { useState } from 'react';
import { Form, Input, Select, Button, Table, Space } from 'antd';
import MatrixPageContent from '@/components/matrix-page-content';
import { history } from 'umi';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import { InlineForm } from '@/components/schema-form';
// import * as APIS from './service';

export default function Launch() {
  const { Option } = Select;
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState();
  // const hasSelected = selectedRowKeys.length > 0;
  const rowSelection = {
    selectedRowKeys,
  };
  const [DataSource, setDataSource] = useState<any[]>([
    {
      key: '1',
      Id: 'John Brown',
      launchName: 32,
      launchType: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      Id: 'Jim Green',
      launchName: 42,
      launchType: 'London No. 1 Lake Park',
    },
  ]);
  const { Column, ColumnGroup } = Table;
  const allSelect = () => {};
  return (
    <MatrixPageContent>
      <FilterCard>
        <Form layout="inline">
          <Form.Item label="应用分类：" name="APPName">
            <div>
              <Select showSearch style={{ width: 180 }}>
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="tom">Tom</Option>
              </Select>
            </div>
          </Form.Item>
          <Form.Item label="环境：" name="env">
            <div>
              <Select showSearch style={{ width: 180 }}>
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="tom">Tom</Option>
              </Select>
            </div>
          </Form.Item>
          <Form.Item label="应用CODE：" name="APPCODE">
            <div>
              <Select showSearch style={{ width: 180 }}>
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="tom">Tom</Option>
              </Select>
            </div>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="ghost" htmlType="reset">
              重置
            </Button>
          </Form.Item>
        </Form>
      </FilterCard>
      <ContentCard>
        <div>
          <Table dataSource={DataSource} rowSelection={rowSelection}>
            <Table.Column title="ID" dataIndex="Id" />
            <Table.Column title="应用名" dataIndex="launchName" ellipsis />
            <Table.Column title="应用CODE" dataIndex="launchCODE" ellipsis />
            <Table.Column title="应用大类" dataIndex="AppClass" />
            <Table.Column title="应用分组" dataIndex="env" />
            <Table.Column
              title="操作"
              dataIndex="gmtModify"
              key="action"
              render={(text, record: any) => (
                <Space size="large">
                  <a>当前应用参数</a>
                </Space>
              )}
            />
          </Table>
        </div>
        <div>
          <Button onClick={allSelect}>全选</Button>
          <Space size="middle" style={{ marginTop: '20px', float: 'right' }}>
            <Button type="ghost" htmlType="reset">
              清空
            </Button>
            <Button type="primary">推送</Button>
          </Space>
        </div>
      </ContentCard>
    </MatrixPageContent>
  );
}
