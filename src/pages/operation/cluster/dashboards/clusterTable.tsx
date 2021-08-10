// data formatter
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/08/09 10:30

import { clusterBLineChart } from './formatter';
import React, { useMemo } from 'react';
import { Table } from 'antd';
import { EchartsReact, colorUtil } from '@cffe/fe-datav-components';
import { useABHistogram } from './hook';
const { ColorContainer } = colorUtil.context;
export default function ClusterTable() {
  const countList: object[] = [];
  const [histogramData, loading] = useABHistogram();
  for (var i in histogramData) {
    let dataSource = {
      name: i,
      count: histogramData[i],
    };
    countList.push(dataSource);
  }
  const columns = [
    {
      title: '分类',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '访问量',
      dataIndex: 'count',
      key: 'count',
      sorter: {
        compare: (a: any, b: any) => a.count - b.count,
      },
    },
  ];

  const onChange = (filters: any, sorter: any, extra: any) => {};

  return (
    <section>
      <header>
        <h3>浙一双集群流量表</h3>
      </header>
      <div style={{ height: '420px' }}>
        <Table bordered columns={columns} dataSource={countList} pagination={false} onChange={onChange}></Table>
      </div>
    </section>
  );
}
