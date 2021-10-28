import { Tooltip } from 'antd';
import React from 'react';
import { datetimeCellRender } from '@/utils';

// 表格 schema
export const createTableSchema = () => [
  {
    width: 80,
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: '分支名',
    width: 300,
    dataIndex: 'branchName',
  },
  {
    title: '变更原因',
    dataIndex: 'desc',
    width: 180,
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
    render: datetimeCellRender,
  },
  {
    width: 80,
    title: '创建人',
    dataIndex: 'createUser',
  },
];
