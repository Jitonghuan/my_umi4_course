// data formatter
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/08/09 10:30

import React, { useMemo } from 'react';
import { Table } from 'antd';
import './index.less';
import { getRequest } from '@/utils/request';
import { getClustersEsDataTable } from './service';
import { useClusterTable } from './hook';

export interface ChartCaseListProps {
  loading?: boolean;
  tableData?: any;
}
export default function ClusterTable(props: ChartCaseListProps) {
  const { loading, tableData } = props;
  const clusterTableData = useMemo(() => {
    return tableData;
  }, [tableData]);
  const columns = [
    {
      title: '院区',
      dataIndex: 'name',
    },
    {
      title: 'A集群',
      dataIndex: 'clusterA',
      sorter: {
        compare: (a: any, b: any) => a.clusterA - b.clusterA,
        // multiple: 1,
      },
    },
    {
      title: 'B集群',
      dataIndex: 'clusterB',
      sorter: {
        compare: (a: any, b: any) => a.clusterB - b.clusterB,
        // multiple: 2,
      },
    },
  ];
  const countList = [
    {
      key: 1,
      name: '之江',
      clusterA: clusterTableData.zj_a,
      clusterB: clusterTableData.zj_b,
    },
    {
      key: 2,
      name: '之江无线',
      clusterA: clusterTableData.zjwx_a,
      clusterB: clusterTableData.zjwx_b,
    },
    {
      key: 3,
      name: '余杭',
      clusterA: clusterTableData.yh_a,
      clusterB: clusterTableData.yh_b,
    },
    {
      key: 4,
      name: '余杭无线',
      clusterA: clusterTableData.yhwx_a,
      clusterB: clusterTableData.yhwx_b,
    },
    {
      key: 5,
      name: '城站庆春',
      clusterA: clusterTableData.czqc_a,
      clusterB: clusterTableData.czqc_b,
    },
    {
      key: 6,
      name: '城站庆春无线',
      clusterA: clusterTableData.czqcwx_a,
      clusterB: clusterTableData.czqcwx_b,
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
      <div className="clusterTable">
        <Table
          rowKey="id"
          bordered
          columns={columns}
          dataSource={countList}
          pagination={false}
          scroll={{ y: tableHeight }}
        />
      </div>
    </section>
  );
}
