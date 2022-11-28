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
  count:number
}

export default function Dashboards(props:Iprops) {
  const {count}=props
  const [clusterAData, clusterBData, lineloading, loadCluster] = useClusterLineData();
  const [histogramData, loading, loadHistogram] = useABHistogram();
  const [envCode,setEnvCode]=useState<string>("")
  const getEnvCode=()=>{
    queryCommonEnvCode().then((res:any)=>{
      if(res?.success){
        setEnvCode(res?.data)
        let envCode=res?.data
        if(envCode){
          loadHistogram(true,envCode);
          loadCluster(true,envCode);
        }
       
      }else{
        setEnvCode("")
      }

    })
  }

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
  }, []);

  useEffect(() => {
    if (appConfig.IS_Matrix !== 'public') {
      getEnvCode()
    }
  }, []);
  useEffect(()=>{
    if(count!==0&&envCode){
      loadHistogram(true,envCode);
      loadCluster(true,envCode);
      
    }
  },[count])

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
