import React from 'react';
import { history } from 'umi';
import { Popconfirm, Tooltip } from 'antd';
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
      width: 230,
      render: (text, record) => (
        <a
          onClick={() =>{
            history.push({
              pathname: 'detail',
              search: `id=${record.id}&appCode=${record.appCode}`,
              
            })

          }}
        >
          {text}
        </a>
      ),
    },
    {
      title: '应用code',
      dataIndex: 'appCode',
      width: 180,
      ellipsis: {
        showTitle: false,
      },
      render: (value) => (
        <Tooltip placement="topLeft" title={value}>
          {value}
        </Tooltip>
      ),
    },
    {
      title: 'Git仓库地址',
      width: 320,
      ellipsis: true,
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
      width: 120,
      render: (value) => categoryData?.find((v) => v.categoryCode === value)?.categoryName || '-',
    },
    {
      title: '应用类型',
      dataIndex: 'appType',
      width: 100,
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
      width: 120,
      render: (value) => businessDataList?.find((v) => v.groupCode === value)?.groupName || '-',
    },
    {
      title: '责任人',
      dataIndex: 'owner',
      ellipsis: true,
      width: 300,
    },
    {
      title: '应用描述',
      dataIndex: 'desc',
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      render: (value) => (
        <Tooltip placement="topLeft" title={value}>
          {value}
        </Tooltip>
      ),
    },
    {
      width: 140,
      title: '操作',
      fixed: 'right',
      dataIndex: 'operate',
      align: 'center',
      render: (_: any, record: any, index: number) => (
        <div className="action-cell">
          <a onClick={() => onEditClick(record, index)}>编辑</a>
          <a
            onClick={() => {
              history.push({
                pathname: 'detail',
                search: `id=${record.id}&appCode=${record.appCode}&deploymentName=${record?.deploymentName}`,
              });
            }}

          >
            详情
          </a>
          {/* <Popconfirm
            title="确定要删除该应用吗？"
            onConfirm={() => onDelClick(record, index)}
            okText="确定"
            cancelText="取消"
            placement="topLeft"
          > */}
          <a
            style={{ color: 'rgb(255, 48, 3)' }}
            onClick={() => {
              onDelClick(record, index);
            }}
          >
            删除
          </a>
          {/* </Popconfirm> */}
        </div>
      ),
    },
  ] as ColumnProps[];
