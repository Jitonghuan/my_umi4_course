import React, { useMemo, useEffect, useState } from 'react';
import PageContainer from '@/components/page-container';
import { infoOptions } from '../../schema';
import TableSearch from '@/components/table-search';
import { ContentCard } from '@/components/vc-page-content';
import { FilterCard } from '@/components/vc-page-content';
import { Button, Space, Form, Segmented } from 'antd';
import SessionManage from '../session-manage';
import useTable from '@/utils/useTable';
export default function DEMO() {
  const [form] = Form.useForm();
  const [mode, setMode] = useState<EditorMode>('HIDE');
  const [activeTab, setActiveTab] = useState<string | number>('info');
  const changeInfoOption = (value: string | number) => {
    setActiveTab(value);
  };

  return (
    <PageContainer>
      <Segmented block options={infoOptions} onChange={changeInfoOption} />
      {activeTab === 'session' && <SessionManage />}

      <ContentCard></ContentCard>
    </PageContainer>
  );
}
