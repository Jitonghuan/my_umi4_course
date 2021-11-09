// 集群同步
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/11/9 10:05

import React from 'react';
import { Button, Table, Alert } from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import { useTableData } from './hooks';

export default function ClusterPage(props: any) {
  const [tableData, fromCache, loading, completed, reloadData] = useTableData();

  return (
    <ContentCard>
      <div className="table-caption">
        <h3>集群列表</h3>
        <div className="caption-right">
          <Button type="primary" ghost disabled={loading} onClick={() => reloadData(false)}>
            开始比对
          </Button>
          <Button
            type="primary"
            disabled={loading || !tableData?.length}
            onClick={() => props.history.push('./cluster-sync-detail')}
          >
            开始集群同步
          </Button>
        </div>
      </div>
      {fromCache && !loading ? (
        <Alert
          type="info"
          style={{ marginBottom: 16 }}
          showIcon
          message={
            <span>
              当前数据更新时间 {fromCache}，<a>重新比对</a>
            </span>
          }
        />
      ) : null}
      <Table
        rowKey="appName"
        // dataSource={tableData}
        loading={{ spinning: loading, tip: '正在进行数据比对中，请耐心等待' }}
        pagination={false}
        scroll={{ y: window.innerHeight - 330 }}
        locale={{
          emptyText: (
            <div className="custom-table-holder">
              {loading ? (
                '加载中……'
              ) : completed ? (
                '当前双集群版本一致，无需同步'
              ) : (
                <a>当前无缓存数据，点击开始进行比对</a>
              )}
            </div>
          ),
        }}
      >
        <Table.Column title="应用名" dataIndex="appName" />
        <Table.Column title="A集群版本MD5" dataIndex={['ClusterA', 'PackageMd5']} />
        <Table.Column title="B集群版本MD5" dataIndex={['ClusterB', 'PackageMd5']} />
        <Table.Column title="A集群版本" dataIndex={['ClusterA', 'PackageVersion']} />
        <Table.Column title="B集群版本" dataIndex={['ClusterB', 'PackageVersion']} />
      </Table>
    </ContentCard>
  );
}
