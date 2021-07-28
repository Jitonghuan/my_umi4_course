// 应用同步
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/27 14:32

import React from 'react';
import {} from 'antd';
import MatrixPageContent from '@/components/matrix-page-content';
import { ContentCard } from '@/components/vc-page-content';
import HeaderTabs from '../_components/header-tabs';

export default function Application(props: any) {
  return (
    <MatrixPageContent>
      <HeaderTabs activeKey="application-sync" history={props.history} />
      <ContentCard>HELLO~~</ContentCard>
    </MatrixPageContent>
  );
}
