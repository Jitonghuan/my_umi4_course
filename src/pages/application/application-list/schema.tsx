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
  categoryData?: any[];
  businessData?: any[];
}) => ({
  theme: 'inline',
  isShowReset: true,
  labelColSpan: 3,
  schema: [
    {
      type: 'Select',
      props: {
        label: '应用分类',
        name: 'appCategoryCode',
        options: params.categoryData || [],
      },
    },
    {
      type: 'Select',
      props: {
        label: '应用组',
        name: 'appGroupCode',
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
  categoryData,
  businessDataList,
}: {
  onEditClick: (record: any, index: number) => void;
  onDelClick: (record: any, index: number) => void;
  categoryData: any[];
  businessDataList: any[];
}) =>
  [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 50,
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
                isClient: record.isClient,
                isContainClient: record.isContainClient,
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
      dataIndex: 'gitAddress',
      width: 200,
    },
    {
      title: '应用分类',
      dataIndex: 'appCategoryCode',
      width: 80,
      render: (appCategoryCode) =>
        categoryData?.find((v) => v.categoryCode === appCategoryCode)
          .categoryName || '-',
    },
    {
      title: '应用类型',
      dataIndex: 'appType',
      width: 80,
      render: (appType: AppType) => APP_TYPE_MAP[appType] || '',
    },
    {
      title: '应用组',
      dataIndex: 'appGroupCode',
      width: 100,
      render: (appGroupCode) =>
        businessDataList?.find((v) => v.groupCode === appGroupCode).groupName ||
        '-',
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
      width: 150,
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
                  isClient: record.isClient,
                  isContainClient: record.isContainClient,
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
