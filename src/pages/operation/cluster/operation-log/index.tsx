// 操作日志
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/27 14:35

import React, { useContext, useState, useEffect } from 'react';
import {} from 'antd';
import MatrixPageContent from '@/components/matrix-page-content';
import { ContentCard } from '@/components/vc-page-content';
import HeaderTabs from '../_components/header-tabs';

export default function Operation(props: any) {
  return (
    <MatrixPageContent>
      <HeaderTabs activeKey="operation-log" history={props.history} />
      <ContentCard></ContentCard>
    </MatrixPageContent>
  );
}
