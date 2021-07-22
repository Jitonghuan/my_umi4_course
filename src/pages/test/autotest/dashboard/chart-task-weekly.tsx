// dashboard section
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/21 17:42

import React from 'react';

export interface ChartTaskWeeklyProps {
  data: any;
  loading?: boolean;
}

export default function ChartTaskWeekly(props: ChartTaskWeeklyProps) {
  const { data, loading } = props;

  return (
    <section data-loading={loading}>
      <header>
        <h3>各任务近七天执行情况</h3>
      </header>
    </section>
  );
}
