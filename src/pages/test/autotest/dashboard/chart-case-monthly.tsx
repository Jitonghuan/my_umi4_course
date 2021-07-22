// dashboard section
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/21 17:42

import React, { useMemo } from 'react';
import { EchartsReact, colorUtil } from '@cffe/fe-datav-components';
import { getCaseMonthlyChartOptions } from './formatter';

const { ColorContainer } = colorUtil.context;

export interface ChartCaseMonthlyProps {
  data: any;
  loading?: boolean;
}

export default function ChartCaseMonthly(props: ChartCaseMonthlyProps) {
  const { data, loading } = props;

  const chartOptions = useMemo(() => {
    return getCaseMonthlyChartOptions(data);
  }, [data]);

  return (
    <section data-loading={loading}>
      <header>
        <h3>近一个月用例新增情况</h3>
      </header>
      <div style={{ height: 280 }}>
        <ColorContainer roleKeys={['color']}>
          <EchartsReact option={chartOptions} />
        </ColorContainer>
      </div>
    </section>
  );
}
