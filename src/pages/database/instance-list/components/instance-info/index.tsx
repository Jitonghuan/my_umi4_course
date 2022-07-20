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
  const clusterId: any = history.location?.state;
  const [mode, setMode] = useState<EditorMode>('HIDE');
  const [activeTab, setActiveTab] = useState<string | number>('info');
  const [infoLoading, infoData, topoData, getInstanceDetail] = useGetInstanceDetail();
  const changeInfoOption = (value: string | number) => {
    setActiveTab(value);
  };
  useEffect(() => {
    if (clusterId) {
      getInstanceDetail({ id: clusterId });
    }
  }, [clusterId]);

  return (
    <PageContainer>
      <Segmented block options={infoOptions} onChange={changeInfoOption} />
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
      {activeTab === 'trend' && <Trends clusterId={clusterId} />}
    </PageContainer>
  );
}
