// dashboard logger
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/11/23 11:09

import React, { useMemo } from 'react';
import { EchartsReact, colorUtil } from '@cffe/fe-datav-components';
import { loggerChart } from './formatter';

const { ColorContainer } = colorUtil.context;

export interface ChartCaseListProps {
  data: any;
  loading?: boolean;
}

export default function ChartCaseList(props: ChartCaseListProps) {
  const { data, loading } = props;

  const chartOptions = useMemo(() => {
    return loggerChart(data);
  }, [data]);

  return (
    <section data-loading={loading}>
      <div>
        <h3>多少次命中</h3>
      </div>
      <div style={{ height: 380 }}>
        <ColorContainer roleKeys={['color']}>
          <EchartsReact option={chartOptions} />
        </ColorContainer>
      </div>
    </section>
  );
}
