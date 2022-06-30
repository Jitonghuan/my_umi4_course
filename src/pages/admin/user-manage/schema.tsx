import React from 'react';
import { datetimeCellRender } from '@/utils';
import { FormProps, OptionProps } from '@/components/table-search/typing';
import { Space, Tag, Popconfirm, Tooltip, Switch } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { Link } from 'umi';

// 列表页-表格
export const createTableColumns = (params: {
  onEdit: (record: any, index: number) => void;
  onView: (record: any, index: number) => void;
}) => {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 120,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: '14%',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: '30%',
      ellipsis: true,
      render: (text) => <Tooltip title={text}>{text}</Tooltip>,
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      key: 'mobile',
      width: '28%',
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
        </Space>
      ),
    },
  ] as ColumnsType<any>;
};

// 列表页-表格
export const roleTableColumns = (params: {
  onEdit: (record: any, index: number) => void;
  onDelete: (record: any) => void;
}) => {
  return [
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      width: 120,
    },
    {
      title: '应用分类',
      dataIndex: 'categoryCode',
      key: 'categoryCode',
      width: '14%',
    },
    {
      title: '应用组',
      dataIndex: 'groupCode',
      key: 'groupCode',
      width: '30%',
    },

    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      width: '14%',
      render: (_: string, record, index: number) => (
        <Space>
          <a onClick={() => params.onEdit(record, index)}>编辑</a>
          <Popconfirm
            title="确认删除?"
            onConfirm={() => {
              params.onDelete(record);
            }}
          >
            <a style={{ color: 'rgb(255, 48, 3)' }}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ] as ColumnsType<any>;
};
