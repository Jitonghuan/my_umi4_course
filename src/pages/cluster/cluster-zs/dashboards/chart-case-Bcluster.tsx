// data formatter
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/08/09 10:30

import { clusterBLineChart } from './formatter';
import React, { useMemo } from 'react';
import { EchartsReact, colorUtil } from '@cffe/fe-datav-components';

export interface ChartCaseListProps {
  data: any;
  loading?: boolean;
}

const { ColorContainer } = colorUtil.context;
export default function ClusterBChart(props: ChartCaseListProps) {
  const { data, loading } = props;
  const clusterBchartOptions = useMemo(() => {
    return clusterBLineChart(data);
  }, [data]);

  return (
    <section data-loading={loading}>
      <header>
        <h3>B集群各机构流量</h3>
      </header>
      <div>
        <ColorContainer roleKeys={['color']}>
          <EchartsReact option={clusterBchartOptions} />
        </ColorContainer>
      </div>
    </section>
  );
}
