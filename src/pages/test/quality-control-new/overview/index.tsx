import React, { useState, useEffect, useContext } from 'react';
import { ContentCard } from '@/components/vc-page-content';
import PageContainer from '@/components/page-container';
import HeaderTabs from '../_components/header-tabs';

export default function Overview(props: any) {
  return (
    <PageContainer className="quality-control-overview">
      <HeaderTabs activeKey="overview" history={props.history} />
      <ContentCard>page overview</ContentCard>
    </PageContainer>
  );
}
