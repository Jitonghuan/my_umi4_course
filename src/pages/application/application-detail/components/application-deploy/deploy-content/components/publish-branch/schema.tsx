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
    dataIndex: 'branchName',
  },
  {
    title: '变更原因',
    dataIndex: 'desc',
  },
  {
    title: '创建时间',
    dataIndex: 'gmtCreate',
  },
  {
    title: '创建人',
    dataIndex: 'createUser',
  },
];
