import React from 'react';
import { history } from 'umi';
import { AppType } from './types';

const APP_TYPE_MAP = {
  frontend: '前端',
  backend: '后端',
};

// 过滤表单 schema
export const createFilterFormSchema = (params: {
  belongData?: any[];
  businessData?: any[];
}) => ({
  theme: 'inline',
  isShowReset: true,
  labelColSpan: 3,
  schema: [
    {
      type: 'Select',
      props: {
        label: '所属',
        name: 'belong',
        options: params.belongData || [],
      },
    },
    {
      type: 'Select',
      props: {
        label: '业务线',
        name: 'lineCode',
        options: params.businessData || [],
      },
    },
    {
      type: 'Input',
      props: {
        label: '应用名',
        name: 'appName',
        props: {
          placeholder: '请输入',
        },
      },
    },
    {
      type: 'Input',
      props: {
        label: '应用code',
        name: 'appCode',
        props: {
          placeholder: '请输入',
        },
      },
    },
  ],
});

// 表格 schema
export const createTableSchema = ({
  onEditClick,
}: {
  onEditClick: (record: any, index: number) => void;
}) => [
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: '应用名',
    dataIndex: 'appName',
  },
  {
    title: '应用code',
    dataIndex: 'appCode',
  },
  {
    title: 'git仓库名',
    dataIndex: 'gitlab',
  },
  {
    title: '所属',
    dataIndex: 'belong',
  },
  {
    title: '应用类型',
    dataIndex: 'appType',
    render: (appType: AppType) => APP_TYPE_MAP[appType] || '',
  },
  {
    title: '业务线',
    dataIndex: 'lineCode',
  },
  {
    title: '业务模块',
    dataIndex: 'sysCode',
  },
  {
    title: '责任人',
    dataIndex: 'owner',
  },
  {
    title: '应用描述',
    dataIndex: 'desc',
  },
  {
    title: '操作',
    dataIndex: 'operate',
    render: (text: string, record: any, index: number) => (
      <>
        <a onClick={() => onEditClick(record, index)}>编辑</a>
        <a
          style={{ marginLeft: 20 }}
          onClick={() =>
            history.push({
              pathname: 'detail',
              query: {
                id: record.id,
              },
            })
          }
        >
          详情
        </a>
      </>
    ),
  },
];
