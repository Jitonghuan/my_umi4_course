import React, { useState, useEffect } from 'react';
import { Tag, Form, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import TableSearch from '@/components/table-search';
import PageContainer from '@/components/page-container';
import useTable from '@/utils/useTable';
import { queryAlertManageList } from '../service';
import { Item } from '../typing';
import './index.less';

type statusTypeItem = {
  color: string;
  text: string;
};

const STATUS_TYPE: Record<string, statusTypeItem> = {
  refuse: { text: '拒绝处理', color: 'red' },
  firing: { text: '告警中', color: 'blue' },
  resolved: { text: '已修复', color: 'green' },
  terminate: { text: '中断处理', color: 'default' },
};

const ALERT_LEVEL: Record<string, string> = {
  '2': '警告',
  '3': '严重',
  '4': '灾难',
};

const HistoryCom: React.FC = () => {
  const [dataSource, setDataSource] = useState<Item[]>([]);

  const [form] = Form.useForm();

  const {
    tableProps = {},
    search: { submit, reset },
  } = useTable({
    url: queryAlertManageList,
    method: 'GET',
    form,
  });
  const columns: ColumnsType<Item> = [
    {
      title: '序号',
      dataIndex: 'key',
      key: 'key',
      width: 70,
      // render: (text) => (
      //   <Link to={`./function/checkFunction?id=${text}`}>{text}</Link>
      // ),
    },
    {
      title: '应用名称',
      dataIndex: 'appCode',
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
      dataIndex: 'clusterName',
      key: 'envCode',
      // width: '3%',
    },
    {
      title: '命名空间',
      dataIndex: 'namespace',
      key: 'namespace',
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
      title: '实例地址',
      dataIndex: 'instance',
      key: 'instance',
      // width: '5%',
      // render: (text) => (
      //   <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
      //     {text}
      //   </div>
      // ),
    },
    {
      title: '报警级别',
      dataIndex: 'level',
      key: 'level',
      // width: '5%',
      render: (text: string) => ALERT_LEVEL[text] ?? '',
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
      // width: '6%',
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
      // width: '6%',
    },
    {
      title: '通知对象',
      dataIndex: 'receiver',
      key: 'receiver',
      render: (text: string) => {
        if (!text) return '';
        return (
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
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      // width: '4%',
      render: (text: number) => <Tag color={STATUS_TYPE[text]?.color}>{STATUS_TYPE[text]?.text}</Tag>,
    },
  ];

  useEffect(() => {
    setDataSource([]);
  }, []);

  return (
    <PageContainer style={{ padding: 0 }}>
      <TableSearch
        form={form}
        formOptions={[
          {
            key: '1',
            type: 'input',
            label: '报警名称',
            dataIndex: 'alertName',
            width: '154px',
            placeholder: '请输入',
          },
          {
            key: '2',
            type: 'select',
            label: '报警状态',
            dataIndex: 'status',
            width: '154px',
            placeholder: '请选择',
            option: [
              {
                key: 'refuse',
                value: '拒绝处理',
                label: '拒绝处理',
              },
              {
                key: 'firing',
                value: '告警中',
                label: '告警中',
              },
              {
                key: 'terminate',
                value: '中断处理',
                label: '中断处理',
              },
              {
                key: 'resolved',
                value: '已修复',
                label: '已修复',
              },
            ],
          },
          {
            key: '3',
            type: 'select',
            label: '报警级别',
            dataIndex: 'level',
            width: '154px',
            placeholder: '请选择',
            option: [
              {
                key: '2',
                value: '警告',
                label: '警告',
              },
              {
                key: '3',
                value: '严重',
                label: '严重',
              },
              {
                key: '4',
                value: '灾难',
                label: '灾难',
              },
            ],
          },
          {
            key: '4',
            type: 'input',
            label: '应用名称',
            dataIndex: 'appCode',
            width: '154px',
            placeholder: '请输入',
          },
          {
            key: '5',
            type: 'input',
            label: '环境名称',
            dataIndex: 'envCode',
            width: '154px',
            placeholder: '请输入',
          },
        ]}
        formLayout="inline"
        columns={columns}
        {...tableProps}
        dataSource={tableProps?.dataSource?.map((v, i) => ({
          ...v,
          key: i + 1,
        }))}
        pagination={{
          ...tableProps?.pagination,
          showTotal: (total) => `共 ${total} 条`,
          showSizeChanger: true,
          // size: 'small',
          defaultPageSize: 20,
        }}
        showTableTitle={false}
        tableTitle=""
        className="table-form"
        onSearch={submit}
        reset={reset}
        // scroll={{ x: 'max-content' }}
      />
    </PageContainer>
  );
};

export default HistoryCom;
