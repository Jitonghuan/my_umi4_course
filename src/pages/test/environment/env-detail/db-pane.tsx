// 数据库配置
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/29 20:52

import React from 'react';
import { EditableProTable, ProColumns } from '@ant-design/pro-table';
import { EnvDbConfItemVO } from '../interfaces';

export interface DBPanelProps {
  value: EnvDbConfItemVO[];
  onChange: (next: EnvDbConfItemVO[]) => any;
}

export default function DBPanel(props: DBPanelProps) {
  const { value, onChange } = props;

  // 数据库配置表格表单列
  const columns: ProColumns<EnvDbConfItemVO>[] = [
    {
      title: 'host',
      dataIndex: 'host',
      formItemProps: { rules: [{ required: true, message: '请输入host' }] },
    },
    {
      title: 'user',
      dataIndex: 'user',
      formItemProps: { rules: [{ required: true, message: '请输入user' }] },
    },
    {
      title: 'pwd',
      dataIndex: 'pwd',
    },
    {
      title: '操作',
      valueType: 'option',
      width: 160,
      render: (text, record, index, action) => [
        <a key="editable" onClick={() => action?.startEditable(index)}>
          编辑
        </a>,
        <a
          key="delete"
          onClick={() => onChange(value.filter((_, i) => i !== index))}
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
      recordCreatorProps={{
        creatorButtonText: '新增',
        record: {},
      }}
    />
  );
}
