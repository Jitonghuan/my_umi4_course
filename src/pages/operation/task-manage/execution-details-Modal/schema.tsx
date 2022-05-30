import React from 'react';
import { history } from 'umi';
import { Popconfirm, Tooltip, Tag } from 'antd';
import { Html5Outlined, CodeOutlined } from '@ant-design/icons';
import type { ColumnProps } from '@cffe/vc-hulk-table';
import { JOB_STATUS } from '../type';

export const tableColumns = [
  {
    title: 'taskId',
    dataIndex: 'taskId',
    width: 50,
  },
  {
    title: '开始执行时间',
    dataIndex: 'appName',
    width: 230,
  },
  {
    title: '结束执行时间',
    dataIndex: 'appName',
    width: 230,
  },
  {
    title: '执行状态',
    dataIndex: 'execStatus',
    width: 180,
    render: (status: any) => (
      <Tag color={JOB_STATUS[status]?.color || 'default'}>{JOB_STATUS[status]?.text || status}</Tag>
    ),
  },
  {
    title: '返回结果',
    dataIndex: 'timeExpression',
    width: 230,
  },
];
