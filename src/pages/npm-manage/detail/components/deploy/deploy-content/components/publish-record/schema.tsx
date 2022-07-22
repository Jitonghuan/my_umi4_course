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
  wait: { text: '发布开始', color: 'blue' },
  process: { text: '正在发布', color: 'geekblue' },
  error: { text: '发布失败', color: 'red' },
  finish: { text: '发布完成', color: 'green' },
};
