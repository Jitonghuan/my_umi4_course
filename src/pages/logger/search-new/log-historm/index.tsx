import React, { useMemo } from 'react';
import { EchartsReact, colorUtil } from '@cffe/fe-datav-components';
import { loggerChart } from './formatter';
import { Tag } from 'antd';

const { ColorContainer } = colorUtil.context;

export interface ChartCaseListProps {
  data: any;
  loading?: boolean;
  hitsData: any;
}

export default function ChartCaseList(props: ChartCaseListProps) {
  const { data, loading, hitsData } = props;

  const chartOptions = useMemo(() => {
    return loggerChart(data);
  }, [data]);

  return (
    <section data-loading={loading}>
      <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
        <Tag color="blue">{hitsData}次命中</Tag>
      </div>
      <div style={{ height: 100 }}>
        <ColorContainer roleKeys={['color']}>
          <EchartsReact option={chartOptions} style={{ height: 100 }} />
        </ColorContainer>
      </div>
    </section>
  );
}
