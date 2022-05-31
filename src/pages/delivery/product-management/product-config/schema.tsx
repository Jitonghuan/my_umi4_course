import type { ColumnsType } from 'antd/lib/table';
import type { ColumnProps } from '@cffe/vc-hulk-table';
export const compontentsSchema = ({ onEditClick }: { onEditClick: (record: any, index: number) => void }) =>
  [
    {
      title: '参数来源组件',
      dataIndex: 'paramComponent',
      key: 'paramComponent',
    },
    {
      title: '参数名称',
      dataIndex: 'paramName',
    },
    {
      title: '参数值',
      dataIndex: 'paramValue',
    },
    {
      title: '描述',
      dataIndex: 'paramDescription',
    },
    {
      title: '操作',
      align: 'center',
      width: 125,
      dataIndex: 'operate',
      render: (text: string, record: any, index: number) => <a onClick={() => onEditClick(record, index)}>编辑</a>,
    },
  ] as ColumnProps[];

export const configDeliverySchema = ({ onEditClick }: { onEditClick: (record: any, index: number) => void }) =>
  [
    // {
    //   title: '作用组件',
    //   dataIndex: 'configParamComponent',
    //   key: 'configParamComponent',
    // },
    {
      title: '参数名称',
      dataIndex: 'paramName',
      key: 'paramName',
    },

    {
      title: '参数值',
      dataIndex: 'paramValue',
      key: 'paramValue',
    },
    {
      title: '描述',
      dataIndex: 'paramDescription',
      key: 'paramDescription',
    },
    {
      title: '操作',
      align: 'center',
      key: 'action',
      width: 125,
      render: (text: string, record: any, index: number) => <a onClick={() => onEditClick(record, index)}>编辑</a>,
    },
  ] as ColumnProps[];
