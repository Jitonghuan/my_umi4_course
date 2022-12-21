import React, { useEffect, useState,createContext } from 'react';
import PageContainer from '@/components/page-container';
import { infoOptions } from '../../schema';
import { history,useLocation } from 'umi';
import { Empty, Segmented } from 'antd';
import DetailContext from './context';
import SessionManage from './components/session-manage';
import { useGetInstanceDetail } from '../../hook';
import AccountManage from '../../../account-manage';
import SchemaManage from '../../../database-manage';
import Trends from '../../../overview/trends';
import SessionDiag from './components/session-diag';

export default function InstanceInfo() {
  let location:any = useLocation();
  const curRecordData: any = location?.state;
  const instanceId = curRecordData?.instanceId;
  const clusterId = curRecordData?.clusterId;
  const optType = curRecordData?.optType;
  const clusterRole=curRecordData?.curRecord?.clusterRole;
  const [activeTab, setActiveTab] = useState<string | number>('info');
  const [infoLoading, infoData, topoData, getInstanceDetail] = useGetInstanceDetail();
  const changeInfoOption = (value: string | number) => {
    setActiveTab(value);
  };
  useEffect(() => {
    if (instanceId) {
      getInstanceDetail({ id: instanceId });
    }
    if (optType) {
      if (optType === 'instance-list-manage') {
        setActiveTab('info');
      }
      if (optType === 'instance-list-trend' || optType === 'overview-list-trend') {
        setActiveTab('trend');
      }
    }
  }, [instanceId]);
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
      <DetailContext.Provider value={{ clusterId,clusterRole }}>
        <>
        {activeTab === 'info' && (
        <SessionManage
          loading={infoLoading}
          infoData={infoData}
          topoData={topoData}
          // clusterId={clusterId}
          getInstanceDetail={(paramsObj: { id: number }) => getInstanceDetail(paramsObj)}
        />
      )}
     
      
     
      {activeTab === 'schema' && <SchemaManage clusterId={clusterId} clusterRole={clusterRole}  />}
      {activeTab === 'account' && <AccountManage clusterId={clusterId} clusterRole={clusterRole} />}
      {activeTab === 'trend' && <Trends instanceId={instanceId} />}
      {activeTab === 'session' && <SessionDiag  />}
      {activeTab === 'sql' && (
        <div
          className="unstart-demo"
          style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          {empty}
        </div>
      )}
      {activeTab === 'waitting' && (
        <div
          className="unstart-demo"
          style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          {empty}
        </div>
      )}
       </>
       </DetailContext.Provider>
        
      
     
    </PageContainer>
  );
}
