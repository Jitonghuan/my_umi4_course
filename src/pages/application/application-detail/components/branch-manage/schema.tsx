import React from 'react';
import { Button, Popconfirm } from 'antd';
import dayjs from '_dayjs@1.10.4@dayjs';

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
        },
      },
    },
  ],
});

// 表格 schema
export const createTableSchema = ({
  onCancelClick,
}: {
  onCancelClick: (record: any, index: number) => void;
}) => [
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: '应用code',
    dataIndex: 'appCode',
  },
  {
    title: '分支名',
    dataIndex: 'branchName',
  },
  {
    title: '创建时间',
    dataIndex: 'gmtCreate',
    render: (val: string) =>
      val ? dayjs(val).format('YYYY-MM-DD HH:mm:ss') : '',
  },
  {
    title: '已部署环境',
    dataIndex: 'deployedEnv',
  },
  {
    title: '创建人',
    dataIndex: 'createUser',
  },
  {
    width: 120,
    title: '操作',
    dataIndex: 'operate',
    render: (text: string, record: any, index: number) => (
      <>
        <Popconfirm
          title="确定要作废该项吗？"
          onConfirm={() => onCancelClick(record, index)}
          okText="确定"
          cancelText="取消"
          placement="topLeft"
        >
          <Button type="primary" danger>
            作废
          </Button>
        </Popconfirm>
      </>
    ),
  },
];
