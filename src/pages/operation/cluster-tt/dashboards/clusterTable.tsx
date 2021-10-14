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
  return (
    <section data-loading={loading}>
      <header>
        <h3>A/B集群流量表</h3>
      </header>
      <div className="clusterTable">
        <Table rowKey="id" bordered pagination={false} />
      </div>
    </section>
  );
}
