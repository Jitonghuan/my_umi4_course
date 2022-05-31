import React from 'react';
import { history } from 'umi';
import { Popconfirm, Tooltip, Switch, Tag } from 'antd';
import { Html5Outlined, CodeOutlined } from '@ant-design/icons';
import type { ColumnProps } from '@cffe/vc-hulk-table';
import { JOB_STATUS } from './type';

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
export const taskTableSchema = ({
  onEditClick,
  onViewClick,
  onDelClick,
  onGetExecutionDetailClick,
  onSwitchEnableClick,
}: {
  onEditClick: (record: any, index: number) => void;
  onViewClick: (record: any, index: number) => void;
  onDelClick: (record: any, index: number) => void;
  onGetExecutionDetailClick: (record: any, index: number) => void;
  onSwitchEnableClick: (record: any, index: number) => void;
  // categoryData: any[];
  // businessDataList: any[];
}) =>
  [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 50,
    },
    {
      title: '任务名称',
      dataIndex: 'jobName',
      width: 230,
    },
    {
      title: '任务code',
      dataIndex: 'jobCode',
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
      title: '备注',
      width: 320,
      ellipsis: true,
      dataIndex: 'desc',
    },
    {
      title: '上次执行结果',
      dataIndex: 'lastExecStatus',
      width: 120,

      render: (status) => (
        <Tag color={JOB_STATUS[status]?.color || 'default'}>{JOB_STATUS[status]?.text || status}</Tag>
      ),
    },
    {
      title: '启用',
      dataIndex: 'enable',
      width: 100,
      render: (enable: number, record: any, index: number) => (
        <>
          <Switch
            checked={
              enable === 1 ? true : false 
            }
            onClick={() => {
              onSwitchEnableClick(record, index);
            }}
          />
        </>
      ),
    },
    {
      width: 140,
      title: '操作',

      dataIndex: 'operate',
      render: (_: any, record: any, index: number) => (
        <div className="action-cell">
          <a onClick={() => onGetExecutionDetailClick(record, index)}>执行详情</a>
          <a onClick={() => onViewClick(record, index)}>详情</a>

          <a
            onClick={() => {
              onEditClick(record, index);
            }}
          >
            编辑
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
