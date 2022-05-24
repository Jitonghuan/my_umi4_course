import React from 'react';
import { history } from 'umi';
import { Popconfirm, Tooltip } from 'antd';
import { Html5Outlined, CodeOutlined } from '@ant-design/icons';
import type { ColumnProps } from '@cffe/vc-hulk-table';
export const tableColumns = [
  {
    title: 'taskId',
    dataIndex: 'id',
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
    dataIndex: 'appCode',
    width: 180,
    ellipsis: {
      showTitle: false,
    },
    render: (value: any) => (
      <Tooltip placement="topLeft" title={value}>
        {value}
      </Tooltip>
    ),
  },
  {
    title: '返回结果',
    dataIndex: 'appName',
    width: 230,
  },
];
