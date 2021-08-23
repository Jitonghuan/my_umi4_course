// 左右布局页面
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/30 10:10

import React from 'react';
import {} from 'antd';
import MatrixPageContent from '@/components/matrix-page-content';
import { CardRowGroup, ContentCard } from '@/components/vc-page-content';

export default function DemoPageLr() {
  return (
    <MatrixPageContent isFlex>
      <CardRowGroup>
        <CardRowGroup.SlideCard width={200}>LEFT</CardRowGroup.SlideCard>
        <ContentCard>RIGHT</ContentCard>
      </CardRowGroup>
    </MatrixPageContent>
  );
}
