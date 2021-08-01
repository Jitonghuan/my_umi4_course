// 集群同步
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/27 14:33

import React from 'react';
import { Button, Table, Alert } from 'antd';
import MatrixPageContent from '@/components/matrix-page-content';
import { ContentCard } from '@/components/vc-page-content';
import HeaderTabs from '../_components/header-tabs';
import { useTableData } from './hooks';

export default function ClusterPage(props: any) {
  const [tableData, fromCache, loading, reloadData] = useTableData();

  return (
    <MatrixPageContent>
      <HeaderTabs activeKey="cluster-sync" history={props.history} />
      <ContentCard>
        <div className="table-caption">
          <h3>集群列表</h3>
          <Button type="primary" disabled={loading} onClick={() => props.history.push('./cluster-sync-detail')}>
            开始集群同步
          </Button>
        </div>
        {fromCache && !loading ? (
          <Alert
            type="info"
            style={{ marginBottom: 16 }}
            showIcon
            message={
              <span>
                当前数据更新时间 {fromCache}，<a onClick={() => reloadData(true)}>重新比对</a>
              </span>
            }
          />
        ) : null}
        <Table
          dataSource={tableData}
          loading={{ spinning: loading, tip: '正在进行数据比对中，请耐心等待' }}
          pagination={false}
        >
          <Table.Column title="应用名" dataIndex="appName" />
          <Table.Column title="A集群版本MD5" dataIndex={['ClusterA', 'PackageMd5']} />
          <Table.Column title="B集群版本MD5" dataIndex={['ClusterB', 'PackageMd5']} />
          <Table.Column title="A集群版本" dataIndex={['ClusterA', 'PackageVersion']} />
          <Table.Column title="A集群版本" dataIndex={['ClusterB', 'PackageVersion']} />
        </Table>
      </ContentCard>
    </MatrixPageContent>
  );
}
