import React, { useState, useEffect } from 'react';
import { Button, Space, Tag, Popconfirm } from 'antd';
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
  0: { text: '待认领', color: 'blue' },
  1: { text: '处理中', color: 'volcano' },
  2: { text: '已解决', color: 'green' },
};

const HistoryCom: React.FC = () => {
  const [dataSource, setDataSource] = useState<Item[]>([]);

  const columns: ColumnsType<Item> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70,
      // render: (text) => (
      //   <Link to={`./function/checkFunction?id=${text}`}>{text}</Link>
      // ),
    },
    {
      title: '应用名称',
      dataIndex: 'applyName',
      key: 'applyName',
      // width: '6%',
      // render: (text) => (
      //   <div style={{ width: 100, wordWrap: 'break-word', wordBreak: 'break-word' }}>
      //     {text}
      //   </div>
      // ),
    },
    {
      title: '环境名称',
      dataIndex: 'environmentName',
      key: 'environmentName',
      // width: '3%',
    },
    {
      title: '报警名称',
      dataIndex: 'alertName',
      key: 'alertName',
      // width: '5%',
      // render: (text) => (
      //   <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
      //     {text}
      //   </div>
      // ),
    },
    {
      title: '报警等级',
      dataIndex: 'alertRank',
      key: 'alertRank',
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
      title: '事件数量',
      dataIndex: 'eventNum',
      key: 'eventNum',
      // width: '4%',
    },
    {
      title: '通知对象',
      dataIndex: 'notifyObject',
      key: 'notifyObject',
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
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      width: 100,
      // width: '6%',
      render: (_: string, record: Item) => (
        <Space>
          {/* <Link to={`${ds.pagePrefix}/release/function/editFunction?id=${record.id}`}> */}
          <Link to={`./function/editFunction?id=${record.id}`}>编辑</Link>
          <Popconfirm
            title="确认删除？"
            // onConfirm={confirm}
            // onCancel={cancel}
            okText="是"
            cancelText="否"
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
      type: 'input',
      label: '名称',
      dataIndex: 'name',
      width: '144px',
      placeholder: '请输入',
      onChange: (e: React.FormEvent<HTMLInputElement>) => {
        console.log(e);
      },
    },
    {
      key: '2',
      type: 'select',
      label: '报警状态',
      dataIndex: 'status',
      width: '144px',
      placeholder: '请选择',
      defaultValue: 'ALL',
      option: [
        {
          key: 'ALL',
          value: '全部',
        },
        {
          key: 0,
          value: '待认领',
        },
        {
          key: 1,
          value: '处理中',
        },
        {
          key: 2,
          value: '已解决',
        },
      ],
      onChange: (e: string) => {
        console.log(e);
      },
    },
    {
      key: '3',
      type: 'select',
      label: '报警等级',
      dataIndex: 'alertRank',
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
        showTableTitle
        tableTitle="报警历史列表"
        className="table-form"
        onSearch={onSearch}
        scroll={{ x: 'max-content' }}
      />
    </MatrixPageContent>
  );
};

export default HistoryCom;
