import React from 'react';

// 表格 schema
export const createTableSchema = () => [
  // {
  //   title: '发布Id',
  //   dataIndex: 'id',
  // },
  {
    title: '发布人',
    dataIndex: 'modifyUser',
  },
  {
    title: '发布时间',
    dataIndex: 'deployedTime',
  },
  {
    title: '发布状态',
    dataIndex: 'deployStatus',
  },
  {
    title: '操作',
    dataIndex: 'operate',
    render: () => <a>详情</a>,
  },
];

// 发布记录字段 map
export const recordFieldMapOut: { [key: string]: any } = {
  // id: '发布Id',
  modifyUser: '发布人',
  deployedTime: '发布时间',
  deployStatus: '发布状态',
  envs: '发布环境',

  // conflictFeature: '冲突分支',
  jenkinsUrl: 'jenkins',
  branchInfo: '功能分支',
  // releaseBranch: '发布分支',
  // version: '版本号',
  // tagName: 'tag',
};

// 发布记录字段 map
export const recordFieldMap: { [key: string]: any } = {
  id: '发布Id',
  modifyUser: '发布人',
  deployedTime: '发布时间',
  envs: '发布环境',
  deployStatus: '发布状态',
  // conflictFeature: '冲突分支',
  jenkinsUrl: 'jenkins',
  branchInfo: '功能分支',
  // releaseBranch: '发布分支',
  // version: '版本号',
  // tagName: 'tag',
};
