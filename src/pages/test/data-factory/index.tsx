import React, { useContext, useState, useEffect } from 'react';
import { Button, Tag, Tooltip, Form } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { PlusOutlined } from '@ant-design/icons';
import { Link, history } from 'umi';
import moment from 'moment';
import FELayout from '@cffe/vc-layout';
import FEContext from '@/layouts/basic-layout/FeContext';
import useTable from '@/utils/useTable';
import TableSearch from '@/components/table-search';
import { FormProps } from '@/components/table-search/typing';
import MatrixPageContent from '@/components/matrix-page-content';
import usePublicData from '@/utils/usePublicData';
import { Item } from '../typing';
import { queryDataFactoryList } from '../service';

import './index.less';

type statusTypeItem = {
  color: string;
  text: string;
};

const STATUS_TYPE: Record<number, statusTypeItem> = {
  0: { text: '创建中', color: 'blue' },
  2: { text: '失败', color: 'volcano' },
  1: { text: '成功', color: 'green' },
};

const DataFactory: React.FC = () => {
  const userInfo = useContext(FELayout.SSOUserInfoContext);
  const { categoryData = [] } = useContext(FEContext);
  const [form] = Form.useForm();

  const { envListType, appTypeData } = usePublicData({
    isUseAppEnv: false,
    isUseAppBranch: false,
    isUseAppLists: false,
    isEnvType: true,
  });

  const {
    tableProps,
    search: { submit: queryList, reset },
  } = useTable({
    url: queryDataFactoryList,
    method: 'GET',
    form,
    formatter: (record) => {
      return {
        ...record,
        gmtCreate: record.gmtCreate
          ? moment(record?.gmtCreate)?.format('YYYY-MM-DD HH:mm:ss')
          : undefined,
      };
    },
  });

  const columns: ColumnsType<Item> = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      width: 70,
    },
    {
      title: '数据明细',
      dataIndex: 'response',
      key: 'response',
      // width: '6%',
      render: (text) => {
        if (
          !text ||
          (typeof text === 'object' && Object.keys(text).length === 0)
        )
          return '-';
        return (
          <Tooltip title={JSON.stringify(text)}>
            <span
              style={{
                display: 'inline-block',
                width: 100,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            >
              {JSON.stringify(text)}
            </span>
          </Tooltip>
        );
      },
    },
    {
      title: '数据工厂名称',
      dataIndex: 'factoryName',
      key: 'factoryName',
      // width: '3%',
    },
    {
      title: '环境',
      dataIndex: 'env',
      key: 'env',
    },
    {
      title: '项目',
      dataIndex: 'project',
      key: 'project',
      render: (value) => {
        const result = categoryData?.filter((el) => el.value === value);
        return result?.length ? result[0].label : value || '';
      },
    },
    {
      title: '创建时间',
      dataIndex: 'gmtCreate',
      key: 'gmtCreate',
      width: '12%',
    },
    {
      title: '创建人',
      dataIndex: 'createUser',
      key: 'createUser',
      // width: '4%',
    },
    {
      title: '创建参数',
      dataIndex: 'params',
      key: 'params',
      // width: '4%',
      render: (text) => {
        if (
          !text ||
          (typeof text === 'object' && Object.keys(text).length === 0)
        )
          return '-';
        return (
          <Tooltip title={JSON.stringify(text)}>
            <span
              style={{
                display: 'inline-block',
                width: 100,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            >
              {JSON.stringify(text)}
            </span>
          </Tooltip>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      // width: '4%',
      render: (text: number) => (
        <Tag color={STATUS_TYPE[text].color}>{STATUS_TYPE[text].text}</Tag>
      ),
    },
    {
      title: '日志',
      dataIndex: 'errorLog',
      key: 'errorLog',
    },
  ];

  const formOptions: FormProps[] = [
    {
      key: '1',
      type: 'select',
      label: '项目',
      dataIndex: 'project',
      width: '144px',
      placeholder: '请输入',
      option: appTypeData,
      rules: [],
    },
    {
      key: '2',
      type: 'input',
      label: '数据工厂名称',
      dataIndex: 'factoryName',
      width: '144px',
      rules: [],
      onChange: (e: string) => {
        console.log(e);
      },
    },
    {
      key: '3',
      type: 'select',
      label: '创建环境',
      dataIndex: 'env',
      width: '144px',
      placeholder: '请选择',
      option: envListType,
      rules: [],
      onChange: (e: string) => {
        console.log(e);
      },
    },
    {
      key: '4',
      type: 'date',
      label: '创建时间',
      dataIndex: 'gmtCreate',
      width: '144px',
      placeholder: '请选择',
      rules: [],
      onChange: (e: string) => {
        console.log(e);
      },
    },
    {
      key: '5',
      type: 'checkbox',
      // label: '创建时间',
      dataIndex: 'createUser',
      width: '144px',
      placeholder: '请选择',
      rules: [],
      checkboxOption: [
        {
          label: '我的数据',
          value: userInfo?.userName as string,
        },
      ],
      onChange: () => {
        queryList();
      },
    },
  ];

  return (
    <MatrixPageContent>
      <TableSearch
        form={form}
        formOptions={formOptions}
        formLayout="inline"
        columns={columns}
        {...tableProps}
        pagination={{
          ...tableProps.pagination,
          showTotal: (total) => `共 ${total} 条`,
          showSizeChanger: true,
          size: 'small',
          defaultPageSize: 20,
        }}
        extraNode={
          <Button
            type="primary"
            onClick={() => {
              history.push('./dataFactory/dataFactory-add');
            }}
            icon={<PlusOutlined />}
          >
            新增数据
          </Button>
        }
        showTableTitle
        searchText="查询"
        tableTitle="数据生成记录"
        className="table-form"
        onSearch={queryList}
        reset={reset}
        // scroll={{ y: 300, scrollToFirstRowOnChange: true }}
      />
    </MatrixPageContent>
  );
};

export default DataFactory;
