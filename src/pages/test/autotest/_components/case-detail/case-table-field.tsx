// 用例选择器
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/06/06 15:09

import React from 'react';
import { Collapse, Empty, Table } from 'antd';
import { CaseItemVO } from '../../interfaces';
import './index.less';

export interface CaseTableFieldProps {
  title?: React.ReactNode;
  data?: CaseItemVO[];
}

export default function CaseTable(props: CaseTableFieldProps) {
  return (
    <div className="case-table-field">
      <div className="field-caption">
        <h3>{props.title || '前置用例'}</h3>
      </div>
      {!props.data?.length ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> : null}
      <Collapse>
        {props.data?.map((n, i) => (
          <Collapse.Panel key={i} header={n?.name || '用例'}>
            <ul className="case-info-list">
              <li>所属项目: {n.projectName || '--'}</li>
              <li>所属模块: {n.moduleName || '--'}</li>
              <li>接口地址: {n.apiPath || '--'}</li>
            </ul>
            <h4>定义变量</h4>
            <Table dataSource={n.customVars || []} pagination={false} bordered>
              <Table.Column title="变量名" dataIndex="key" />
              <Table.Column title="类型" dataIndex="type" />
              <Table.Column title="值" dataIndex="value" />
              <Table.Column title="描述" dataIndex="desc" />
            </Table>
            <h4> 保存返回值</h4>
            <Table dataSource={n.savedVars || []} pagination={false} bordered>
              <Table.Column title="变量名" dataIndex="name" />
              <Table.Column title="表达式" dataIndex="jsonpath" />
              <Table.Column title="描述" dataIndex="desc" />
            </Table>
          </Collapse.Panel>
        ))}
      </Collapse>
    </div>
  );
}
