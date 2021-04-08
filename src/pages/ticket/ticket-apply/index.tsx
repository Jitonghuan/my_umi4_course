import React, { useState, useCallback, useContext } from 'react';

import { TplTable } from '@cffe/fe-tpl';
import { InlineForm } from '@cffe/fe-backend-component';
import VCPageContent, {
  FilterCard,
  ContentCard,
} from '@/components/vc-page-content';
import FEContext from '@/layouts/basic-layout/FeContext';

import { filterFormSchema, tableSchema } from './schema';

import './index.less';

/**
 * 工单审批
 * @description 工单审批页面
 * @author yyf
 * @version 1.0.0
 * @create 2021-04-06 15:15
 */
const Coms = (props: any) => {
  const { location } = props;
  const feContent = useContext(FEContext);

  // 过滤操作
  const handleFilter = useCallback((vals) => {
    console.log(vals);
  }, []);

  return (
    <VCPageContent
      height="calc(100vh - 118px)"
      breadcrumbMap={feContent.breadcrumbMap}
      pathname={location.pathname}
      isFlex
    >
      <FilterCard>
        <InlineForm
          className="ticket-filter-form"
          {...(filterFormSchema as any)}
          isShowReset
          onFinish={handleFilter}
        />
      </FilterCard>

      <ContentCard>
        <div className="ticket-table-header">
          <h3>审批列表</h3>
        </div>
        <TplTable schema={tableSchema} />
      </ContentCard>
    </VCPageContent>
  );
};

/**
 * 默认值
 */
Coms.defaultProps = {
  // 属性默认值配置
};

export default Coms;
