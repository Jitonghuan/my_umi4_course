// dashboard section
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/21 17:42

import React from 'react';
import { Spin } from 'antd';

export interface ChartLastExecProps {
  data: any;
  loading?: boolean;
}

export default function ChartLastExec(props: ChartLastExecProps) {
  const { data, loading } = props;

  // if (loading) {
  //   return <div className="loading-wrapper"><Spin /></div>
  // }

  return (
    <section style={{ width: 376 }}>
      <header>
        <h3>最近一次执行情况</h3>
      </header>
    </section>
  );
}
