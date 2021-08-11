import React, { useState, useRef, useEffect } from 'react';
import { Button, Spin, Space, Row, Col } from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import * as echarts from 'echarts';
import ClusterAChart from './chart-case-Acluster';
import ClusterBChart from './chart-case-Bcluster';
import ABHistorgram from './ABHistogram';
import ClusterTable from './clusterTable';
import { EchartsReact, colorUtil } from '@cffe/fe-datav-components';
import { useABHistogram, useClusterA, useClusterB } from './hook';
const { ColorContainer } = colorUtil.context;

var chartDom = document.getElementById('main');

export default function Dashboards() {
  const [key, setKey] = useState(1);
  const echartBig = useRef<any>();
  const [chartOptions, setChartOptions] = useState<any>();
  // clusterAData, loading,timeStamp
  const [clusterAData, clusterALoading] = useClusterA();
  const [clusterBData, clusterBLoading] = useClusterB();
  const [histogramData, loading] = useABHistogram();
  useEffect(() => {}, []);
  return (
    <ContentCard className="cluster-dashboards">
      <div className="action-groups" style={{ textAlign: 'right' }}>
        <Button type="primary" ghost onClick={() => echartBig.current?.requestFullscreen()} style={{ marginRight: 12 }}>
          全屏显示
        </Button>
        <Button type="primary" onClick={() => window.location.reload()}>
          刷新页面
        </Button>
      </div>
      <div ref={echartBig} style={{ background: '#FFFF' }}>
        <Row>
          <Col span={16}>
            <ABHistorgram data={histogramData} loading={loading} />
          </Col>
          <Col span={8}>
            <ClusterTable />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <ClusterAChart data={clusterAData} loading={clusterALoading} />
          </Col>

          <Col span={12}>
            <ClusterBChart data={clusterBData} loading={clusterBLoading} />
          </Col>
        </Row>
      </div>
    </ContentCard>
  );
}
