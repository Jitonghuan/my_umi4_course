// key value desc table form
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/06/04 08:17

import React from 'react';
import { EditableProTable, ProColumns } from '@ant-design/pro-table';
import { KVDItemProps } from '../interfaces';

export interface KVDTableFormProps {
  value?: KVDItemProps[];
  onChange?: (next: KVDItemProps[]) => any;
}

export default function KVDTableForm(props: KVDTableFormProps) {
  let { value, onChange } = props;

  if (!Array.isArray(value)) {
    console.error('ERORR in KVDTableForm, value is not an array!', value);
    value = [];
  }

  const columns: ProColumns<KVDItemProps>[] = [
    {
      title: 'key',
      dataIndex: 'key',
      formItemProps: { rules: [{ required: true, message: '请输入key' }] },
    },
    {
      title: 'value',
      dataIndex: 'value',
      // 默认值可以不填
      // formItemProps: { rules: [{ required: true, message: '请输入value' }] },
    },
    {
      title: '说明',
      dataIndex: 'desc',
    },
    {
      title: '操作',
      valueType: 'option',
      width: 100,
      render: (_, record, index, action) => [
        <a key="editable" onClick={() => action?.startEditable(index)}>
          编辑
        </a>,
        <a
          key="delete"
          onClick={() => onChange?.(value?.filter((_, i) => i !== index) || [])}
        >
          移除
        </a>,
      ],
    },
  ];

  return (
    <EditableProTable
      columns={columns}
      value={value}
      onChange={onChange}
      bordered
      recordCreatorProps={{
        creatorButtonText: '新增',
        record: { key: '', value: '', desc: '' },
      }}
    />
  );
}
