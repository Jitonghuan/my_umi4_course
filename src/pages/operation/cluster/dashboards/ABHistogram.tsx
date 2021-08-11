// data formatter
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/08/09 10:30

import { ABClusterHistogram } from './formatter';
import React, { useMemo } from 'react';
import { EchartsReact, colorUtil } from '@cffe/fe-datav-components';

export interface ChartCaseListProps {
  data: any;
  loading?: boolean;
}
const { ColorContainer } = colorUtil.context;
export default function ABHistorgram(props: ChartCaseListProps) {
  const { data, loading } = props;

  const ABHistorgramOptions = useMemo(() => {
    return ABClusterHistogram(data);
  }, [data]);

  return (
    <section data-loading={loading}>
      <header>
        <h3>A/B集群各院区流量</h3>
      </header>
      <div style={{ height: '420px' }}>
        <ColorContainer roleKeys={['color']}>
          <EchartsReact option={ABHistorgramOptions} />
        </ColorContainer>
      </div>
    </section>
  );
}
