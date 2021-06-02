import React from 'react';
import { Tag } from 'antd';
import { statusType } from '@/pages/publish/constant';
import { getEnvName } from '@/utils';
import moment from 'moment';

export const createTableColumns = ({
  categoryData,
  businessDataList,
  envsUrlList,
}: {
  categoryData?: any[];
  businessDataList: any[];
  envsUrlList: any[];
}) => [
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
    render: (value: string) => {
      const result = categoryData?.filter((el) => el.value === value);
      return result?.length ? result[0].label : value || '';
    },
  },
  {
    title: '应用组',
    dataIndex: 'appGroupCode',
    render: (text: string) =>
      businessDataList?.find((v) => v.groupCode === text)?.groupName || '-',
  },
  {
    title: '发布环境',
    dataIndex: 'envs',
    render: (text: string) => getEnvName(envsUrlList, text) || '-',
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
