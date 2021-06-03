import React from 'react';
import { Tag, Badge } from 'antd';
import { ColumnProps } from '@cffe/vc-hulk-table';
import {
  APPLY_STATUS_COLOR_MAP,
  APPLY_STATUS_MAP,
  DEPLOY_TYPE_OPTIONS,
  EMERGENCY_TYPE_COLOR_MAP,
  EMERGENCY_TYPE_MAP,
  EMERGENCY_TYPE_OPTIONS,
  APP_TYPE_MAP,
  AppType,
} from './const';
import { getEnvName } from '@/utils';
import moment from 'moment';

// 过滤表单 schema
export const createFilterFormSchema = (params: {
  categoryData?: any[];
  businessData?: any[];
}) => ({
  theme: 'inline',
  isShowReset: true,
  labelColSpan: 3,
  schema: [
    {
      type: 'Select',
      props: {
        label: '应用分类',
        name: 'appCategoryCode',
        options: params.categoryData || [],
      },
    },
    {
      type: 'Select',
      props: {
        label: '应用组',
        name: 'appGroupCode',
        options: params.businessData || [],
      },
    },
    {
      type: 'Select',
      props: {
        label: '部署类型',
        name: 'deployType',
        options: DEPLOY_TYPE_OPTIONS,
      },
    },
    {
      type: 'Select',
      props: {
        label: '紧急类型',
        name: 'emergencyType',
        options: EMERGENCY_TYPE_OPTIONS,
      },
    },
    {
      type: 'DatePicker',
      props: {
        label: '申请时间',
        name: 'deployDate',
        props: {
          placeholder: '请选择日期',
        },
      },
    },
  ],
});

// 表格 schema
export const createTableSchema = ({
  onDetailClick,
  categoryData,
  businessDataList,
  envsUrlList,
}: {
  onDetailClick: (record: any) => void;
  categoryData?: any[];
  businessDataList: any[];
  envsUrlList: any[];
}) =>
  [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (text, record) => (
        <a onClick={() => onDetailClick(record)}>{text}</a>
      ),
    },
    {
      title: '审批状态',
      dataIndex: 'applyStatus',
      render: (applyStatus: number, record) =>
        APPLY_STATUS_MAP[applyStatus] ? (
          <Tag color={APPLY_STATUS_COLOR_MAP[applyStatus] || ''}>
            {APPLY_STATUS_MAP[applyStatus]}
          </Tag>
        ) : (
          applyStatus
        ),
    },
    {
      title: '紧急类型',
      dataIndex: 'emergencyType',
      render: (text: string, record) => (
        <Badge
          color={EMERGENCY_TYPE_COLOR_MAP[text]}
          text={EMERGENCY_TYPE_MAP[text]}
        />
      ),
    },
    {
      title: '申请名',
      dataIndex: 'title',
    },
    {
      title: '应用分类',
      dataIndex: 'appCategoryCode',
      render: (value) => {
        const result = categoryData?.filter((el) => el.value === value);
        return result?.length ? result[0].label : value || '';
      },
    },
    {
      title: '应用组',
      dataIndex: 'appGroupCode',
      render: (text) =>
        businessDataList?.find((v) => v.groupCode === text).groupName || '-',
    },
    {
      title: '发布环境',
      dataIndex: 'deployEnv',
      render: (text) => getEnvName(envsUrlList, text) || '-',
    },
    {
      title: '发布负责人',
      dataIndex: 'deployUser',
    },
    {
      title: '计划发布时间',
      dataIndex: 'deployDate',
    },
    {
      title: '配置变更',
      dataIndex: 'ifDdl',
      render: (value) => (value ? '是' : '否'),
    },
    {
      title: '功能回归',
      dataIndex: 'ifFuncRegression',
      render: (value) => (value ? '是' : '否'),
    },
    {
      title: '是否CR',
      dataIndex: 'ifCr',
      render: (value) => (value ? '是' : '否'),
    },
    {
      title: '申请时间',
      dataIndex: 'gmtCreate',
      render: (text: string) => {
        return text ? moment(text).format('YYYY-MM-DD HH:mm') : '';
      },
    },
    {
      title: '申请人',
      dataIndex: 'applyUser',
    },
  ] as ColumnProps[];

export const createPlanSchemaColumns = ({
  categoryData,
  businessDataList,
}: {
  categoryData?: any[];
  businessDataList: any[];
}) => [
  {
    title: '计划ID',
    dataIndex: 'id',
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
    title: '应用CODE',
    dataIndex: 'appCode',
  },
  {
    title: '应用类型',
    dataIndex: 'deployType',
    render: (text: AppType) => APP_TYPE_MAP[text] || '-',
  },
  {
    title: '版本号',
    dataIndex: 'version',
  },
  {
    title: '版本分支',
    dataIndex: 'deployRelease',
  },
  {
    title: '发布依赖',
    dataIndex: 'dependency',
  },
  {
    title: '开发',
    dataIndex: 'developer',
  },
  {
    title: '测试',
    dataIndex: 'tester',
  },
  {
    title: '发布人',
    dataIndex: 'deployer',
  },
  {
    title: '期望发布时间',
    dataIndex: 'preDeployTime',
  },
  {
    title: '创建人',
    dataIndex: 'createUser',
  },
];

export const createApplyDetailSchemaColumns = ({
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
  },
  {
    title: '功能名称',
    dataIndex: 'funcName',
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
  },
  {
    title: '解决的实际需求',
    dataIndex: 'resolveNeeds',
  },
  {
    title: '预计发布时间',
    dataIndex: 'preDeployTime',
    render: (text: string) => {
      return text ? moment(text).format('YYYY-MM-DD HH:mm') : '';
    },
  },
  {
    title: '需求ID',
    dataIndex: 'demandId',
  },
  {
    title: '创建人',
    dataIndex: 'createUser',
  },
  {
    title: '创建时间',
    dataIndex: 'gmtCreate',
    render: (text: string) => {
      return text ? moment(text).format('YYYY-MM-DD HH:mm') : '';
    },
  },
];
