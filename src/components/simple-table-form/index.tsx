// table form
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/06/04 08:17

import React from 'react';
import { EditableProTable, ProColumns } from '@ant-design/pro-table';
import './index.less';

export interface TableColumnProps {
  dataIndex: string;
  title?: string;
  required?: boolean;
  valueType?: 'text' | 'select' | 'date';
  valueEnum?: Record<string, { text: string; status?: 'Success' | 'Error' | 'Default' }>;
  rules?: Record<string, any>[];
}

export interface TableFormProps<ItemProps> {
  value?: ItemProps[];
  onChange?: (next: ItemProps[]) => any;
  columns: TableColumnProps[];
}

export default function TableForm<ItemProps = Record<string, any>>(props: TableFormProps<ItemProps>) {
  let { value, onChange, columns } = props;

  if (!Array.isArray(value)) {
    console.error('ERORR in TableForm, value is not an array!', value);
    value = [];
  }

  const columnConfig: ProColumns<ItemProps>[] = columns.map((col) => ({
    title: col.title || col.dataIndex,
    dataIndex: col.dataIndex,
    valueType: col.valueType || 'text',
    valueEnum: col.valueEnum,
    formItemProps: {
      rules:
        col.rules || col.required
          ? [
              {
                required: true,
                message: `${col.valueType === 'select' ? '请选择' : '请输入'}${col.title || col.dataIndex}`,
              },
            ]
          : [],
    },
  }));

  columnConfig.push({
    title: '操作',
    valueType: 'option',
    width: 148,
    render: (_, record, index, action) => [
      <a key="editable" onClick={() => action?.startEditable(index)}>
        编辑
      </a>,
      <a key="delete" onClick={() => onChange?.(value?.filter((_, i) => i !== index) || [])}>
        移除
      </a>,
    ],
  });

  return (
    <EditableProTable
      className="vc-table-form"
      columns={columnConfig}
      value={value}
      onChange={onChange}
      bordered
      recordCreatorProps={{
        creatorButtonText: '新增',
        record: {} as ItemProps,
      }}
    />
  );
}
