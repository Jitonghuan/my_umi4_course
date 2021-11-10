// 集群同步
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/11/9 10:05

import React from 'react';
import { Button, Table, Alert } from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import { useTableData } from './hooks';
import DetailModal from '@/components/detail-modal';

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
              当前数据更新时间 {fromCache}，<a onClick={() => reloadData(false)}>重新比对</a>
            </span>
          }
        />
      ) : null}
      <Table
        rowKey="appName"
        dataSource={tableData}
        bordered
        loading={{ spinning: loading, tip: '正在进行数据比对中，请耐心等待' }}
        pagination={false}
        scroll={{
          y: window.innerHeight - 330,
          x: '100%',
        }}
        locale={{
          emptyText: (
            <div className="custom-table-holder">
              {loading ? (
                '加载中……'
              ) : completed ? (
                '当前双集群版本一致，无需同步'
              ) : (
                <a onClick={() => reloadData(false)}>当前无缓存数据，点击开始进行比对</a>
              )}
            </div>
          ),
        }}
      >
        <Table.Column title="应用名" dataIndex="appName" width={140} />
        <Table.ColumnGroup title="A集群版本">
          <Table.Column title="应用镜像Tag" dataIndex={['ClusterA', 'appImageTag']} width={140} />
          <Table.Column title="基础镜像Tag" dataIndex={['ClusterA', 'baseImageTag']} width={140} />
          <Table.Column title="CPU限制值" dataIndex={['ClusterA', 'cpuLimits']} width={120} />
          <Table.Column
            title="JVM参数"
            dataIndex={['ClusterA', 'jvmConfig']}
            width={340}
            ellipsis
            //  render={(_, record:any, index) => {
            //    return <DetailModal limit={60} data={record} dataType="json" />;
            //  }}
          />
          <Table.Column title="内存限制值" dataIndex={['ClusterA', 'memoryLimits']} width={120} />
          <Table.Column title="副本数" dataIndex={['ClusterA', 'replicas']} width={120} />
        </Table.ColumnGroup>
        <Table.ColumnGroup title="B集群版本">
          <Table.Column title="应用镜像Tag" dataIndex={['ClusterB', 'appImageTag']} width={140} />
          <Table.Column title="基础镜像Tag" dataIndex={['ClusterB', 'baseImageTag']} width={140} />
          <Table.Column title="CPU限制值" dataIndex={['ClusterB', 'cpuLimits']} width={120} />
          <Table.Column
            title="JVM参数"
            dataIndex={['ClusterB', 'jvmConfig']}
            width={340}
            ellipsis
            //  render={(_, record:any, index) => {
            //    return <DetailModal limit={60} data={record} dataType="json" />;
            //  }}
          />
          <Table.Column title="内存限制值" dataIndex={['ClusterB', 'memoryLimits']} width={120} />
          <Table.Column title="副本数" dataIndex={['ClusterB', 'replicas']} width={120} />
        </Table.ColumnGroup>
      </Table>
    </ContentCard>
  );
}
