import React, { useState, useEffect, useContext } from 'react';
import { ContentCard } from '@/components/vc-page-content';
import PageContainer from '@/components/page-container';
import HeaderTabs from '../_components/header-tabs';

export default function AppControlPointRules(props: any) {
  return (
    <PageContainer className="quality-control-app-control-point-rules">
      <HeaderTabs activeKey="app-control-point-rules" history={props.history} />
      <ContentCard>page AppControlPointRules</ContentCard>
    </PageContainer>
  );
}
