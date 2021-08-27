import React from 'react';
import { Button, Popconfirm } from 'antd';
import dayjs from 'dayjs';

// 过滤表单 schema
export const createFilterFormSchema = () => ({
  theme: 'inline',
  isShowReset: true,
  labelColSpan: 3,
  schema: [
    {
      type: 'Input',
      props: {
        label: '分支名',
        name: 'branchName',
        props: {
          placeholder: '请输入分支名',
          style: { width: 240 },
        },
      },
    },
  ],
});

// 表格 schema
export const createTableSchema = ({ onCancelClick }: { onCancelClick: (record: any, index: number) => void }) => [
  {
    width: 80,
    title: 'ID',
    dataIndex: 'id',
  },
  {
    width: 200,
    title: '应用code',
    dataIndex: 'appCode',
  },
  {
    title: '分支名',
    dataIndex: 'branchName',
  },
  {
    width: 200,
    title: '描述',
    dataIndex: 'desc',
  },
  {
    width: 160,
    title: '创建时间',
    dataIndex: 'gmtCreate',
    render: (val: string) => (val ? dayjs(val).format('YYYY-MM-DD HH:mm:ss') : ''),
  },
  {
    width: 120,
    title: '已部署环境',
    dataIndex: 'deployedEnv',
  },
  {
    width: 100,
    title: '创建人',
    dataIndex: 'createUser',
  },
  {
    width: 110,
    title: '操作',
    dataIndex: 'operate',
    render: (text: string, record: any, index: number) => (
      <>
        <Popconfirm title="确定要作废该项吗？" onConfirm={() => onCancelClick(record, index)}>
          <Button type="primary" danger>
            作废
          </Button>
        </Popconfirm>
      </>
    ),
  },
];
