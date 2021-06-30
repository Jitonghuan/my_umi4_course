// 数据库配置
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/29 20:52

import React from 'react';
import { EnvDbConfItemVO } from '../interfaces';
import EditorTable from '@cffe/pc-editor-table';

export interface DBPanelProps {
  value: EnvDbConfItemVO[];
  onChange: (next: EnvDbConfItemVO[]) => any;
}

export default function DBPanel(props: DBPanelProps) {
  return (
    <EditorTable
      value={props.value}
      onChange={props.onChange}
      columns={[
        { title: 'host', dataIndex: 'host' },
        { title: 'user', dataIndex: 'user' },
        { title: 'pwd', dataIndex: 'pwd' },
      ]}
    />
  );
}
