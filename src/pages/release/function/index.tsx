import React, { useState, useEffect } from 'react';
import { Button, Space, Tag } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import moment, { Moment } from 'moment';
import { Link, history } from 'umi';
import TableSearch from '@/components/table-search';
import { FormProps } from '@/components/table-search/typing';
import MatrixPageContent from '@/components/matrix-page-content';
import ds from '@config/defaultSettings';
import { statusType } from '../constant';
import './index.less';

interface Item {
  id?: string;
  function?: string;
  status?: number;
  owner?: string;
  line?: string;
  model?: string;
  org?: string;
  range?: string;
  needs?: string;
  planTime?: string;
  needsID?: string;
  actualTime?: string;
  person?: string;
  createTime?: string;
}

const FunctionCom: React.FC = () => {
  const [dataSource, setDataSource] = useState<Item[]>([]);

  const columns: ColumnsType<Item> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      render: (text) => (
        <Link to={`${ds.pagePrefix}/release/editFunction?id=${text}`}>
          {text}
        </Link>
      ),
    },
    {
      title: '发布功能',
      dataIndex: 'function',
      key: 'function',
      width: 100,
    },
    {
      title: '发布状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (text) => (
        <Tag color={statusType[text]?.color}>{statusType[text]?.text}</Tag>
      ),
    },
    {
      title: '所属',
      dataIndex: 'owner',
      key: 'owner',
      width: 80,
    },
    {
      title: '业务线',
      dataIndex: 'line',
      key: 'line',
      width: 80,
    },
    {
      title: '业务模块',
      dataIndex: 'model',
      key: 'model',
      width: 80,
    },
    {
      title: '机构',
      dataIndex: 'org',
      key: 'org',
      width: 80,
    },
    {
      title: '涉及业务范围',
      dataIndex: 'range',
      key: 'range',
      // width: 110,
      render: (text) => (
        <span style={{ display: 'inline-block', width: 120 }}>{text}</span>
      ),
    },
    {
      title: '解决的实际需求',
      dataIndex: 'needs',
      key: 'needs',
      // width: 120,
      render: (text) => (
        <span style={{ display: 'inline-block', width: 120 }}>{text}</span>
      ),
    },
    {
      title: '计划发布时间',
      dataIndex: 'planTime',
      key: 'planTime',
      // width: 110,
      render: (text) => (
        <span style={{ display: 'inline-block', width: 120 }}>{text}</span>
      ),
    },
    {
      title: '需求ID',
      dataIndex: 'needsID',
      key: 'needsID',
      // width: 80,
      render: (text) => (
        <span style={{ display: 'inline-block', width: 120 }}>{text}</span>
      ),
    },
    {
      title: '实际发布时间',
      dataIndex: 'actualTime',
      key: 'actualTime',
      // width: 110,
      render: (text) => (
        <span style={{ display: 'inline-block', width: 120 }}>{text}</span>
      ),
    },
    {
      title: '创建人',
      dataIndex: 'person',
      key: 'person',
      // width: 80,
      render: (text) => (
        <span style={{ display: 'inline-block', width: 120 }}>{text}</span>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      // width: 100,
      render: (text) => (
        <span style={{ display: 'inline-block', width: 120 }}>{text}</span>
      ),
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      fixed: 'right',
      width: 80,
      render: (_: string, record: Item) => (
        <Space>
          <Link to={`${ds.pagePrefix}/release/editFunction?id=${record.id}`}>
            编辑
          </Link>
          <a style={{ color: 'rgb(255, 48, 3)' }}>删除</a>
        </Space>
      ),
    },
  ];

  const formOptions: FormProps[] = [
    {
      key: '1',
      type: 'select',
      label: '发布状态',
      dataIndex: 'status',
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
      label: '所属',
      dataIndex: 'owner',
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
      label: '业务线',
      dataIndex: 'line',
      width: '144px',
      placeholder: '请选择',
      option: [],
      onChange: (e: string) => {
        console.log(e);
      },
    },
    {
      key: '4',
      type: 'select',
      label: '业务模块',
      dataIndex: 'model',
      width: '144px',
      placeholder: '请先选择业务线',
      option: [],
      onChange: (e: string) => {
        console.log(e);
      },
    },
    {
      key: '4',
      type: 'input',
      label: '功能名称',
      dataIndex: 'name',
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
      dataIndex: 'planTime',
      width: '144px',
      placeholder: '请选择日期',
      onChange: (e: Moment) => {
        console.log(e);
      },
    },
    {
      key: '6',
      type: 'date',
      label: '实际发布时间',
      dataIndex: 'actualTime',
      width: '144px',
      placeholder: '请选择日期',
      onChange: (e: Moment) => {
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
        id: `${i + 1}`,
        status: 0,
        function: '啊卡仕达卡仕达卡仕达看看撒旦阿三的',
        owner: '撒谎的艰苦撒旦',
        line: '撒谎的艰苦撒旦',
        model: '撒谎的艰苦撒旦',
        org: '撒谎的艰苦撒旦',
        range: '撒谎的艰苦撒旦',
        needs: '撒谎的艰苦撒旦',
        planTime: moment(new Date()).format('YYYY-MM-DD HH-mm'),
        needsID: '撒谎的艰苦撒旦',
        actualTime: moment(new Date()).format('YYYY-MM-DD HH-mm'),
        person: '撒谎的艰苦撒旦',
        createTime: moment(new Date()).format('YYYY-MM-DD HH-mm'),
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
              history.push(`${ds.pagePrefix}/release/addFunction`);
            }}
          >
            新增发布功能
          </Button>
        }
        className="table-form"
        onSearch={onSearch}
        scroll={{ x: 'max-content', y: 300, scrollToFirstRowOnChange: true }}
      />
    </MatrixPageContent>
  );
};

export default FunctionCom;
