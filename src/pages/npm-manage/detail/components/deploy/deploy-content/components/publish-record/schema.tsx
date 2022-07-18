import React from 'react';

// 表格 schema
export const createTableSchema = () => [
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

export const recordDisplayMap: any = {
  1: { text: '当前', color: 'blue' },
  2: { text: '历史', color: 'green' },
  3: { text: '部署中', color: 'geekblue' },
  4: { text: '部署失败', color: 'red' },
};
