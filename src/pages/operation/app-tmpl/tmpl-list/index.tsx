// 上下布局页面 主页
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/07/23 14:20

import React, { useState } from 'react';
import { Form, Input, Select, Button, Table, Space, Popconfirm } from 'antd';
import MatrixPageContent from '@/components/matrix-page-content';
import { history } from 'umi';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import { InlineForm } from '@/components/schema-form';
// import * as APIS from './service';

export default function Launch() {
  const { Option } = Select;
  const [loading, setLoading] = useState(false);
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

  return (
    <MatrixPageContent>
      <FilterCard>
        <Form layout="inline">
          <Form.Item label=" 模版名称：" name="launchName">
            <div>
              <Input placeholder="请输入模版名称"></Input>
            </div>
          </Form.Item>
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
          <span style={{ float: 'right' }}>
            {' '}
            <Button type="primary" style={{ float: 'right' }}>
              新增模版
            </Button>
          </span>
        </Form>
      </FilterCard>
      <ContentCard>
        <div>
          <Table dataSource={DataSource}>
            <Table.Column title="ID" dataIndex="Id" width="10%" />
            <Table.Column title="模版名称" dataIndex="launchName" width="10%" ellipsis />
            <Table.Column title="模版CODE" dataIndex="launchCODE" width="15%" ellipsis />
            <Table.Column title="模版类型" dataIndex="launchType" width="15%" />
            <Table.Column title="应用大类" dataIndex="AppClass" width="10%" />
            <Table.Column title="环境" dataIndex="env" width="10%" />
            <Table.Column title="是否推送" dataIndex="isPush" width="6%" />
            <Table.Column
              title="操作"
              dataIndex="gmtModify"
              width="24%"
              key="action"
              render={(text, record: any) => (
                <Space size="middle">
                  <a
                    onClick={() =>
                      history.push({
                        pathname: 'tmpl-detail',
                        query: {
                          // id: record.id,
                          // isEdite:true;
                          // appCode: record.appCode,
                          // isClient: record.isClient,
                          // isContainClient: record.isContainClient,
                        },
                      })
                    }
                  >
                    详情 {record.lastName}
                  </a>
                  <a
                    onClick={() =>
                      history.push({
                        pathname: 'push',
                        query: {
                          // id: record.id,
                          // isEdite:true;
                          // appCode: record.appCode,
                          // isClient: record.isClient,
                          // isContainClient: record.isContainClient,
                        },
                      })
                    }
                  >
                    推送
                  </a>
                  <a
                    onClick={() =>
                      history.push({
                        pathname: 'tmpl-detail',
                        query: {
                          // id: record.id,
                          // isEdite:true;
                          // appCode: record.appCode,
                          // isClient: record.isClient,
                          // isContainClient: record.isContainClient,
                        },
                      })
                    }
                  >
                    编辑
                  </a>
                  <Popconfirm
                    title="确定要删除该信息吗？"
                    //  onConfirm={() => handleDelItem(record, index)}
                  >
                    <a style={{ color: 'red' }}>删除</a>
                  </Popconfirm>
                </Space>
              )}
            />
          </Table>
        </div>
      </ContentCard>
    </MatrixPageContent>
  );
}
