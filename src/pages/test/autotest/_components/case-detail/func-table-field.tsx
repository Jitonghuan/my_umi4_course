// 前/后置函数编辑器
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/06/06 11:35

import React from 'react';
import { Table } from 'antd';
import './index.less';

export interface FuncTableFieldProps {
  title: React.ReactNode;
  data?: Record<string, any>[];
}

export default function FuncTableField(props: FuncTableFieldProps) {
  return (
    <div className="func-table-field">
      <div className="field-caption">
        <h3>{props.title}</h3>
      </div>
      <Table dataSource={props.data || []} bordered pagination={false}>
        <Table.Column
          dataIndex="type"
          title="类型"
          render={(value) => (value === 0 ? '函数' : value === 1 ? 'SQL' : '工厂')}
          width={60}
        />
        <Table.Column dataIndex="id" title="ID" />
        <Table.Column dataIndex="name" title="名称" />
        <Table.Column dataIndex="argument" title="入参" width={260} />
        <Table.Column dataIndex="desc" title="描述" />
      </Table>
    </div>
  );
}
