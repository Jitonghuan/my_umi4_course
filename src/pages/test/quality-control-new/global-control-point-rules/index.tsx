import React, { useState, useEffect, useContext } from 'react';
import { ContentCard } from '@/components/vc-page-content';
import PageContainer from '@/components/page-container';
import HeaderTabs from '../_components/header-tabs';

export default function GlobalControlPointRules(props: any) {
  return (
    <PageContainer className="quality-control-global-control-point-rules">
      <HeaderTabs activeKey="global-control-point-rules" history={props.history} />
      <ContentCard>page GlobalControlPointRules</ContentCard>
    </PageContainer>
  );
}
