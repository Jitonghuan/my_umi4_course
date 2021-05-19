import React, { useState, useEffect } from 'react';
import { Button, Space, Tag, Popconfirm } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { PlusOutlined } from '@ant-design/icons';
import { Link } from 'umi';
import TableSearch from '@/components/table-search';
import { FormProps } from '@/components/table-search/typing';
import MatrixPageContent from '@/components/matrix-page-content';
import TemplateDrawer from '../component/templateDrawer';
import { Item } from '../typing';
import './index.less';

type statusTypeItem = {
  color: string;
  tagText: string;
  buttonText: string;
};

const STATUS_TYPE: Record<number, statusTypeItem> = {
  1: { tagText: '已启用', buttonText: '关闭', color: 'green' },
  0: { tagText: '未启用', buttonText: '启用', color: 'default' },
};

const TemplateCom: React.FC = () => {
  const [dataSource, setDataSource] = useState<Item[]>([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState('新增报警规则模版');
  const [editRecord, setEditRecord] = useState<Item>({});

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
      title: '规则名称',
      dataIndex: 'ruleName',
      key: 'ruleName',
      // width: '6%',
      // render: (text) => (
      //   <div style={{ width: 100, wordWrap: 'break-word', wordBreak: 'break-word' }}>
      //     {text}
      //   </div>
      // ),
    },
    {
      title: '分类',
      dataIndex: 'classify',
      key: 'classify',
      // width: '3%',
    },
    {
      title: '告警表达式',
      dataIndex: 'expression',
      key: 'expression',
      // width: '5%',
      // render: (text) => (
      //   <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
      //     {text}
      //   </div>
      // ),
    },
    {
      title: '告警消息',
      dataIndex: 'news',
      key: 'news',
      // width: '5%',
      // render: (text) => (
      //   <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
      //     {text}
      //   </div>
      // ),
    },
    {
      title: '持续时间',
      dataIndex: 'time',
      key: 'time',
      // width: '6%',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      // width: '4%',
      render: (text: number) => (
        <Tag color={STATUS_TYPE[text].color}>{STATUS_TYPE[text].tagText}</Tag>
      ),
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      width: 120,
      // width: '6%',
      render: (_: string, record: Item) => (
        <Space>
          <a
            onClick={() => {
              setDrawerVisible(true);
              setDrawerTitle('编辑报警规则模版');
              setEditRecord(record);
            }}
          >
            编辑
          </a>
          <Popconfirm
            title="确认删除？"
            // onConfirm={confirm}
            // onCancel={cancel}
            okText="是"
            cancelText="否"
          >
            <a style={{ color: 'rgb(255, 48, 3)' }}>删除</a>
          </Popconfirm>
          <Popconfirm
            title={`确认${STATUS_TYPE[record.status as number].buttonText}`}
            // onConfirm={confirm}
            // onCancel={cancel}
            okText="是"
            cancelText="否"
          >
            <a>{STATUS_TYPE[record.status as number].buttonText}</a>
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
      label: '状态',
      dataIndex: 'status',
      width: '144px',
      placeholder: '请选择',
      option: [
        {
          key: '1',
          value: '已启用',
        },
        {
          key: '0',
          value: '未启用',
        },
      ],
      onChange: (e: string) => {
        console.log(e);
      },
    },
  ];

  const onClose = () => {
    setDrawerVisible(false);
  };

  const onSearch = (value: Record<string, any>) => {
    console.log(value, '8888');
  };

  useEffect(() => {
    const arr: Item[] = new Array(20).fill(1).map((_, i) => {
      return {
        id: `${i + 10000}`,
        status: i % 2 === 0 ? 1 : 0,
        ruleName: '啊卡仕达卡',
        classify: '撒谎的',
        expression: 'sdsadasdd',
        news: '撒谎的艰',
        time: '10min',
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
        tableTitle="报警规则模板列表"
        extraNode={
          <Button
            type="primary"
            onClick={() => {
              setDrawerVisible(true);
            }}
            icon={<PlusOutlined />}
          >
            新增报警规则模版
          </Button>
        }
        className="table-form"
        onSearch={onSearch}
        scroll={{ x: 'max-content' }}
      />
      <TemplateDrawer
        visible={drawerVisible}
        onClose={onClose}
        drawerTitle={drawerTitle}
        record={editRecord}
        drawerType="template"
      />
    </MatrixPageContent>
  );
};

export default TemplateCom;
