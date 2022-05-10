import type { ColumnsType } from 'antd/lib/table';
import type { ColumnProps } from '@cffe/vc-hulk-table';
export const compontentsSchema = ({ onEditClick }: { onEditClick: (record: any, index: number) => void }) =>
  [
    {
      title: '参数来源组件',
      dataIndex: 'configParamComponent',
      key: 'configParamComponent',
    },
    {
      title: '参数名称',
      dataIndex: 'configParamName',
    },
    {
      title: '参数值',
      dataIndex: 'configParamValue',
    },
    {
      title: '描述',
      dataIndex: 'configParamDescription',
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
      dataIndex: 'configParamName',
      key: 'configParamName',
    },

    {
      title: '参数值',
      dataIndex: 'configParamValue',
      key: 'configParamValue',
    },
    {
      title: '描述',
      dataIndex: 'configParamDescription',
      key: 'configParamDescription',
    },
    {
      title: '操作',
      align: 'center',
      key: 'action',
      width: 125,
      render: (text: string, record: any, index: number) => <a onClick={() => onEditClick(record, index)}>编辑</a>,
    },
  ] as ColumnProps[];
