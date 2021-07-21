// dashboard section
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/21 17:42

import React from 'react';
import { Spin } from 'antd';

export interface ChartCaseMonthlyProps {
  data: any;
  loading?: boolean;
}

export default function ChartCaseMonthly(props: ChartCaseMonthlyProps) {
  const { data, loading } = props;

  // if (loading) {
  //   return <div className="loading-wrapper"><Spin /></div>
  // }

  return (
    <section>
      <header>
        <h3>近一个月用例新增情况</h3>
      </header>
    </section>
  );
}
