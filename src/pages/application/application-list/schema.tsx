import React from 'react';
import { history } from 'umi';
import { Popconfirm } from 'antd';
import { ColumnProps } from '@cffe/vc-hulk-table';
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
  onDelClick,
}: {
  onEditClick: (record: any, index: number) => void;
  onDelClick: (record: any, index: number) => void;
}) =>
  [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 100,
    },
    {
      title: '应用名',
      dataIndex: 'appName',
      width: 100,
      render: (text, record) => (
        <a
          onClick={() =>
            history.push({
              pathname: 'detail',
              query: {
                id: record.id,
                appCode: record.appCode,
              },
            })
          }
        >
          {text}
        </a>
      ),
    },
    {
      title: '应用code',
      dataIndex: 'appCode',
      width: 100,
    },
    {
      title: 'git仓库名',
      dataIndex: 'gitlab',
      width: 200,
    },
    {
      title: '所属',
      dataIndex: 'belong',
      width: 80,
    },
    {
      title: '应用类型',
      dataIndex: 'appType',
      width: 100,
      render: (appType: AppType) => APP_TYPE_MAP[appType] || '',
    },
    {
      title: '业务线',
      dataIndex: 'lineCode',
      width: 100,
    },
    {
      title: '业务模块',
      dataIndex: 'sysCode',
      width: 100,
    },
    {
      title: '责任人',
      dataIndex: 'owner',
      width: 100,
    },
    {
      title: '应用描述',
      dataIndex: 'desc',
      width: 100,
    },
    {
      width: 200,
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
                  appCode: record.appCode,
                },
              })
            }
          >
            详情
          </a>
          <Popconfirm
            title="确定要删除该应用吗？"
            onConfirm={() => onDelClick(record, index)}
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
