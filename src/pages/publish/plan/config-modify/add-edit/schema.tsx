import React from 'react';
import { Tag } from 'antd';
import { statusType } from '@/pages/publish/constant';
import moment from 'moment';

export const tableColumns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 70,
  },
  {
    title: '发布功能',
    dataIndex: 'funcName',
    key: 'funcName',
  },
  {
    title: '发布状态',
    dataIndex: 'deployStatus',
    key: 'deployStatus',
    render: (text: number) => (
      <Tag color={statusType[text]?.color}>{statusType[text]?.text}</Tag>
    ),
  },
  {
    title: '应用分类',
    dataIndex: 'appCategoryCode',
    key: 'appCategoryCode',
  },
  {
    title: '应用组',
    dataIndex: 'appGroupCode',
    key: 'appGroupCode',
  },
  {
    title: '发布环境',
    dataIndex: 'envs',
    key: 'envs',
  },
  {
    title: '涉及业务范围',
    dataIndex: 'coverageRange',
    key: 'coverageRange',
  },
  {
    title: '解决的实际需求',
    dataIndex: 'resolveNeeds',
    key: 'resolveNeeds',
  },
  {
    title: '计划发布时间',
    dataIndex: 'preDeployTime',
    key: 'preDeployTime',
    width: '8%',
    render: (text: string) => {
      return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '';
    },
  },
  {
    title: '需求ID',
    dataIndex: 'demandId',
    key: 'demandId',
  },
  {
    title: '创建人',
    dataIndex: 'createUser',
    key: 'createUser',
    width: 100,
  },
  {
    title: '创建时间',
    dataIndex: 'gmtCreate',
    key: 'gmtCreate',
    width: '8%',
    render: (text: string) => {
      return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '';
    },
  },
];
