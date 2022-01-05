import { datetimeCellRender } from '@/utils';
import { Tooltip } from 'antd';
import React from 'react';

// 表格 schema
export const createTableSchema = () => [
  {
    width: 80,
    title: 'ID',
    dataIndex: 'id',
    key: 1,
  },
  {
    title: '分支名',
    width: 300,
    dataIndex: 'branchName',
    key: 2,
  },
  {
    title: '变更原因',
    dataIndex: 'desc',
    width: 180,
    key: 3,
    ellipsis: {
      showTitle: false,
    },
    render: (value: string) => (
      <Tooltip placement="topLeft" title={value}>
        {value}
      </Tooltip>
    ),
  },
  {
    width: 160,
    title: '创建时间',
    dataIndex: 'gmtCreate',
    key: 4,
    render: datetimeCellRender,
  },
  {
    width: 80,
    title: '创建人',
    dataIndex: 'createUser',
    key: 5,
  },
];
