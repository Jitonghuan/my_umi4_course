import React, { useState, useEffect } from 'react';
import { Button, Space, Popconfirm, Tag } from 'antd';
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
  type?: string;
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

type changeTypeItem = {
  path: string;
  text: string;
};

const changeType: Record<string, changeTypeItem> = {
  func: { path: 'editFunction', text: '功能' },
  config: { path: 'editConfigModify', text: '配置' },
  datebase: { path: 'editDatabasenModify', text: '数据库' },
};

const FunctionCom: React.FC = () => {
  const [dataSource, setDataSource] = useState<Item[]>([]);

  const columns: ColumnsType<Item> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      render: (text, record) => (
        <Link
          to={
            record?.type
              ? `${ds.pagePrefix}/release/${
                  changeType[record?.type]?.path
                }?id=${text}`
              : ''
          }
        >
          {text}
        </Link>
      ),
    },
    {
      title: '变更类型',
      dataIndex: 'type',
      key: 'type',
      width: 80,
      render: (text) => <Tag color="geekblue">{changeType[text]?.text}</Tag>,
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
      title: '应用CODE',
      dataIndex: 'code',
      key: 'code',
      width: 100,
    },
    {
      title: '应用类型',
      dataIndex: 'useType',
      key: 'useType',
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
    },
    {
      title: '版本号',
      dataIndex: 'version',
      key: 'version',
      width: 80,
    },
    {
      title: '版本分支',
      dataIndex: 'branch',
      key: 'branch',
      width: 80,
    },
    {
      title: '发布依赖',
      dataIndex: 'modules',
      key: 'modules',
      width: 80,
    },
    {
      title: '开发',
      dataIndex: 'develop',
      key: 'develop',
      width: 80,
    },
    {
      title: '测试',
      dataIndex: 'test',
      key: 'test',
      width: 80,
    },
    {
      title: '发布人',
      dataIndex: 'publisher',
      key: 'publisher',
      width: 80,
    },
    {
      title: '计划发布时间',
      dataIndex: 'planTime',
      key: 'planTime',
      width: 110,
    },
    {
      title: '创建人',
      dataIndex: 'person',
      key: 'person',
      width: 80,
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      fixed: 'right',
      width: 100,
      render: (_: string, record) => (
        //根据不同类型跳转
        <Space>
          <Link
            to={
              record?.type
                ? `${ds.pagePrefix}/release/${
                    changeType[record?.type]?.path
                  }?id=${record.id}`
                : ''
            }
          >
            编辑
          </Link>
          <Popconfirm
            title="确认删除?"
            // onConfirm={() => onDelete(record.key)}
          >
            <a style={{ color: 'rgb(255, 48, 3)' }}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const formOptions: FormProps[] = [
    {
      key: '1',
      type: 'select',
      label: '变更类型',
      dataIndex: 'type',
      width: '144px',
      placeholder: '请选择',
      option: [
        {
          key: '0',
          value: '功能变更',
        },
        {
          key: '1',
          value: '配置变更',
        },
        {
          key: '2',
          value: '数据库变更',
        },
      ],
      onChange: (e: React.FormEvent<HTMLInputElement>) => {
        console.log(e);
      },
    },
    {
      key: '2',
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
      key: '3',
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
      key: '4',
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
      type: 'input',
      label: '应用CODE',
      dataIndex: 'code',
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
      type: 'input',
      label: '发布人',
      dataIndex: 'publisher',
      width: '144px',
      placeholder: '支持模糊搜索',
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
        type: 'func',
        status: 0,
        owner: '撒谎的艰苦撒旦',
        line: '撒谎的艰苦撒旦',
        model: '撒谎的艰苦撒旦',
        org: '撒谎的艰苦撒旦',
        range: '撒谎的艰苦撒旦',
        needs: '撒谎的艰苦撒旦',
        needsID: '撒谎的艰苦撒旦',
        person: '撒谎的艰苦撒旦',
        planTime: moment(new Date()).format('YYYY-MM-DD HH-mm'),
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
          <Space>
            <Button
              type="primary"
              ghost
              onClick={() => {
                history.push(`${ds.pagePrefix}/release/addFunctionModify`);
              }}
            >
              新增功能变更
            </Button>
            <Button
              type="primary"
              ghost
              onClick={() => {
                history.push(`${ds.pagePrefix}/release/addConfigModify`);
              }}
            >
              新增配置变更
            </Button>
            <Button
              type="primary"
              ghost
              onClick={() => {
                history.push(`${ds.pagePrefix}/release/addDatabaseModify`);
              }}
            >
              新增数据库变更
            </Button>
          </Space>
        }
        className="table-form"
        onSearch={onSearch}
        scroll={{ x: 'max-content', y: 300 }}
        searchText="查询"
      />
    </MatrixPageContent>
  );
};

export default FunctionCom;
