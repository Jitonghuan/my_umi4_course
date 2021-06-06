// 数据库配置
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/29 20:52

import React from 'react';
import { EnvDbConfItemVO } from '../interfaces';
import TableForm from '@/components/simple-table-form';

export interface DBPanelProps {
  value: EnvDbConfItemVO[];
  onChange: (next: EnvDbConfItemVO[]) => any;
}

export default function DBPanel(props: DBPanelProps) {
  return (
    <TableForm
      value={props.value}
      onChange={props.onChange}
      columns={[
        { title: 'host', dataIndex: 'host', required: true },
        { title: 'user', dataIndex: 'user', required: true },
        { title: 'pwd', dataIndex: 'pwd' },
      ]}
    />
  );
}
