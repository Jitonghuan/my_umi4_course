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

// 发布记录字段 map
export const recordFieldMap: { [key: string]: string } = {
  id: '发布Id',
  createUser: '创建人',
  gmtPublish: '发布时间',
  env: '发布环境',
  deployStatus: '发布状态',
  features: '功能分支',
  releaseBranch: '发布分支',
  merge: 'git merge', // TODO
};
