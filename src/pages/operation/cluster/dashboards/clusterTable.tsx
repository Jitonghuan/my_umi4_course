// data formatter
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/08/09 10:30

import React, { useEffect, useMemo } from 'react';
import { Table } from 'antd';
import './index.less';

export interface ChartCaseListProps {
  data: any;
  loading?: boolean;
}
export default function ClusterTable(props: ChartCaseListProps) {
  const { data, loading } = props;
  const countList: object[] = [];
  for (var i in data) {
    let dataSource = {
      name: i,
      count: data[i],
    };
    countList.push(dataSource);
  }
  const columns = [
    {
      title: '分类',
      dataIndex: 'name',
      key: 'name',
      // width: '100px',
    },
    {
      title: '访问量',
      dataIndex: 'count',
      key: 'count',

      width: 90,
      sorter: {
        compare: (a: any, b: any) => a.count - b.count,
      },
    },
  ];

  let tableHeight = (window.innerHeight - 240) / 2 - 84 - 30;
  if (tableHeight > 370) tableHeight = 370;
  if (tableHeight < 270) tableHeight = 270;

  return (
    <section data-loading={loading}>
      <header>
        <h3>A/B集群流量表</h3>
      </header>
      <div>
        <Table
          bordered
          columns={columns}
          dataSource={countList}
          pagination={false}
          size="small"
          scroll={{ y: tableHeight }}
        />
      </div>
    </section>
  );
}
