// dashboard section
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/21 17:42

import React, { useMemo } from 'react';
import { EchartsReact, colorUtil } from '@cffe/fe-datav-components';
import { getLastExecChartOptions } from './formatter';

const { ColorContainer } = colorUtil.context;

export interface ChartLastExecProps {
  data: any;
  loading?: boolean;
}

export default function ChartLastExec(props: ChartLastExecProps) {
  const { data, loading } = props;

  const chartOptions = useMemo(() => {
    return getLastExecChartOptions(data);
  }, [data]);

  return (
    <section style={{ width: 376 }} data-loading={loading}>
      <header>
        <h3>最近一次执行情况</h3>
      </header>
      <div style={{ height: 220 }}>
        <ColorContainer roleKeys={['color']}>
          <EchartsReact option={chartOptions} />
        </ColorContainer>
      </div>
    </section>
  );
}
