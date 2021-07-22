// dashboard section
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/21 17:42

import React from 'react';

export interface ChartCaseListProps {
  data: any;
  loading?: boolean;
}

export default function ChartCaseList(props: ChartCaseListProps) {
  const { data, loading } = props;

  return (
    <section data-loading={loading}>
      <header>
        <h3>各项用例数据</h3>
      </header>
    </section>
  );
}
