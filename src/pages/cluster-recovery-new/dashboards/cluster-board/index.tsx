import React, { useEffect,useState } from 'react';
import { Button } from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import ClusterAChart from './chart-case-Acluster';
import ClusterBChart from './chart-case-Bcluster';
import ABHistorgram from './ABHistogram';
import appConfig from '@/app.config';
import ClusterTable from './clusterTable';
import { useABHistogram, useClusterLineData,queryCommonEnvCode } from './hook';
import './index.less';
interface Iprops{
  count:number,
  envCode:string
}

export default function Dashboards(props:Iprops) {
  const {count,envCode}=props
  const [clusterAData, clusterBData, lineloading, loadCluster] = useClusterLineData();
  const [histogramData, loading, loadHistogram] = useABHistogram();
  
  useEffect(() => {
    let intervalId = setInterval(() => {
      if(envCode){
        loadHistogram(false,envCode);
        loadCluster(false,envCode);
      }
     
    }, 1000 * 60);
    return () => {
      clearInterval(intervalId);
    };
  }, [envCode]);

 
  useEffect(()=>{
    if(count===0&&envCode){
      loadHistogram(false,envCode);
      loadCluster(false,envCode);
      
    }
   
    if(count!==0&&envCode){
      loadHistogram(true,envCode);
      loadCluster(true,envCode);
      
    }
  },[count,envCode])

  return (
    <ContentCard className="cluster-dashboards">
      <div className="action-groups">
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
