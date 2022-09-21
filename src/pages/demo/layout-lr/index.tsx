// 左右布局页面
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/30 10:10

import React from 'react';
import {} from 'antd';
import PageContainer from '@/components/page-container';
import { CardRowGroup, ContentCard } from '@/components/vc-page-content';

export default function DemoPageLr() {
  return (
    <PageContainer>
      <CardRowGroup>
        <CardRowGroup.SlideCard width={200}>LEFT</CardRowGroup.SlideCard>
        <ContentCard>RIGHT</ContentCard>
      </CardRowGroup>
    </PageContainer>
  );
}

