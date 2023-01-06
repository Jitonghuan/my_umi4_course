import React, { useEffect, useState } from 'react';
import PageContainer from '@/components/page-container';
import { infoOptions } from '../../schema';
import { history,useLocation } from 'umi';
import { Empty, Segmented } from 'antd';
import DetailContext from './context';
import SessionManage from './components/instance-detail';
import { useGetInstanceDetail } from '../../hook';
import AccountManage from '../../../account-manage';
import SchemaManage from '../../../database-manage';
import Trends from '../../../overview/trends';
import SessionDiag from './components/session-diag';
import CapacityAnalyze from "./components/capacity-analyze";
import LoggerManage from './components/logger'

export default function InstanceInfo() {
  let location:any = useLocation();
  const curRecordData: any = location?.state;
  const instanceId:number = curRecordData?.instanceId;
  const clusterId:number = curRecordData?.clusterId;
  const optType:string = curRecordData?.optType;
  const clusterRole=curRecordData?.curRecord?.clusterRole;
  const [activeTab, setActiveTab] = useState<string | number>('detail');
  
  const changeInfoOption = (value: string | number) => {
    setActiveTab(value);
  };
  useEffect(() => {
    if (optType) {
      if (optType === 'instance-list-manage') {
        setActiveTab('detail');
      }
      if (optType === 'instance-list-trend' || optType === 'overview-list-trend') {
        setActiveTab('trend');
      }
    }
  }, []);
  const empty = (
    <Empty
      image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
      imageStyle={{
        height: 60,
      }}
      description={<span>暂未开发...敬请期待...</span>}
    ></Empty>
  );

  return (
    <PageContainer>
      <Segmented block size="small" options={infoOptions} onChange={changeInfoOption} value={activeTab} />
      <DetailContext.Provider value={{ clusterId,clusterRole,instanceId,envCode:curRecordData?.curRecord?.envCode }}>
        <>
      {activeTab === 'detail' && (<SessionManage/>)}
      {activeTab === 'database' && <SchemaManage />}
      {activeTab === 'account' && <AccountManage />}
      {activeTab === 'trend' && <Trends />}
      {activeTab === 'session' && <SessionDiag  />}
      {activeTab === 'logger' && <LoggerManage/>}
      {activeTab === 'capacity' && ( <CapacityAnalyze />)}
       </>
       </DetailContext.Provider>
        
      
     
    </PageContainer>
  );
}
