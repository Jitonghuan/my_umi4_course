import React from 'react';
import { history } from 'umi';
import { Popconfirm, Tooltip, Switch, Tag } from 'antd';
import { Html5Outlined, CodeOutlined } from '@ant-design/icons';
import type { ColumnProps } from '@cffe/vc-hulk-table';

// 表格 schema
export const taskTableSchema = ({
  onEditClick,
  onViewClick,
  onDelClick,
  onGetExecutionDetailClick,
  onSwitchEnableClick,
}: {
  onEditClick: (record: any, index: number) => void;
  onViewClick: (record: any, index: number) => void;
  onDelClick: (record: any, index: number) => void;
  onGetExecutionDetailClick: (record: any, index: number) => void;
  onSwitchEnableClick: (record: any, index: number) => void;
}) =>
  [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '校验规则名称',
      dataIndex: 'ruleName',
      key: 'ruleName',
    },
    {
      title: 'groupId',
      dataIndex: 'groupId',
      key: 'groupId',
    },
    {
      title: 'artifactId',
      dataIndex: 'artifactId',
      key: 'artifactId',
    },
    {
      title: '版本范围',
      dataIndex: 'versionRange',
      key: 'versionRange',
    },
    {
      title: '校验环境',
      dataIndex: 'envCode',
      key: 'envCode',
      render: (value: any, record: any) => {
        return (
          <>
            {value.split(',').map((item: any) => (
              <Tag color="blue">{item}</Tag>
            ))}
          </>
        );
      },
    },
    {
      title: '升级截止日期',
      dataIndex: 'blockTime',
      key: 'blockTime',
    },
    {
      title: '校验级别',
      dataIndex: 'checkLevel',
      key: 'checkLevel',
    },
    {
      title: '校验开关',
      dataIndex: 'dependencyCheck',
      key: 'dependencyCheck',
      render: (value: any, record: any) => {
        return <Switch checked={value} onChange={() => {}} />;
      },
    },
    {
      title: '操作',
      dataIndex: '',
      key: 'action',
      render: (text: string, record: any) => {
        return (
          <>
            <a onClick={() => {}}>详情</a>
            <a onClick={() => {}}>编辑</a>
            <Popconfirm title="确认删除" okText="是" cancelText="否" onConfirm={() => {}}>
              <a type="link">删除</a>
            </Popconfirm>
          </>
        );
      },
    },
  ] as ColumnProps[];
