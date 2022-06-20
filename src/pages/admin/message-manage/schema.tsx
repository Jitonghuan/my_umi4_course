import React from 'react';
import { datetimeCellRender } from '@/utils';
import { FormProps, OptionProps } from '@/components/table-search/typing';
import { Space, Tag, Popconfirm, Tooltip, Switch } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { Link } from 'umi';
export const typeOptions = [
  { key: 'single', label: '个人', value: 'single' },
  {
    key: 'all',
    label: '全员',
    value: 'all',
  },
];
// 列表页-查询表单
export const createFormColumns = (params: { onTypeChange: (value: string) => void }) => {
  return [
    {
      key: '1',
      type: 'select',
      label: '类型',
      dataIndex: 'type',
      width: '200px',
      placeholder: '请选择',
      option: typeOptions,
      onChange: params.onTypeChange,
    },
  ] as FormProps[];
};

// 列表页-表格
export const createTableColumns = (params: {
  onEdit: (record: any, index: number) => void;
  onView: (record: any, index: number) => void;
  onDelete: (record: any) => void;
}) => {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '4%',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: '14%',
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: '40%',
      ellipsis: true,
      render: (text) => <Tooltip title={text}>{text}</Tooltip>,
    },
    {
      title: '发布时间',
      dataIndex: 'sendTime',
      key: 'sendTime',
      width: '20%',
      render: (value) => <>{datetimeCellRender(value)} </>,
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      width: '28%',
      ellipsis: true,
      render: (text) => <Tooltip title={text}>{text}</Tooltip>,
    },
    {
      title: '发送者',
      dataIndex: 'senderName',
      key: 'senderName',
      width: '10%',
      ellipsis: true,
      render: (text) => <Tooltip title={text}>{text}</Tooltip>,
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      width: '14%',
      render: (_: string, record, index: number) => (
        //根据不同类型跳转
        <Space>
          <a onClick={() => params.onView(record, index)}>详情</a>
          <a onClick={() => params.onEdit(record, index)}>编辑</a>
          <Popconfirm
            title="确认删除?"
            onConfirm={() => {
              params?.onDelete(record.id);
            }}
          >
            <a style={{ color: 'rgb(255, 48, 3)' }}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ] as ColumnsType<any>;
};
