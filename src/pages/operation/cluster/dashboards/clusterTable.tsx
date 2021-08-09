// data formatter
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/08/09 10:30

import { clusterBLineChart } from './formatter';
import React, { useMemo } from 'react';
import { Table } from 'antd';
import { EchartsReact, colorUtil } from '@cffe/fe-datav-components';

const { ColorContainer } = colorUtil.context;
export default function ClusterTable() {
  const columns = [
    {
      title: 'filters',
      dataIndex: 'chinese',
      sorter: {
        compare: (a: any, b: any) => a.chinese - b.chinese,
        multiple: 3,
      },
    },
    {
      title: 'Count',
      dataIndex: 'math',
      sorter: {
        compare: (a: any, b: any) => a.math - b.math,
        multiple: 2,
      },
    },
  ];
  const data = [
    {
      key: '1',

      chinese: 98,
      math: 60,
      english: 70,
    },
    {
      key: '2',

      chinese: 98,
      math: 66,
      english: 89,
    },
  ];

  const onChange = (pagination: any, filters: any, sorter: any, extra: any) => {
    console.log('params', pagination, filters, sorter, extra);
  };

  return (
    <section>
      <header>
        <h3>浙一双集群流量表</h3>
      </header>
      <div style={{ height: '420px' }}>
        <Table columns={columns} dataSource={data} onChange={onChange}></Table>
      </div>
    </section>
  );
}
