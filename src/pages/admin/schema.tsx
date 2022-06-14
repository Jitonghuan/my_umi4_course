import React from 'react';
import { datetimeCellRender } from '@/utils';
import { FormProps, OptionProps } from '@/components/table-search/typing';
import { Space, Tag, Popconfirm, Tooltip, Switch } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { Link } from 'umi';
// 列表页-查询表单
export const createFormColumns = (params: {
  categoryData?: any[];
  onCategoryChange: (value: string) => void;
  groupData: any[];
}) => {
  return [
    {
      key: '1',
      type: 'input',
      label: '标题',
      dataIndex: 'title',
      width: '200px',
      placeholder: '请输入',
    },
    {
      key: '2',
      type: 'select',
      label: '类型',
      dataIndex: 'appCategoryCode',
      width: '200px',
      placeholder: '请选择',
      option: [
        {
          label: '公告',
          value: '',
        },
      ],
    },
    {
      key: '3',
      type: 'area',
      label: '内容',
      dataIndex: 'appGroupCode',
      width: '200px',
      placeholder: '请填写',
      rules: [],
    },
  ] as FormProps[];
};

// 列表页-表格
export const createTableColumns = (params: {
  onDelete: () => void;
  onView: () => void;
  onEdit: () => void;
  curRecord: any;
}) => {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '3%',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      render: (text) => <Tooltip title={text}></Tooltip>,
    },
    {
      title: '发布时间',
      dataIndex: 'gmtCreate',
      key: 'gmtCreate',
      width: 200,
      render: (value) => <>{datetimeCellRender(value)} </>,
    },
    {
      title: '是否置顶',
      dataIndex: 'priority',
      key: 'priority',
      width: 140,
      render: (value) => <Switch></Switch>,
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      fixed: 'right',
      width: 80,
      render: (_: string, record) => (
        //根据不同类型跳转
        <Space>
          <a>详情</a>
          <a>编辑</a>
          <Popconfirm title="确认删除?" onConfirm={() => params?.onDelete()}>
            <a style={{ color: 'rgb(255, 48, 3)' }}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ] as ColumnsType<any>;
};
