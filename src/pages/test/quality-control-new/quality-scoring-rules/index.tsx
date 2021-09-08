import React, { useState, useEffect, useContext } from 'react';
import { ContentCard } from '@/components/vc-page-content';
import PageContainer from '@/components/page-container';
import HeaderTabs from '../_components/header-tabs';

export default function QualityScoringRules(props: any) {
  return (
    <PageContainer className="quality-control-quality-scoring-rules">
      <HeaderTabs activeKey="quality-scoring-rules" history={props.history} />
      <ContentCard>page QualityScoringRules</ContentCard>
    </PageContainer>
  );
}
