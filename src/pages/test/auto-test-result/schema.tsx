import React from 'react';

import dayjs from 'dayjs';
import { ColumnProps } from '@cffe/vc-hulk-table';

// 表格 schema
export const tableSchema: ColumnProps[] = [
  // {
  //   title: '序号',
  //   dataIndex: 'idx',
  //   valueType: 'index',
  // },
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: '用例集',
    dataIndex: 'group',
    render: (val) => val || '',
  },
  {
    title: '测试时间',
    dataIndex: 'testTime',
    render: (val, record) => (
      <span>
        {record.startTime
          ? dayjs(record.startTime).format('YYYY-MM-DD HH:mm:ss')
          : '-'}
        <br />
        {record.endTime
          ? dayjs(record.endTime).format('YYYY-MM-DD HH:mm:ss')
          : '-'}
      </span>
    ),
  },
  {
    title: '测试时长(秒)',
    dataIndex: 'useTime',
    render: (_, record) =>
      record.endTime && record.startTime
        ? dayjs(record.endTime).diff(dayjs(record.startTime)) / 1000
        : '-',
  },
  {
    title: '测试结果',
    dataIndex: 'status',
    valueType: 'status',
    statusEnum: {
      '0': {
        color: 'orange',
        text: '未运行',
      },
      '1': {
        color: 'blue',
        text: '运行中',
      },
      '2': {
        color: 'green',
        text: '成功',
      },
      '3': {
        color: 'red',
        text: '失败',
      },
    },
  },
  {
    title: '通过数',
    dataIndex: 'passNum',
    render: (val) => (val || Number(val) === 0 ? val : '-'),
  },
  {
    dataIndex: 'failNum',
    title: '失败数',
    render: (val) => (val || Number(val) === 0 ? val : '-'),
  },
  {
    title: '错误数',
    dataIndex: 'errorNum',
    render: (val) => (val || Number(val) === 0 ? val : '-'),
  },
  {
    title: '跳过数',
    dataIndex: 'skipNum',
    render: (val) => (val || Number(val) === 0 ? val : '-'),
  },
  {
    title: '构建方式',
    dataIndex: 'buildType',
    valueType: 'status',
    showStatusIcon: false,
    statusEnum: [
      { text: '手动', value: 1 },
      { text: '自动', value: 2 },
    ],
  },
];
