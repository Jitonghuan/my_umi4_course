// 操作日志页面
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/07/13 15:30
import React, { useContext, useState, useEffect } from 'react';
import { Radio, Button, Card, Tag, Row, Col, Select, Table, Input, message, Form, Pagination, Popconfirm } from 'antd';
import MatrixPageContent from '@/components/matrix-page-content';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import { InlineForm, BasicForm } from '@/components/schema-form';
import HeaderTabs from '../components/header-tabs';
export interface Item {
  key: string;
  name: string;
  age: number;
  address: string;
}

export default function Operation(props: any) {
  const { Option } = Select;

  const [keyword, setKeyword] = useState<string>('');
  const [total, setTotal] = useState<number>(10);
  const originData: Item[] = [];

  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [dataSource, setDataSource] = useState<Record<string, any>[]>([
    {
      key: '1',
      name: 'John Brown',
      colonyA: 32,
      colonyB: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      colonyA: 42,
      colonyB: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      colonyA: 32,
      colonyB: 'Sidney No. 1 Lake Park',
    },
    {
      key: 'ghihhgkh',
      name: 'Disabled User',
      colonyA: 99,
      colonyB: 'Sidney No. 1 Lake Park',
    },
  ]);
  function onTurn(pageNumber: number) {
    console.log('Page: ', pageNumber);
  }

  function onChange(value: any) {
    console.log('onChange:', `selected ${value}`);
  }

  function onBlur() {
    console.log('+++++', 'blur');
  }

  function onFocus() {
    console.log('+++++', 'focus');
  }

  function onSearch(val: any) {
    console.log('search:', val);
  }
  return (
    <MatrixPageContent>
      <HeaderTabs activeKey="operation-log" history={props.history} />
      <ContentCard>
        <div style={{ height: '50px' }}>
          <Form layout="inline">
            <Form.Item label="操作人">
              <Input></Input>
            </Form.Item>
            <Form.Item label="操作类别">
              <Select
                showSearch
                style={{ width: 200 }}
                placeholder="流量调度"
                optionFilterProp="children"
                onChange={onChange}
                onFocus={onFocus}
                onBlur={onBlur}
                onSearch={onSearch}
                // filterOption={(input, options) =>
                //     options.OptionData.toLowerCase().indexOf(input.toLowerCase()) >= 0
                // }
              >
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="tom">Tom</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="default" htmlType="submit">
                查询
              </Button>
            </Form.Item>
            <Form.Item>
              <Button type="ghost" htmlType="reset">
                重置
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div>
          <Table
            dataSource={dataSource}
            bordered
            pagination={{
              current: pageIndex,
              total,
              pageSize,
              showSizeChanger: true,
              onChange: (next) => setPageIndex(next),
              onShowSizeChange: (_, next) => setPageSize(next),
            }}
            //loading={loading}
          >
            <Table.Column title="操作人" dataIndex="name" width="10%" />
            <Table.Column title="操作类别" dataIndex="colonyA" width="10%" ellipsis />
            <Table.Column title="创建时间" dataIndex="colonyB" width="35%" ellipsis />
            <Table.Column title="结束时间" dataIndex="createUser" width="35%" />
            {/* <Table.Column title="描述" dataIndex="createUser" /> */}
            <Table.Column title="操作" dataIndex="gmtModify" width="10%" render={(text, record) => <a>查看日志</a>} />
          </Table>
        </div>
        {/* <>
           <Pagination showQuickJumper defaultCurrent={1} total={500} onChange={onTurn} />
          </> */}
      </ContentCard>
    </MatrixPageContent>
  );
}
