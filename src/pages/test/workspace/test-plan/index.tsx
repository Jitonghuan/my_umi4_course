import React from 'react';
import { ContentCard } from '@/components/vc-page-content';
import PageContainer from '@/components/page-container';
import HeaderTabs from '../_components/header-tabs';

export default function TestPlan(props: any) {
  return (
    <PageContainer>
      <HeaderTabs activeKey="test-plan" history={props.history} />
      <ContentCard>TestPlan</ContentCard>
    </PageContainer>
  );
}
