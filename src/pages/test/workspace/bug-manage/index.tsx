import React from 'react';
import { ContentCard } from '@/components/vc-page-content';
import MatrixPageContent from '@/components/matrix-page-content';
import HeaderTabs from '../_components/header-tabs';
import { Select, Input, Switch, Button, Table, Form, Space } from 'antd';

export default function BugManage(props: any) {
  return (
    <MatrixPageContent>
      <HeaderTabs activeKey="bug-manage" history={props.history} />
      <ContentCard>
        <div className="search-header">
          <Form layout="inline">
            <Form.Item label="所属" name="?">
              <Select></Select>
            </Form.Item>
            <Form.Item label="标题" name="?">
              <Input />
            </Form.Item>
            <Form.Item label="状态" name="?">
              <Select></Select>
            </Form.Item>
            <Form.Item label="优先级" name="?">
              <Select></Select>
            </Form.Item>
            <Form.Item label="类型" name="?">
              <Select></Select>
            </Form.Item>
            <Form.Item label="只看我的" name="?">
              <Switch />
            </Form.Item>
            <Form.Item>
              <Button type="primary">查询</Button>
            </Form.Item>
            <Form.Item>
              <Button type="primary">重置</Button>
            </Form.Item>
          </Form>
        </div>
        <div className="bug-table-container">
          <div className="add-bug-btn-container">
            <Button type="primary">新建</Button>
          </div>
          <Table>
            <Table.Column title="ID" render={(_: any, __: any, idx: number) => idx + 1} />
            <Table.Column title="标题" dataIndex="?" />
            <Table.Column title="类型" dataIndex="?" />
            <Table.Column title="优先级" dataIndex="?" />
            <Table.Column title="状态" dataIndex="?" />
            <Table.Column title="创建人" dataIndex="?" />
            <Table.Column title="经办人" dataIndex="?" />
            <Table.Column title="更新时间" dataIndex="?" />
            <Table.Column
              title="操作"
              render={() => (
                <Space>
                  <Button type="link">删除</Button>
                </Space>
              )}
            />
          </Table>
        </div>
      </ContentCard>
    </MatrixPageContent>
  );
}
