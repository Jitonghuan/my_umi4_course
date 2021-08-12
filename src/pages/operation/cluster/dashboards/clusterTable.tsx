// data formatter
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/08/09 10:30

import { clusterBLineChart } from './formatter';
import React, { useEffect, useMemo } from 'react';
import { Table } from 'antd';
import { EchartsReact, colorUtil } from '@cffe/fe-datav-components';
import './index.less';
const { ColorContainer } = colorUtil.context;

export interface ChartCaseListProps {
  data: any;
  loading?: boolean;
}
export default function ClusterTable(props: ChartCaseListProps) {
  const { data, loading } = props;
  // console.log('ssssss',data);
  const countList: object[] = [];
  // const [histogramData, lastloading,loadHistogram] = useABHistogram();
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
      width: '100px',
    },
    {
      title: '访问量',
      dataIndex: 'count',
      key: 'count',
      width: '80px',
      sorter: {
        compare: (a: any, b: any) => a.count - b.count,
      },
    },
  ];
  // useEffect(() => {

  //   loadHistogram();
  // }, []);

  const onChange = (filters: any, sorter: any, extra: any) => {};

  return (
    <section data-loading={loading}>
      <header>
        <h3>A/B集群流量表</h3>
      </header>
      <div className="clusterTable">
        <Table
          bordered
          columns={columns}
          dataSource={countList}
          pagination={false}
          onChange={onChange}
          size="middle"
          scroll={{ y: window.innerHeight - 734 }}
        ></Table>
      </div>
    </section>
  );
}
