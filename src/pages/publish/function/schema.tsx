import React from 'react';
import { Moment } from 'moment';
import { FormProps } from '@/components/table-search/typing';
import { Space, Tag, Popconfirm } from '@cffe/h2o-design';
import type { ColumnsType } from 'antd/lib/table';
import { Link } from 'umi';
import { getEnvName } from '@/utils';
import { statusType } from '../constant';
import { IFuncItem } from '../typing';
import { datetimeCellRender } from '@/utils';

export const createFormItems = (params: {
  categoryData?: any[];
  onCategoryChange: (code: string) => void;
  groupData: any[];
}) => {
  return [
    {
      key: '1',
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
      onChange: (e: React.FormEvent<HTMLInputElement>) => {
        console.log(e);
      },
    },
    {
      key: '2',
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
      key: '3',
      type: 'select',
      label: '应用组',
      dataIndex: 'appGroupCode',
      width: '144px',
      placeholder: '请选择',
      option: params?.groupData?.map((el) => {
        // 数据重新格式化，适应TableSearch
        return {
          ...el,
          key: el.value,
          value: el.label,
        };
      }),
    },
    {
      key: '4',
      type: 'input',
      label: '功能名称',
      dataIndex: 'funcName',
      width: '144px',
      placeholder: '支持模糊搜索',
      onChange: (e: React.FormEvent<HTMLInputElement>) => {
        console.log(e);
      },
    },
    {
      key: '5',
      type: 'date',
      label: '计划发布时间',
      dataIndex: 'preDeployTime',
      width: '144px',
      placeholder: '请选择日期',
      rules: [],
      onChange: (e: Moment) => {
        console.log(e);
      },
    },
    {
      key: '6',
      type: 'date',
      label: '实际发布时间',
      dataIndex: 'deployTime',
      width: '144px',
      placeholder: '请选择日期',
      rules: [],
      onChange: (e: Moment) => {
        console.log(e);
      },
    },
  ] as FormProps[];
};

export const createTableColumns = (params: {
  onDelete: (id: string) => void;
  categoryData: any[];
  businessData: any[];
  envsUrlList: any[];
}) => {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70,
      render: (text) => <Link to={`./function/checkFunction?id=${text}`}>{text}</Link>,
    },
    {
      title: '发布功能',
      dataIndex: 'funcName',
      key: 'funcName',
      width: 200,
      // width: '6%',
      // render: (text) => (
      //   <div style={{ width: 100, wordWrap: 'break-word', wordBreak: 'break-word' }}>
      //     {text}
      //   </div>
      // ),
    },
    {
      title: '发布状态',
      dataIndex: 'deployStatus',
      key: 'deployStatus',
      // width: '3%',
      render: (text) => <Tag color={statusType[text]?.color}>{statusType[text]?.text}</Tag>,
    },
    {
      title: '应用分类',
      dataIndex: 'appCategoryCode',
      key: 'appCategoryCode',
      // width: '5%',
      render: (text) => params.categoryData?.find((v) => v.categoryCode === text)?.categoryName || '',
    },
    {
      title: '应用组',
      dataIndex: 'appGroupCode',
      key: 'appGroupCode',
      // width: '5%',
      render: (text) => params.businessData?.find((v) => v.groupCode === text)?.groupName || '',
    },
    {
      title: '发布环境',
      dataIndex: 'envs',
      key: 'envs',
      width: 160,
      render: (text) => getEnvName(params.envsUrlList, text) || '',
    },
    {
      title: '涉及业务范围',
      dataIndex: 'coverageRange',
      key: 'coverageRange',
      // width: '8%',
      // render: (text) => (
      //   <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
      //     {text}
      //   </div>
      // ),
    },
    {
      title: '解决的实际需求',
      dataIndex: 'resolveNeeds',
      key: 'resolveNeeds',
      width: 150,
      // width: '9%',
      // render: (text) => (
      //   <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
      //     {text}
      //   </div>
      // ),
    },
    {
      title: '计划发布时间',
      dataIndex: 'preDeployTime',
      key: 'preDeployTime',
      width: 160,
      render: datetimeCellRender,
    },
    {
      title: '需求ID',
      dataIndex: 'demandId',
      key: 'demandId',
      // width: '5%',
    },
    {
      title: '实际发布时间',
      dataIndex: 'deployTime',
      key: 'deployTime',
      width: 160,
      render: datetimeCellRender,
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
      width: 160,
      render: datetimeCellRender,
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      fixed: 'right',
      // width: 100,
      width: '6%',
      render: (_: string, record: IFuncItem) => (
        <Space>
          <Link to={`./function/editFunction?id=${record.id}`}>编辑</Link>
          <Popconfirm title="确认删除?" onConfirm={() => params?.onDelete(record?.funcId!)}>
            <a style={{ color: 'rgb(255, 48, 3)' }}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ] as ColumnsType<IFuncItem>;
};
