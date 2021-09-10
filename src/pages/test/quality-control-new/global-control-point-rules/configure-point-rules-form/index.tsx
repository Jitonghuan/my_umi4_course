import React from 'react';
import { Form, Table, InputNumber } from 'antd';
import './index.less';

const pointRulesTableDescribe = [
  {
    key: 1,
    title: '质量分',
    name: 'a',
  },
  {
    key: 2,
    title: '单元测试',
    name: 'b',
    children: [
      {
        key: 3,
        title: '单测用例数',
        name: 'c',
      },
      {
        key: 4,
        title: '单测通过率',
        name: 'd',
      },
      {
        key: 5,
        title: '单测覆盖率',
        name: 'e',
      },
    ],
  },
  {
    key: 6,
    title: '代码扫描',
    name: 'b',
    children: [
      {
        key: 7,
        title: '阻塞级别BUG数',
        name: 'c',
      },
      {
        key: 8,
        title: '严重级别BUG数',
        name: 'c',
      },
      {
        key: 9,
        title: '主要级别BUG数',
        name: 'c',
      },
      {
        key: 10,
        title: '阻塞界别漏洞数',
        name: 'c',
      },
      {
        key: 11,
        title: '严重级别漏洞数',
        name: 'c',
      },
      {
        key: 12,
        title: '主要级别漏洞数',
        name: 'c',
      },
    ],
  },
];

export default function ConfigurePointRulesContent() {
  return (
    <Form className="configure-point-rules-form">
      <Table dataSource={pointRulesTableDescribe} defaultExpandAllRows pagination={false}>
        <Table.Column title="指标" dataIndex="title" />
        <Table.Column
          title="目标值"
          render={(record) => {
            if (!record?.children?.length)
              return (
                <Form.Item>
                  {' '}
                  {'>='} <InputNumber />
                </Form.Item>
              );
          }}
        />
      </Table>
    </Form>
  );
}
