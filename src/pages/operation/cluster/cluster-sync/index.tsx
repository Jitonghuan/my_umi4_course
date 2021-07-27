// 集群同步
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/27 14:33

import React from 'react';
import {} from 'antd';
import MatrixPageContent from '@/components/matrix-page-content';
import { ContentCard } from '@/components/vc-page-content';
import HeaderTabs from '../_components/header-tabs';

export default function ClusterPage(props: any) {
  return (
    <MatrixPageContent>
      <HeaderTabs activeKey="cluster-sync" history={props.history} />
      <ContentCard></ContentCard>
    </MatrixPageContent>
  );
}
