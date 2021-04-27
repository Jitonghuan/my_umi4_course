import React from 'react';
import { Tag, Badge } from 'antd';
import { history } from 'umi';
import { ColumnProps } from '@cffe/vc-hulk-table';

const APPLY_STATUS_MAP: { [key: number]: string } = {
  1: '审批成功',
  3: '已撤销',
};

const APPLY_STATUS_COLOR_MAP: { [key: number]: string } = {
  1: 'green',
  3: '',
};

const DEPLOY_TYPE_MAP: { [key: string]: string } = {
  daily: '日常发布',
  emergency: '紧急发布',
};

const DEPLOY_TYPE_COLOR_MAP: { [key: string]: string } = {
  daily: 'green',
  emergency: 'red',
};

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
        options: [
          {
            label: '日常发布',
            value: 'daily',
          },
          {
            label: '紧急发布',
            value: 'emergency',
          },
        ],
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
}: {
  onDetailClick: (record: any) => void;
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
    },
    {
      title: '功能回归',
      dataIndex: 'ifFuncRegression',
    },
    {
      title: '是否CR',
      dataIndex: 'ifCr',
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
