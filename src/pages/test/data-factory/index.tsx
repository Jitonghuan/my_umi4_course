import React, { useState, useEffect } from 'react';
import { Button, Tag, Tooltip } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { PlusOutlined } from '@ant-design/icons';
import { Link, history } from 'umi';
import TableSearch from '@/components/table-search';
import { FormProps } from '@/components/table-search/typing';
import MatrixPageContent from '@/components/matrix-page-content';
import { Item } from '../typing';

import './index.less';

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
  const [dataSource, setDataSource] = useState<Item[]>([]);

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
      dataIndex: 'factoryName',
      key: 'factoryName',
      // width: '3%',
    },
    {
      title: '环境',
      dataIndex: 'environment',
      key: 'environment',
      // width: '5%',
      // render: (text) => (
      //   <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
      //     {text}
      //   </div>
      // ),
    },
    {
      title: '所属',
      dataIndex: 'own',
      key: 'own',
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
      dataIndex: 'creator',
      key: 'creator',
      // width: '4%',
    },
    {
      title: '创建参数',
      dataIndex: 'params',
      key: 'params',
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
      dataIndex: 'own',
      width: '144px',
      placeholder: '请输入',
      option: [],
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
      onChange: (e: string) => {
        console.log(e);
      },
    },
    {
      key: '3',
      type: 'select',
      label: '创建环境',
      dataIndex: 'environment',
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
      onChange: (e: string) => {
        console.log(e);
      },
    },
    {
      key: '5',
      type: 'checkbox',
      // label: '创建时间',
      dataIndex: 'myData',
      width: '144px',
      placeholder: '请选择',
      rules: [],
      checkboxOption: [
        {
          label: '我的数据',
          value: 'myData',
        },
      ],
      onChange: (e: string) => {
        console.log(e);
      },
    },
  ];

  const onSearch = (value: Record<string, any>) => {
    console.log(value, '8888');
  };

  useEffect(() => {
    const arr: Item[] = new Array(20).fill(1).map((_, i) => {
      return {
        id: `${i + 10000}`,
        applyName: '顶顶顶顶',
        environmentName: '啊卡仕达卡仕',
        alertName: '撒谎的',
        alertRank: '3',
        createTime: '2012-01-01 00:00',
        eventNum: '3',
        notifyObject: '哈哈哈',
        status: i % 3 === 0 ? 2 : i % 3 === 2 ? 1 : 0,
      };
    });

    setDataSource(arr);
  }, []);

  return (
    <MatrixPageContent>
      <TableSearch
        formOptions={formOptions}
        formLayout="inline"
        columns={columns}
        dataSource={dataSource}
        pagination={{
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
        onSearch={onSearch}
        scroll={{ y: 300, scrollToFirstRowOnChange: true }}
      />
    </MatrixPageContent>
  );
};

export default DataFactory;
