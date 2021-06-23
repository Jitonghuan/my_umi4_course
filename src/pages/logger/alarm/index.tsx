// 日志告警
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/06/23 09:25

import React from 'react';
import {} from 'antd';
import MatrixPageContent from '@/components/matrix-page-content';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import * as APIS from './service';

export default function LoggerAlarm() {
  return (
    <MatrixPageContent>
      <FilterCard>TOP</FilterCard>
      <ContentCard>BOTTOM</ContentCard>
    </MatrixPageContent>
  );
}
