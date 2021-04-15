import React from 'react';
import { history } from 'umi';

// 表格 schema
export const createTableSchema = () => [
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: '分支名',
    dataIndex: 'appName',
  },
  {
    title: '变更原因',
    dataIndex: 'appCode',
  },
  {
    title: '创建时间',
    dataIndex: 'gitRepo',
  },
  {
    title: '创建人',
    dataIndex: 'belong',
  },
];
