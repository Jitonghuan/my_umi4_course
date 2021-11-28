// 上下布局页面
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/30 10:10

import React from 'react';
import {} from 'antd';
import PageContainer from '@/components/page-container';
import { ContentCard, FilterCard, CardRowGroup } from '@/components/vc-page-content';

export default function DemoPageTb() {
  return (
    <PageContainer>
      <FilterCard>TOP</FilterCard>
      <CardRowGroup>
        <CardRowGroup.SlideCard width={200}>LEFT</CardRowGroup.SlideCard>
        <ContentCard>RIGHT</ContentCard>
      </CardRowGroup>
    </PageContainer>
  );
}
