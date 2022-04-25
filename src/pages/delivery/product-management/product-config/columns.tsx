import type { ColumnsType } from 'antd/lib/table';

export const compontentsColums: ColumnsType<any> = [
  {
    title: '参数来源组件',
    dataIndex: 'ranking',
    key: 'ranking',
  },
  {
    title: '作用组件',
    dataIndex: 'calculateCycle',
  },
  {
    title: '参数名称',
    dataIndex: 'envCode',
  },
  {
    title: '描述',
    dataIndex: 'file',
  },
  {
    title: '参数值',
    dataIndex: 'file',
  },
  {
    title: '操作',
    dataIndex: 'operate',
    render: (text: string, record: any) => <span>编辑</span>,
  },
];

export const configDeliverycolums: ColumnsType<any> = [
  {
    title: '组件名称',
    dataIndex: 'componentName',
    key: 'componentName',
  },
  {
    title: '组件描述',
    dataIndex: 'componentDescription',
    key: 'componentDescription',
  },
  {
    title: '创建时间',
    dataIndex: 'gmtCreate',
    key: 'gmtCreate',
  },

  {
    title: '操作',
    key: 'action',
    render: (text: string, record: any) => <span>编辑</span>,
  },
];
