import React, { useState, useRef, useEffect } from 'react';
import { Button, Spin, Row, Col } from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import * as echarts from 'echarts';
import ClusterAChart from './chart-case-Acluster';
import ClusterBChart from './chart-case-Bcluster';
import ABHistorgram from './ABHistogram';
import ClusterTable from './clusterTable';
import { EchartsReact, colorUtil } from '@cffe/fe-datav-components';
const { ColorContainer } = colorUtil.context;

var chartDom = document.getElementById('main');
// var myChart = echarts.init(chartDom);
// import { useFrameURL } from './hooks';

export default function Dashboards() {
  const [key, setKey] = useState(1);
  const frameRef = useRef<any>();
  const [chartOptions, setChartOptions] = useState<any>();
  // const [frameURL, isLoading] = useFrameURL(key);
  useEffect(() => {}, []);
  return (
    <ContentCard className="cluster-dashboards">
      <div className="action-groups">
        <Button type="primary" ghost onClick={() => frameRef.current?.requestFullscreen()}>
          全屏显示
        </Button>
        <Button type="primary" onClick={() => setKey(Date.now())}>
          刷新页面
        </Button>
      </div>
      <Row>
        <Col span={12}>
          <ABHistorgram data={''} />
        </Col>
        <Col span={12}>
          <ClusterTable />
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <ClusterAChart data={''} />
        </Col>

        <Col span={12}>
          <ClusterBChart data={''} />
        </Col>
      </Row>
    </ContentCard>
  );
}
