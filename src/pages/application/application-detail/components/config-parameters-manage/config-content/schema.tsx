import React from 'react';
import { history } from 'umi';
import { Popconfirm, message } from 'antd';
import { ColumnProps } from '@cffe/vc-hulk-table';

const APP_TYPE_MAP = {
  frontend: '前端',
  backend: '后端',
};

// 过滤表单 schema
export const createFilterFormSchema = ({ versionOptions = [] }: any) => ({
  theme: 'inline',
  isShowReset: true,
  labelColSpan: 3,
  schema: [
    {
      type: 'Custom',
      props: {
        label: '版本',
        name: 'versionID',
        style: { width: 150 },
        custom: 'versionSelect',
        options: versionOptions,
      },
    },
    {
      type: 'Input',
      props: {
        label: 'Key',
        name: 'key',
        style: { width: 150 },
      },
    },
    {
      type: 'Input',
      props: {
        label: 'Value',
        name: 'value',
        style: { width: 150 },
      },
    },
  ],
});

// filter form columns
export const getFilterColumns = (versionOptions: IOption[]) => [
  {
    label: '版本',
    name: 'versionID',
    style: { width: '240px' },
    type: 'Select',
    options: versionOptions,
  },
  {
    type: 'Input',
    label: 'Key',
    name: 'key',
    style: { width: '200px' },
  },
  {
    type: 'Input',
    label: 'Value',
    name: 'value',
    style: { width: '200px' },
  },
];

// 表格 schema
export const createTableSchema = ({
  currentVersion,
  onOperateClick,
}: {
  currentVersion?: any;
  onOperateClick: (type: 'detail' | 'delete' | 'edit', record: any, index: number) => void;
}) =>
  [
    {
      width: 80,
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
      title: '版本号',
      dataIndex: 'version',
      render: () => currentVersion?.versionNumber || '',
    },
    {
      width: 170,
      title: '操作',
      dataIndex: 'operate',
      // valueType: 'operate',
      // actions: [{
      //   title: '详情',
      //   key: 'detail'
      // },{
      //   title: '编辑',
      //   key: 'edit'
      // }, {
      //   title: '删除',
      //   key: 'delete',
      //   showConfirm: true,
      //   confirmTitle: '确定要删除该项吗？'
      // }]
      render: (text: string, record: any, index: number) => (
        <>
          <a onClick={() => onOperateClick('detail', record, index)}>详情</a>
          <a style={{ marginLeft: 20 }} onClick={() => onOperateClick('edit', record, index)}>
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
  ] as ColumnProps[];
