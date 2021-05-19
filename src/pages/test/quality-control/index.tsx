import React, { useState, useEffect } from 'react';
import { Button, Tag, Tooltip, Space, message } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { PlusOutlined } from '@ant-design/icons';
import { Link, history } from 'umi';
import TableSearch from '@/components/table-search';
import { FormProps } from '@/components/table-search/typing';
import MatrixPageContent from '@/components/matrix-page-content';
import { Item } from '../typing';
import TestDrawer from './testDrawer-add';

import './index.less';

type statusTypeItem = {
  color: string;
  text: string;
  disable: boolean;
};

const STATUS_TYPE: Record<number, statusTypeItem> = {
  1: { text: '作废', color: 'default', disable: true },
  0: { text: '正常', color: 'green', disable: false },
};

const DataFactory: React.FC = () => {
  const [dataSource, setDataSource] = useState<Item[]>([]);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const onConfirm = () => {
    message.warning('当前有进行中的检测任务，请稍后再试');
  };

  const columns: ColumnsType<Item> = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      width: '5%',
      // render: (text) => (
      //   <Link to={`./function/checkFunction?id=${text}`}>{text}</Link>
      // ),
    },
    {
      title: '任务名',
      dataIndex: 'name',
      key: 'name',
      width: '10%',
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
      title: '应用分类',
      dataIndex: 'categoryName',
      key: 'categoryName',
      width: '10%',
    },
    {
      title: '应用名',
      dataIndex: 'appName',
      key: 'appName',
      width: '10%',
      // render: (text) => (
      //   <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
      //     {text}
      //   </div>
      // ),
    },
    {
      title: '分支名',
      dataIndex: 'branchName',
      key: 'branchName',
      width: '10%',
      // render: (text) => (
      //   <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
      //     {text}
      //   </div>
      // ),
    },
    {
      title: '创建时间',
      dataIndex: 'gmtCreate',
      key: 'gmtCreate',
      // ellipsis: true,
      width: '15%',
      render: (text) => (
        <Tooltip title={text}>
          {text}
          {/* <span
            style={{
              display: 'inline-block',
              width: 100,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
          >
            {text}
          </span> */}
        </Tooltip>
      ),
    },
    {
      title: '上一次检测时间',
      dataIndex: 'lastCheckTime',
      key: 'lastCheckTime',
      // ellipsis: true,
      width: '15%',
      render: (text) => (
        <Tooltip title={text}>
          {text}
          {/* <span
            style={{
              display: 'inline-block',
              width: 100,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
          >
            {text}
          </span> */}
        </Tooltip>
      ),
    },
    {
      title: '检测次数',
      dataIndex: 'checkNum',
      key: 'checkNum',
      width: '10%',
    },
    {
      title: '成功次数',
      dataIndex: 'checkSuccessNum',
      key: 'checkSuccessNum',
      width: '10%',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: '8%',
      render: (text: number) => (
        <Tag color={STATUS_TYPE[text].color}>{STATUS_TYPE[text].text}</Tag>
      ),
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      width: '12%',
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            disabled={STATUS_TYPE[record.status as number].disable}
            style={{ padding: 0 }}
            onClick={onConfirm}
          >
            执行
          </Button>
          <Button
            type="link"
            style={{ padding: 0 }}
            onClick={() => {
              history.push(`./qualityControl/unitTest?id=${record.id}`);
            }}
          >
            单测记录
          </Button>
          <Button
            type="link"
            style={{ padding: 0 }}
            onClick={() => {
              history.push(`./qualityControl/codeQuality?id=${record.id}`);
            }}
          >
            质检记录
          </Button>
        </Space>
      ),
    },
  ];

  const formOptions: FormProps[] = [
    {
      key: '1',
      type: 'select',
      label: '应用分类',
      dataIndex: 'categoryName',
      width: '144px',
      option: [],
      onChange: (e: React.FormEvent<HTMLInputElement>) => {
        console.log(e);
      },
    },
    {
      key: '2',
      type: 'select',
      label: '应用名',
      dataIndex: 'appName',
      width: '144px',
      option: [],
      onChange: (e: string) => {
        console.log(e);
      },
    },
    {
      key: '3',
      type: 'input',
      label: '分支名',
      dataIndex: 'branchName',
      width: '144px',
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
      type: 'select',
      label: '状态',
      dataIndex: 'status',
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
      key: '5',
      type: 'date',
      label: '创建时间',
      dataIndex: 'gmtCreate',
      width: '144px',
      rules: [],
      onChange: (e: string) => {
        console.log(e);
      },
    },
  ];

  const onSearch = (value: Record<string, any>) => {
    console.log(value, '8888');
  };

  const onClose = () => {
    setDrawerVisible(false);
  };

  useEffect(() => {
    const arr: Item[] = new Array(20).fill(1).map((_, i) => {
      return {
        id: `${i + 10000}`,
        categoryName: '顶顶顶顶',
        name: '啊卡仕达卡仕',
        appName: '撒谎的',
        branchName: '3-123',
        gmtCreate: '2012-01-01 00:00',
        lastCheckTime: '2012-01-01 00:00',
        checkNum: 2,
        checkSuccessNum: 1,
        status: i % 2 === 0 ? 1 : 0,
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
              setDrawerVisible(true);
            }}
            icon={<PlusOutlined />}
          >
            新增检测任务
          </Button>
        }
        showTableTitle
        searchText="查询"
        tableTitle="数据生成记录"
        className="table-form"
        onSearch={onSearch}
        scroll={{ x: '120%', y: 300, scrollToFirstRowOnChange: true }}
        // scroll={{ y: 300, scrollToFirstRowOnChange: true }}
      />
      <TestDrawer visible={drawerVisible} onClose={onClose} />
    </MatrixPageContent>
  );
};

export default DataFactory;
