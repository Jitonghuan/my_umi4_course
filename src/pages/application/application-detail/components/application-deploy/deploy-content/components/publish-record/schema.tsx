import React from 'react';
import { history } from 'umi';

// 表格 schema
export const createTableSchema = () => [
  {
    title: '发布Id',
    dataIndex: 'id',
  },
  {
    title: '创建人',
    dataIndex: 'createUser',
  },
  {
    title: '发布时间',
    dataIndex: 'gmtPublish',
  },
  {
    title: '操作',
    dataIndex: 'operate',
    render: () => <a>详情</a>,
  },
];
