import React from 'react';
import { ContentCard } from '@/components/vc-page-content';
import MatrixPageContent from '@/components/matrix-page-content';
import HeaderTabs from '../_components/header-tabs';

export default function TestPlan(props: any) {
  return (
    <MatrixPageContent>
      <HeaderTabs activeKey="test-plan" history={props.history} />
      <ContentCard>TestPlan</ContentCard>
    </MatrixPageContent>
  );
}
