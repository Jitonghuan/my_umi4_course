import React, { useContext, useState, useEffect } from 'react';
import { Button, Tag, Tooltip, Form } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { PlusOutlined } from '@ant-design/icons';
import { Link, history } from 'umi';
import moment from 'moment';
import FELayout from '@cffe/vc-layout';
import useTable from '@/utils/useTable';
import TableSearch from '@/components/table-search';
import { FormProps } from '@/components/table-search/typing';
import MatrixPageContent from '@/components/matrix-page-content';
import { Item } from '../typing';
import { queryDataFactoryList } from '../service';

import './index.less';
import { create } from '_@types_lodash@4.14.168@@types/lodash';

type statusTypeItem = {
  color: string;
  text: string;
};

const STATUS_TYPE: Record<number, statusTypeItem> = {
  0: { text: '创建中', color: 'blue' },
  1: { text: '失败', color: 'volcano' },
  2: { text: '成功', color: 'green' },
};

const DataFactory: React.FC = () => {
  const userInfo = useContext(FELayout.SSOUserInfoContext);
  const [form] = Form.useForm();

  const {
    tableProps,
    search: { submit: queryList, reset },
  } = useTable({
    // url: queryDataFactoryList,
    url: 'http://turing.cfuture.shop:8010/v1/qc/dataFactory/queryData',
    //http://turing.cfuture.shop:8010/
    method: 'GET',
    form,
    formatter: (record) => {
      console.log(record, 'record');
      console.log(userInfo, 'userInfo');
      console.log(
        moment(record?.createTime)?.format('YYYY-MM-DD HH:mm:ss'),
        '222',
      );
      return {
        ...record,
        createTime: record.createTime
          ? moment(record?.createTime)?.format('YYYY-MM-DD HH:mm:ss')
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
      // render: (text) => (
      //   <Link to={`./function/checkFunction?id=${text}`}>{text}</Link>
      // ),
    },
    {
      title: '数据明细',
      dataIndex: 'detail',
      key: 'detail',
      // width: '6%',
      render: (text) => (
        <Tooltip title={text}>
          <span
            style={{
              display: 'inline-block',
              width: 100,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
          >
            {text}
          </span>
        </Tooltip>
      ),
    },
    {
      title: '数据工厂名称',
      dataIndex: 'name',
      key: 'name',
      // width: '3%',
    },
    {
      title: '环境',
      dataIndex: 'env',
      key: 'env',
      // width: '5%',
      // render: (text) => (
      //   <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
      //     {text}
      //   </div>
      // ),
    },
    {
      title: '所属',
      dataIndex: 'belong',
      key: 'belong',
      // width: '5%',
      // render: (text) => (
      //   <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
      //     {text}
      //   </div>
      // ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      // width: '6%',
    },
    {
      title: '创建人',
      dataIndex: 'user',
      key: 'user',
      // width: '4%',
    },
    {
      title: '创建参数',
      dataIndex: 'createParams',
      key: 'createParams',
      // width: '4%',
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
      dataIndex: 'log',
      key: 'log',
      // width: '4%',
      // render: (text: number) => (
      //   <Tag color={STATUS_TYPE[text].color}>{STATUS_TYPE[text].text}</Tag>
      // ),
    },
  ];

  const formOptions: FormProps[] = [
    {
      key: '1',
      type: 'select',
      label: '所属',
      dataIndex: 'belong',
      width: '144px',
      placeholder: '请输入',
      option: [],
      rules: [],
      onChange: (e: React.FormEvent<HTMLInputElement>) => {
        console.log(e);
      },
    },
    {
      key: '2',
      type: 'select',
      label: '数据工厂名称',
      dataIndex: 'factoryName',
      width: '144px',
      placeholder: '请选择',
      option: [],
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
      option: [
        {
          key: 1,
          value: '1',
        },
        {
          key: 2,
          value: '2',
        },
        {
          key: 3,
          value: '3',
        },
      ],
      rules: [],
      onChange: (e: string) => {
        console.log(e);
      },
    },
    {
      key: '4',
      type: 'date',
      label: '创建时间',
      dataIndex: 'createTime',
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
      dataIndex: 'user',
      width: '144px',
      placeholder: '请选择',
      rules: [],
      checkboxOption: [
        {
          label: '我的数据',
          value: userInfo?.userName as string,
        },
      ],
      onChange: (e: string) => {
        console.log(e);
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
        scroll={{ y: 300, scrollToFirstRowOnChange: true }}
      />
    </MatrixPageContent>
  );
};

export default DataFactory;
