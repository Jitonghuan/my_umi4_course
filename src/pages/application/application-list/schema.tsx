import React from 'react';
import { history } from 'umi';
import { Popconfirm } from 'antd';
import { Html5Outlined, CodeOutlined } from '@ant-design/icons';
import type { ColumnProps } from '@cffe/vc-hulk-table';

export type AppType = 'frontend' | 'backend';

const APP_TYPE_MAP = {
  frontend: '前端',
  backend: '后端',
};

const APP_TYPE_ICON = {
  frontend: <Html5Outlined />,
  backend: <CodeOutlined />,
};

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
      width: 200,
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
    },
    {
      title: 'git仓库名',
      dataIndex: 'gitAddress',
      render: (value: string) =>
        value && (
          <a href={value} target="_blank">
            {value}
          </a>
        ),
    },
    {
      title: '应用分类',
      dataIndex: 'appCategoryCode',
      width: 90,
      render: (value) => categoryData?.find((v) => v.categoryCode === value)?.categoryName || '-',
    },
    {
      title: '应用类型',
      dataIndex: 'appType',
      width: 80,
      render: (appType: AppType) => (
        <>
          {APP_TYPE_ICON[appType]}&nbsp;
          {APP_TYPE_MAP[appType] || '--'}
        </>
      ),
    },
    {
      title: '应用组',
      dataIndex: 'appGroupCode',
      width: 90,
      render: (value) => businessDataList?.find((v) => v.groupCode === value)?.groupName || '-',
    },
    {
      title: '责任人',
      dataIndex: 'owner',
      width: 100,
    },
    {
      title: '应用描述',
      dataIndex: 'desc',
    },
    {
      width: 140,
      title: '操作',
      dataIndex: 'operate',
      render: (_: any, record: any, index: number) => (
        <div className="action-cell">
          <a onClick={() => onEditClick(record, index)}>编辑</a>
          <a
            onClick={() => {
              history.push({
                pathname: 'detail',
                query: {
                  id: record.id,
                  appCode: record.appCode,
                  isClient: record.isClient,
                  isContainClient: record.isContainClient,
                },
              });
            }}
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
            <a>删除</a>
          </Popconfirm>
        </div>
      ),
    },
  ] as ColumnProps[];
