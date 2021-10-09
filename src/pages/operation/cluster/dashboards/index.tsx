import React, { useEffect } from 'react';
import { Button } from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import ClusterAChart from './chart-case-Acluster';
import ClusterBChart from './chart-case-Bcluster';
import ABHistorgram from './ABHistogram';
import ClusterTable from './clusterTable';
import { useABHistogram, useClusterA, useClusterB, useClusterTable } from './hook';
import './index.less';

export default function Dashboards() {
  const [clusterAData, clusterALoading, loadClusterA] = useClusterA();
  const [clusterBData, clusterBLoading, loadClusterB] = useClusterB();
  const [histogramData, loading, loadHistogram] = useABHistogram();
  const [clusterTableData, loadingTable, loadClusterTable] = useClusterTable();
  useEffect(() => {
    let intervalId = setInterval(() => {
      loadHistogram(false);
      loadClusterB(false);
      loadClusterA(false);
    }, 1000 * 60);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <ContentCard className="cluster-dashboards">
      <div className="action-groups">
        <Button
          type="primary"
          onClick={() => {
            loadHistogram(), loadClusterA(), loadClusterB(), loadClusterTable();
          }}
        >
          刷新数据
        </Button>
      </div>
      <div className="section-group">
        <ABHistorgram data={histogramData} loading={loading} />
        <ClusterTable data={clusterTableData} loading={loadingTable} />
      </div>
      <div className="section-group">
        <ClusterAChart data={clusterAData} loading={clusterALoading} />
        <ClusterBChart data={clusterBData} loading={clusterBLoading} />
      </div>
    </ContentCard>
  );
}
