// dashboard section
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/21 17:42

import React, { useMemo } from 'react';
import { EchartsReact, colorUtil } from '@cffe/fe-datav-components';
import { getCaseListChartOptions } from './formatter';

const { ColorContainer } = colorUtil.context;

export interface ChartCaseListProps {
  data: any;
  loading?: boolean;
}

export default function ChartCaseList(props: ChartCaseListProps) {
  const { data, loading } = props;

  const chartOptions = useMemo(() => {
    return getCaseListChartOptions(data);
  }, [data]);

  return (
    <section data-loading={loading}>
      <header>
        <h3>各项用例数据</h3>
      </header>
      <div style={{ height: 220 }}>
        <ColorContainer roleKeys={['color']}>
          <EchartsReact option={chartOptions} />
        </ColorContainer>
      </div>
    </section>
  );
}
