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
        <h3>A/B集群各机构流量</h3>
      </header>
      <div>
        <div style={{ height: 'calc(100% - 20px)' }}>
          <ColorContainer roleKeys={['color']}>
            <EchartsReact option={ABHistorgramOptions} />
          </ColorContainer>
        </div>
        <div style={{ display: 'flex', width: '80%', fontSize: 12 }}>
          <div style={{ flex: 1, textAlign: 'center' }}>A集群</div>
          <div style={{ flex: 1, textAlign: 'center' }}>B集群</div>
        </div>
      </div>
    </section>
  );
}
