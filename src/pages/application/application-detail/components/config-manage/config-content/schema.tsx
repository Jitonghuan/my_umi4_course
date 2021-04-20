import React from 'react';
import { history } from 'umi';
import { Popconfirm, message } from 'antd';

const APP_TYPE_MAP = {
  frontend: '前端',
  backend: '后端',
};

// 过滤表单 schema
export const createFilterFormSchema = (params: {
  keys?: any[];
  values?: any[];
}) => ({
  theme: 'inline',
  isShowReset: true,
  labelColSpan: 3,
  schema: [
    {
      type: 'Select',
      props: {
        label: 'Key',
        name: 'key',
        options: params.keys || [],
        style: { width: 150 },
      },
    },
    {
      type: 'Select',
      props: {
        label: 'Value',
        name: 'value',
        options: params.values || [],
        style: { width: 150 },
      },
    },
  ],
});

// 表格 schema
export const createTableSchema = ({
  onOperateClick,
}: {
  onOperateClick: (
    type: 'detail' | 'delete' | 'edit',
    record: any,
    index: number,
  ) => void;
}) => [
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: 'Key',
    dataIndex: 'key',
  },
  {
    title: 'Value',
    dataIndex: 'value',
  },
  {
    width: 170,
    title: '操作',
    dataIndex: 'operate',
    render: (text: string, record: any, index: number) => (
      <>
        <a onClick={() => onOperateClick('detail', record, index)}>详情</a>
        <a
          style={{ marginLeft: 20 }}
          onClick={() => onOperateClick('edit', record, index)}
        >
          编辑
        </a>
        <Popconfirm
          title="确定要删除该项吗？"
          onConfirm={() => onOperateClick('delete', record, index)}
          okText="确定"
          cancelText="取消"
          placement="topLeft"
        >
          <a style={{ marginLeft: 20 }}>删除</a>
        </Popconfirm>
      </>
    ),
  },
];
