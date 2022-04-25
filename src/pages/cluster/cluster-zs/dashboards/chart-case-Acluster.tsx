// data formatter
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/08/09 10:30

import { clusterALineChart } from './formatter';
import React, { useMemo } from 'react';
import { EchartsReact, colorUtil } from '@cffe/fe-datav-components';

export interface ChartCaseListProps {
  data: any;
  loading?: boolean;
}
const { ColorContainer } = colorUtil.context;
export default function ClusterAChart(props: ChartCaseListProps) {
  const { data, loading } = props;
  const clusterAchartOptions = useMemo(() => {
    return clusterALineChart(data);
  }, [data]);

  return (
    <section data-loading={loading}>
      <header>
        <h3>A集群各机构流量</h3>
      </header>
      <div>
        <ColorContainer roleKeys={['color']}>
          <EchartsReact option={clusterAchartOptions} />
        </ColorContainer>
      </div>
    </section>
  );
}
