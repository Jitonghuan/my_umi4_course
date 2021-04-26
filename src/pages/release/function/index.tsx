import React, { useState, useEffect } from 'react';
import { Button, Space } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { Moment } from 'moment';
import { Link, history } from 'umi';
import TableSearch from '@/components/table-search';
import { FormProps } from '@/components/table-search/typing';
import MatrixPageContent from '@/components/matrix-page-content';
import ds from '@config/defaultSettings';
import './index.less';

interface Item {
  id?: string;
  function?: string;
  status?: string;
  owner?: string;
  line?: string;
  model?: string;
  org?: string;
  range?: string;
  needs?: string;
  planTime?: Moment;
  needsID?: string;
  actualTime?: Moment;
  person?: string;
  createTime?: Moment;
}

const FunctionCom: React.FC = () => {
  const [dataSource, setDataSource] = useState<Item[]>([]);

  const columns: ColumnsType<Item> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '发布功能',
      dataIndex: 'function',
      key: 'function',
    },
    {
      title: '发布状态',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '所属',
      dataIndex: 'owner',
      key: 'owner',
    },
    {
      title: '业务线',
      dataIndex: 'line',
      key: 'line',
    },
    {
      title: '业务模块',
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: '机构',
      dataIndex: 'org',
      key: 'org',
    },
    {
      title: '涉及业务范围',
      dataIndex: 'range',
      key: 'range',
    },
    {
      title: '解决的实际需求',
      dataIndex: 'needs',
      key: 'needs',
    },
    {
      title: '计划发布时间',
      dataIndex: 'planTime',
      key: 'planTime',
    },
    {
      title: '需求ID',
      dataIndex: 'needsID',
      key: 'needsID',
    },
    {
      title: '实际发布时间',
      dataIndex: 'actualTime',
      key: 'actualTime',
    },
    {
      title: '创建人',
      dataIndex: 'person',
      key: 'person',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      fixed: 'right',
      width: 100,
      render: (_: string, record: Item) => (
        <Space>
          <Link to={`./add?id=${record.id}`}>编辑</Link>
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
          showTotal: (total) => `Total ${total} items`,
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
        scroll={{ x: 2000, y: 300 }}
      />
    </MatrixPageContent>
  );
};

export default FunctionCom;
