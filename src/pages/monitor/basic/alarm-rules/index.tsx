// 告警规则
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/30 10:10

import React from 'react';
import {} from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import RulesTable from '../_components/rules-table';

export default function AlarmRules() {
  return (
    <ContentCard>
      <RulesTable />
    </ContentCard>
  );
}
