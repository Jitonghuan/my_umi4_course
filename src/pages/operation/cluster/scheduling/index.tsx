// 流量调度
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/27 14:36

import React from 'react';
import {} from 'antd';
import MatrixPageContent from '@/components/matrix-page-content';
import { ContentCard } from '@/components/vc-page-content';
import HeaderTabs from '../_components/header-tabs';
import './index.less';

export default function Traffic(props: any) {
  return (
    <MatrixPageContent>
      <HeaderTabs activeKey="scheduling" history={props.history} />
      <ContentCard></ContentCard>
    </MatrixPageContent>
  );
}
