import React from 'react';
import { Tag, Badge } from 'antd';
import { ColumnProps } from '@cffe/vc-hulk-table';
import {
  APPLY_STATUS_COLOR_MAP,
  APPLY_STATUS_MAP,
  DEPLOY_TYPE_COLOR_MAP,
  DEPLOY_TYPE_MAP,
  DEPLOY_TYPE_OPTIONS,
} from './const';

// 过滤表单 schema
export const createFilterFormSchema = (params: {
  belongData?: any[];
  businessData?: any[];
}) => ({
  theme: 'inline',
  isShowReset: true,
  labelColSpan: 3,
  schema: [
    {
      type: 'Select',
      props: {
        label: '所属',
        name: 'belong',
        options: params.belongData || [],
      },
    },
    {
      type: 'Select',
      props: {
        label: '业务线',
        name: 'lineCode',
        options: params.businessData || [],
      },
    },
    {
      type: 'Select',
      props: {
        label: '发布类型',
        name: 'deployType',
        options: DEPLOY_TYPE_OPTIONS,
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
  belongData,
}: {
  onDetailClick: (record: any) => void;
  belongData?: any[];
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
      title: '发布类型',
      dataIndex: 'deployType',
      render: (deployType: string, record) => (
        <Badge
          color={DEPLOY_TYPE_COLOR_MAP[deployType]}
          text={DEPLOY_TYPE_MAP[deployType]}
        />
      ),
    },
    {
      title: '申请名',
      dataIndex: 'title',
    },
    {
      title: '所属',
      dataIndex: 'belong',
      render: (value) => {
        const result = belongData?.filter((el) => el.belongCode === value);
        return result?.length ? result[0].belongName : value || '';
      },
    },
    {
      title: '业务线',
      dataIndex: 'lineCode',
    },
    {
      title: '机构',
      dataIndex: 'deployEnv',
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
    },
    {
      title: '申请人',
      dataIndex: 'applyUser',
    },
  ] as ColumnProps[];

export const planSchemaColumns = [
  {
    title: '计划ID',
    dataIndex: 'id',
  },
  {
    title: '应用名',
    dataIndex: 'appCode',
  },
  {
    title: '应用类型',
    dataIndex: 'deployType',
  },
  {
    title: '变更类型',
    dataIndex: 'changeType',
  },
  {
    title: '所属',
    dataIndex: 'belong',
  },
  {
    title: '业务线',
    dataIndex: 'lineCode',
  },
  {
    title: '业务模块',
    dataIndex: 'sysCode',
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
    dataIndex: 'develop',
  },
  {
    title: '测试',
    dataIndex: 'test',
  },
  {
    title: '发布人',
    dataIndex: 'deploy',
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
