import React, { useState, useEffect, useContext } from 'react';
import { ContentCard } from '@/components/vc-page-content';
import PageContainer from '@/components/page-container';
import HeaderTabs from '../_components/header-tabs';

export default function TeskList(props: any) {
  return (
    <PageContainer className="quality-control-tesk-list">
      <HeaderTabs activeKey="tesk-list" history={props.history} />
      <ContentCard>page TeskList</ContentCard>
    </PageContainer>
  );
}
