import React from 'react';
import { ContentCard } from '@/components/vc-page-content';
import MatrixPageContent from '@/components/matrix-page-content';
import HeaderTabs from '../_components/header-tabs';

export default function BugManage(props: any) {
  return (
    <MatrixPageContent>
      <HeaderTabs activeKey="bug-manage" history={props.history} />
      <ContentCard>BugManage</ContentCard>
    </MatrixPageContent>
  );
}
