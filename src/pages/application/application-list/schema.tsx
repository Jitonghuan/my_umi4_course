import React from 'react';
import { Button } from 'antd';

// 过滤表单 schema
export const filterFormSchema = {
  theme: 'inline',
  isShowReset: true,
  labelColSpan: 3,
  schema: [
    {
      type: 'Select',
      props: {
        label: '所属',
        name: 'belong',
        options: [
          {
            label: 'TODO',
            value: '1',
          },
        ],
      },
    },
    {
      type: 'Select',
      props: {
        label: '业务线',
        name: 'busLine',
        options: [
          {
            label: 'TODO',
            value: '1',
          },
        ],
      },
    },
    {
      type: 'Input',
      props: {
        label: '应用名',
        name: 'appName',
        props: {
          placeholder: '请输入',
        },
      },
    },
    {
      type: 'Input',
      props: {
        label: '应用code',
        name: 'appCode',
        props: {
          placeholder: '请输入',
        },
      },
    },
  ],
};

// 表格 schema
export const createTableSchema = ({
  onEditClick,
}: {
  onEditClick: (record: any, index: number) => void;
}) => [
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: '应用名',
    dataIndex: 'appName',
  },
  {
    title: '应用code',
    dataIndex: 'appCode',
  },
  {
    title: 'git仓库名',
    dataIndex: 'gitRepo',
  },
  {
    title: '所属',
    dataIndex: 'belong',
  },
  {
    title: '应用类型',
    dataIndex: 'appType',
  },
  {
    title: '业务线',
    dataIndex: 'busLine',
  },
  {
    title: '业务模块',
    dataIndex: 'busModule',
  },
  {
    title: '责任人',
    dataIndex: 'person',
  },
  {
    title: '应用描述',
    dataIndex: 'appDesc',
  },
  // {
  //   title: 'git仓库名',
  //   dataIndex: 'status',
  //   valueType: 'status',
  //   statusEnum: {
  //     '1': {
  //       text: '审批中',
  //       color: '#D16F0D',
  //     },
  //     '2': {
  //       text: '工单撤回',
  //       color: '#CC4631',
  //     },
  //     '3': {
  //       text: '审批拒绝',
  //       color: '#CC4631',
  //     },
  //     '4': {
  //       text: '审批通过执行成功',
  //       color: '#439D75',
  //     },
  //     '5': {
  //       text: '审批通过执行失败',
  //       color: '#CC4631',
  //     },
  //   },
  //   width: 100,
  // },
  {
    title: '操作',
    dataIndex: 'operate',
    render: (text: string, record: any, index: number) => (
      <>
        <a onClick={() => onEditClick(record, index)}>编辑</a>
        {/* TODO 跳转 */}
        <a style={{ marginLeft: 20 }}>详情</a>
      </>
    ),
  },
];
