import React from 'react';
import moment, { Moment } from 'moment';
import { FormProps, OptionProps } from '@/components/table-search/typing';
import { Space, Tag, Popconfirm } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { Link, history } from 'umi';
import { statusType } from '../constant';
import { IPlanItem } from '../typing';

// 列表页-查询表单
export const createFormColumns = (params: {
  categoryData?: any[];
  onCategoryChange: (value: string) => void;
  groupData: any[];
}) => {
  return [
    {
      key: '2',
      type: 'select',
      label: '发布状态',
      dataIndex: 'deployStatus',
      width: '144px',
      placeholder: '请选择',
      option: [
        {
          key: '0',
          value: '未发布',
        },
        {
          key: '1',
          value: '已发布',
        },
        {
          key: '2',
          value: '已上线',
        },
      ],
    },
    {
      key: '3',
      type: 'select',
      label: '应用分类',
      dataIndex: 'appCategoryCode',
      width: '144px',
      placeholder: '请选择',
      option: params?.categoryData?.map((el) => {
        // 数据重新格式化，适应TableSearch
        return {
          ...el,
          key: el.value,
          value: el.label,
        };
      }),
      onChange: params.onCategoryChange,
    },
    {
      key: '4',
      type: 'select',
      label: '应用组',
      dataIndex: 'appGroupCode',
      width: '144px',
      placeholder: '请选择',
      option: params.groupData,
    },
    {
      key: '4',
      type: 'input',
      label: '应用CODE',
      dataIndex: 'appCode',
      width: '144px',
      placeholder: '支持模糊搜索',
    },
    {
      key: '5',
      type: 'date',
      label: '计划发布时间',
      dataIndex: 'preDeployTime',
      width: '144px',
      placeholder: '请选择日期',
    },
    {
      key: '6',
      type: 'input',
      label: '发布人',
      dataIndex: 'deployer',
      width: '144px',
      placeholder: '支持模糊搜索',
    },
  ] as FormProps[];
};

// 列表页-表格
export const createTableColumns = (params: {
  onDelete: (planId: string) => void;
}) => {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '3%',
      render: (text, record) => (
        <Link to={`./plan/checkConfigModify?id=${text}`}>{text}</Link>
      ),
    },
    {
      title: '发布状态',
      dataIndex: 'deployStatus',
      key: 'status',
      width: '5%',
      render: (text) => (
        <Tag color={statusType[text]?.color}>{statusType[text]?.text}</Tag>
      ),
    },
    {
      title: '应⽤分类',
      dataIndex: 'appCategoryCode',
      key: 'appCategoryCode',
      width: '5%',
    },
    {
      title: '应⽤组',
      dataIndex: 'appGroupCode',
      key: 'appGroupCode',
      width: '5%',
    },
    {
      title: '应用CODE',
      dataIndex: 'appCode',
      key: 'appCode',
      width: '6%',
    },
    {
      title: '应用类型',
      dataIndex: 'appType',
      key: 'appType',
      width: '5%',
    },
    {
      title: '版本号',
      dataIndex: 'version',
      key: 'version',
      width: '5%',
    },
    {
      title: '版本分支',
      dataIndex: 'deployRelease',
      key: 'deployRelease',
      width: '5%',
    },
    {
      title: '发布依赖',
      dataIndex: 'dependcy',
      key: 'dependcy',
      width: '5%',
    },
    {
      title: '开发',
      dataIndex: 'developer',
      key: 'developer',
      width: '5%',
    },
    {
      title: '测试',
      dataIndex: 'tester',
      key: 'tester',
      width: '5%',
    },
    {
      title: '发布人',
      dataIndex: 'deployer',
      key: 'deployer',
      width: '5%',
    },
    {
      title: '计划发布时间',
      dataIndex: 'preDeployTime',
      key: 'preDeployTime',
      width: '7%',
      render: (text) => {
        return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '';
      },
    },
    {
      title: '创建人',
      dataIndex: 'createUser',
      key: 'createUser',
      width: '5%',
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      fixed: 'right',
      width: 80,
      render: (_: string, record) => (
        //根据不同类型跳转
        <Space>
          <Link to={`./plan/editConfigModify?id=${record.id}`}>编辑</Link>
          <Popconfirm
            title="确认删除?"
            onConfirm={() => params?.onDelete(record?.planId!)}
          >
            <a style={{ color: 'rgb(255, 48, 3)' }}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ] as ColumnsType<IPlanItem>;
};
