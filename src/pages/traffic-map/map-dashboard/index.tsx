import React, { useEffect, useMemo } from 'react';
import { Button } from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import { EchartsReact, colorUtil } from '@cffe/fe-datav-components';
// import backgroundImg from '@/assets/imgs/bg.jpg';
import { mapIndex } from './formatter';
const { ColorContainer } = colorUtil.context;
import './index.less';

export interface ChartCaseListProps {
  data: any;
  loading?: boolean;
}

export default function mapDashboards(props: ChartCaseListProps) {
  const { data, loading } = props;
  const mapIndexOptions = useMemo(() => {
    return mapIndex(data);
  }, [data]);

  useEffect(() => {}, []);

  return (
    // style={{ backgroundImage: `url(${backgroundImg})` }}

    <ContentCard className="mapdashboards">
      <header>
        <title>流量地图</title>
      </header>
      <div style={{ height: '50rem' }}>
        <ColorContainer roleKeys={['color']}>
          <EchartsReact option={mapIndexOptions} />
        </ColorContainer>
      </div>
      <div className="action-groups"></div>
      <div className="section-group"></div>
      <div className="section-group"></div>
    </ContentCard>
  );
}
