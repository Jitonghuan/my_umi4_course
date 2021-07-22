// dashboard section
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/21 17:42

import React, { useMemo } from 'react';
import { EchartsReact, colorUtil } from '@cffe/fe-datav-components';
import { getTaskWeeklyChartOptions } from './formatter';

const { ColorContainer } = colorUtil.context;

export interface ChartTaskWeeklyProps {
  data: any;
  loading?: boolean;
}

export default function ChartTaskWeekly(props: ChartTaskWeeklyProps) {
  const { data, loading } = props;

  const chartOptions = useMemo(() => {
    return getTaskWeeklyChartOptions(data);
  }, [data]);

  return (
    <section data-loading={loading}>
      <header>
        <h3>各任务近七天执行情况</h3>
      </header>
      <div style={{ height: 220 }}>
        <ColorContainer roleKeys={['color']}>
          <EchartsReact option={chartOptions} />
        </ColorContainer>
      </div>
    </section>
  );
}
