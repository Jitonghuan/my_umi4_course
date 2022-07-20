import React, { useMemo, useEffect, useState } from 'react';
import PageContainer from '@/components/page-container';
import { infoOptions } from '../../schema';
import { history } from 'umi';
import TableSearch from '@/components/table-search';
import { ContentCard } from '@/components/vc-page-content';
import { FilterCard } from '@/components/vc-page-content';
import { Button, Space, Form, Segmented } from 'antd';
import SessionManage from './components/session-manage';
import { useGetInstanceDetail } from '../../hook';
import AccountManage from '../../../account-manage';
import SchemaManage from '../../../database-manage';
import Trends from '../../../overview/trends';

import useTable from '@/utils/useTable';
export default function DEMO() {
  const [form] = Form.useForm();
  const curRecordData: any = history.location?.state;
  const instanceId = curRecordData?.instanceId;
  const clusterId = curRecordData?.clusterId;
  const optType = curRecordData?.optType;
  const [mode, setMode] = useState<EditorMode>('HIDE');
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

  return (
    <PageContainer>
      <Segmented block size="small" options={infoOptions} onChange={changeInfoOption} value={activeTab} />
      {activeTab === 'info' && (
        <SessionManage
          loading={infoLoading}
          infoData={infoData}
          topoData={topoData}
          clusterId={clusterId}
          getInstanceDetail={(paramsObj: { id: number }) => getInstanceDetail(paramsObj)}
        />
      )}
      {activeTab === 'schema' && <SchemaManage clusterId={clusterId} />}
      {activeTab === 'account' && <AccountManage clusterId={clusterId} />}
      {activeTab === 'trend' && <Trends instanceId={instanceId} />}
    </PageContainer>
  );
}
