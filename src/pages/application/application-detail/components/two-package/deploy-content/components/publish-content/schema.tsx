import React from 'react';
import { history } from 'umi';
import moment from 'moment';

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
    render: (val: string) =>
      val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '',
  },
  {
    title: '创建人',
    dataIndex: 'createUser',
  },
];
