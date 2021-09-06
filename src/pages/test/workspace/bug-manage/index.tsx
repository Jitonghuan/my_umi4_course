import React from 'react';
import { ContentCard } from '@/components/vc-page-content';
import PageContainer from '@/components/page-container';
import HeaderTabs from '../_components/header-tabs';

export default function BugManage(props: any) {
  return (
    <PageContainer>
      <HeaderTabs activeKey="bug-manage" history={props.history} />
      <ContentCard>BugManage</ContentCard>
    </PageContainer>
  );
}
