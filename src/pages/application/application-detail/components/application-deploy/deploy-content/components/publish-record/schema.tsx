import React from 'react';
import { history } from 'umi';

// 表格 schema
export const createTableSchema = () => [
  {
    title: '发布Id',
    dataIndex: 'id',
  },
  {
    title: '发布人',
    dataIndex: 'modifyUser',
  },
  {
    title: '发布时间',
    dataIndex: 'deployedTime',
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
  modifyUser: '发布人',
  deployedTime: '发布时间',
  envs: '发布环境',
  deployStatus: '发布状态',
  features: '功能分支',
  releaseBranch: '发布分支',
  merge: 'git merge', // TODO
};
