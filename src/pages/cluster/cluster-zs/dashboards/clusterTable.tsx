// data formatter
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/08/09 10:30

import React, { useMemo } from 'react';
import { Table } from 'antd';
import './index.less';
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
      title: '机构',
      dataIndex: 'hospitalDistrictName',
    },
    {
      title: 'A集群',
      dataIndex: 'clusterACount',
      sorter: {
        compare: (a: any, b: any) => a.clusterACount - b.clusterACount,
        // multiple: 1,
      },
    },
    {
      title: 'B集群',
      dataIndex: 'clusterBCount',
      sorter: {
        compare: (a: any, b: any) => a.clusterBCount - b.clusterBCount,
        // multiple: 2,
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
      <div className="clusterTable">
        <Table
          rowKey="id"
          bordered
          columns={columns}
          dataSource={clusterTableData || []}
          pagination={false}
          scroll={{ y: tableHeight }}
        />
      </div>
    </section>
  );
}
