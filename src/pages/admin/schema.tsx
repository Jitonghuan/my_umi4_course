import React from 'react';
import { datetimeCellRender } from '@/utils';
import { FormProps, OptionProps } from '@/components/table-search/typing';
import { Space, Tag, Popconfirm } from 'antd';
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
  onDelete: (planId: string) => void;
  categoryData: any[];
  businessData: any[];
}) => {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '3%',
      // render: (text, record) => <Link to={`./plan/checkConfigModify?id=${text}`}>{text}</Link>,
    },
    {
      title: '类型',
      dataIndex: 'deployStatus',
      key: 'status',
      width: 100,
      render: (text) => <></>,
    },
    {
      title: '标题',
      dataIndex: 'appCategoryCode',
      key: 'appCategoryCode',
      render: (text) => <></>,
    },
    {
      title: '发布时间',
      dataIndex: 'appGroupCode',
      key: 'appGroupCode',
      render: (text) => <></>,
    },
    {
      title: '是否置顶',
      dataIndex: 'appCode',
      key: 'appCode',
      width: 200,
      render: (text) => <></>,
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
          <Link to={`./plan/editConfigModify?id=${record.id}`}>详情</Link>
          <Link to={`./plan/editConfigModify?id=${record.id}`}>编辑</Link>
          <Popconfirm title="确认删除?" onConfirm={() => params?.onDelete(record?.planId!)}>
            <a style={{ color: 'rgb(255, 48, 3)' }}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ] as ColumnsType<any>;
};
