import React, { useState, useEffect } from 'react';
import { Button, Space, Popconfirm, Table, Tooltip } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { PlusOutlined } from '@ant-design/icons';
import { Link, history } from 'umi';
import TableSearch from '@/components/table-search';
import { FormProps } from '@/components/table-search/typing';
import MatrixPageContent from '@/components/matrix-page-content';
import { Item } from '../typing';
import './index.less';

const PrometheusCom: React.FC = () => {
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
      title: '监控名称',
      dataIndex: 'monitorName',
      key: 'monitorName',
    },
    {
      title: '应用名称',
      dataIndex: 'applyName',
      key: 'applyName',
    },
    {
      title: '环境名称',
      dataIndex: 'environmentName',
      key: 'environmentName',
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
    },
    {
      title: 'Matchlabels',
      dataIndex: 'matchlabels',
      key: 'matchlabels',
    },
    {
      title: '报警规则',
      dataIndex: 'alarmRules',
      key: 'alarmRules',
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      width: 100,
      render: (_: string, record: Item) => (
        <Space>
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

  const expandedRowRender = (expandData: Item[]) => {
    const expandColumns = [
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
        title: '告警表达式',
        dataIndex: 'expression',
        key: 'expression',
        // width: '5%',
        // ellipsis: true,
        render: (text: string) => (
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
    ];

    return (
      <Table
        dataSource={[...expandData]}
        columns={expandColumns}
        pagination={false}
        // rowKey={record => record.key}
      />
    );
  };

  const formOptions: FormProps[] = [
    {
      key: '1',
      type: 'input',
      label: '监控名称',
      dataIndex: 'monitorName',
      width: '144px',
      placeholder: '请输入',
      onChange: (e: React.FormEvent<HTMLInputElement>) => {
        console.log(e);
      },
    },
    {
      key: '2',
      type: 'select',
      label: '应用名称',
      dataIndex: 'applyName',
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
      label: '环境名称',
      dataIndex: 'environmentName',
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
      label: 'URL',
      dataIndex: 'url',
      width: '144px',
      placeholder: '请输入',
      onChange: (e: string) => {
        console.log(e);
      },
    },
    {
      key: '5',
      type: 'input',
      label: 'Matchlabels',
      dataIndex: 'matchlabels',
      width: '144px',
      placeholder: '请输入',
      onChange: (e: React.FormEvent<HTMLInputElement>) => {
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
        monitorName: '爱睡觉的',
        applyName: '哈哈哈',
        environmentName: '说的都是',
        url: 'http://127.0.0.1:8080/index',
        matchlabels: 'sssss',
        alarmRules: 'yessad',
        expandData: [
          {
            key: '12313',
            ruleName: 'wwwww',
            expression: 'sajdhjashdkasdhsakjdasdasd',
            news: '静安寺大家ask',
          },
        ],
      };
    });
    console.log(arr);
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
        tableTitle="Prometheus监控列表"
        extraNode={
          <Button
            type="primary"
            onClick={() => {
              // history.push(`${ds.pagePrefix}/release/function/addFunction`);
              history.push('./prometheus/prometheus-add');
            }}
            icon={<PlusOutlined />}
          >
            接入Prometheus
          </Button>
        }
        // className="table-form"
        onSearch={onSearch}
        scroll={{ x: 'max-content' }}
        expandable={{
          expandedRowRender: (record) => expandedRowRender(record.expandData),
        }}
        rowKey="id"
        className="expand-table"
      />
    </MatrixPageContent>
  );
};

export default PrometheusCom;
