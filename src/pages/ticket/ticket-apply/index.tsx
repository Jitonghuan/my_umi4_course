/**
 * 工单审批
 * @description 工单审批页面
 * @author yyf
 * @version 1.0.0
 * @create 2021-04-06 15:15
 */

import React from 'react';
import { TplTable } from '@cffe/fe-tpl';
import { InlineForm } from '@/components/schema-form';
import MatrixPageContent from '@/components/matrix-page-content';
import { FilterCard, ContentCard } from '@/components/vc-page-content';
import { filterFormSchema, tableSchema } from './schema';
import './index.less';

export default function TicketApply(props: any) {
  return (
    <MatrixPageContent>
      <FilterCard>
        <InlineForm className="ticket-filter-form" {...(filterFormSchema as any)} isShowReset />
      </FilterCard>

      <ContentCard>
        <div className="ticket-table-header">
          <h3>审批列表</h3>
        </div>
        <TplTable schema={tableSchema as any} />
      </ContentCard>
    </MatrixPageContent>
  );
}
