import React, { useEffect } from 'react';
import { Button } from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import ClusterAChart from './chart-case-Acluster';
import ClusterBChart from './chart-case-Bcluster';
import ABHistorgram from './ABHistogram';
import ClusterTable from './clusterTable';
import { useABHistogram, useClusterLineData } from './hook';
import './index.less';

export default function Dashboards() {
  const [clusterAData, clusterBData, lineloading, loadCluster] = useClusterLineData();
  const [histogramData, loading, loadHistogram] = useABHistogram();

  useEffect(() => {
    let intervalId = setInterval(() => {
      loadHistogram(false);
      loadCluster(false);
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
            loadHistogram(), loadCluster();
          }}
        >
          刷新数据
        </Button>
      </div>
      <div className="section-group">
        <ABHistorgram data={histogramData || []} loading={loading} />
        <ClusterTable tableData={histogramData || []} loading={loading} />
      </div>
      <div className="section-group">
        <ClusterAChart data={clusterAData || []} loading={lineloading} />
        <ClusterBChart data={clusterBData || []} loading={lineloading} />
      </div>
    </ContentCard>
  );
}
