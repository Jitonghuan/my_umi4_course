// dashboard section
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/21 17:42

import React from 'react';

export interface ChartCaseMonthlyProps {
  data: any;
  loading?: boolean;
}

export default function ChartCaseMonthly(props: ChartCaseMonthlyProps) {
  const { data, loading } = props;

  return (
    <section data-loading={loading}>
      <header>
        <h3>近一个月用例新增情况</h3>
      </header>
    </section>
  );
}
