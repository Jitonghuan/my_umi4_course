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
  const eventEchart = (echart: any) => {
    echart.on('click', function (params: any) {
      //    这里的点击是加到全部的节点上 通过数据里的uuid来判断 是不是当前点击的节点或者判断有没有uuid来判断点的是不是➕号
      alert('这里是当前的节点的数据打印在控制台');

      console.log(params);
    });
  };
  return (
    // style={{ backgroundImage: `url(${backgroundImg})` }}

    <ContentCard className="mapdashboards">
      <header>
        <title>流量地图</title>
      </header>
      <div style={{ height: '50rem' }}>
        <ColorContainer roleKeys={['color']}>
          <EchartsReact onChartReady={eventEchart} id="mapIndexID" option={mapIndexOptions} />
        </ColorContainer>
      </div>
      <div className="action-groups"></div>
      <div className="section-group"></div>
      <div className="section-group"></div>
    </ContentCard>
  );
}
