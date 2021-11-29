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
      title: '院区',
      dataIndex: 'name',
    },
    {
      title: 'A集群',
      dataIndex: 'clusterA',
      sorter: {
        compare: (a: any, b: any) => a.clusterA - b.clusterA,
      },
    },
    {
      title: 'B集群',
      dataIndex: 'clusterB',
      sorter: {
        compare: (a: any, b: any) => a.clusterB - b.clusterB,
      },
    },
  ];
  const countList = [
    {
      key: 1,
      name: '赤城街道',
      clusterA: clusterTableData.a_ccjd_cnt,
      clusterB: clusterTableData.b_ccjd_cnt,
    },
    {
      key: 2,
      name: '平桥镇',
      clusterA: clusterTableData.a_pqz_cnt,
      clusterB: clusterTableData.b_pqz_cnt,
    },
    {
      key: 3,
      name: '其他',
      clusterA: clusterTableData.a_qt_cnt,
      clusterB: clusterTableData.b_qt_cnt,
    },
    {
      key: 4,
      name: '天医-门诊楼',
      clusterA: clusterTableData.a_ty_mzl_cnt,
      clusterB: clusterTableData.b_ty_mzl_cnt,
    },
    {
      key: 5,
      name: '天医-其他楼',
      clusterA: clusterTableData.a_ty_qtl_cnt,
      clusterB: clusterTableData.b_ty_qtl_cnt,
    },
    {
      key: 6,
      name: '天医-医技楼',
      clusterA: clusterTableData.a_ty_yjl_cnt,
      clusterB: clusterTableData.b_ty_yjl_cnt,
    },
    {
      key: 7,
      name: '天医-住院楼',
      clusterA: clusterTableData.a_ty_zyl_cnt,
      clusterB: clusterTableData.b_ty_zyl_cnt,
    },
    {
      key: 8,
      name: '乡镇其他',
      clusterA: clusterTableData.a_xzqt_cnt,
      clusterB: clusterTableData.b_xzqt_cnt,
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
          columns={columns}
          dataSource={countList}
          scroll={{ y: tableHeight }}
          rowKey="id"
          bordered
          pagination={false}
        />
      </div>
    </section>
  );
}
