import React, { useState, useRef, useEffect } from 'react';
import { Button, Spin, Space, Row, Col } from 'antd';
import './index.less';
import { ContentCard } from '@/components/vc-page-content';
import ClusterAChart from './chart-case-Acluster';
import ClusterBChart from './chart-case-Bcluster';
import ABHistorgram from './ABHistogram';
import ClusterTable from './clusterTable';
import { EchartsReact, colorUtil } from '@cffe/fe-datav-components';
import { useABHistogram, useClusterA, useClusterB } from './hook';
import { isNull } from '_@types_lodash@4.14.171@@types/lodash';
const { ColorContainer } = colorUtil.context;
var chartDom = document.getElementById('main');

export default function Dashboards() {
  const echartBig = useRef<any>();
  // clusterAData, loading,timeStamp
  const [clusterAData, clusterALoading, loadClusterA] = useClusterA();
  const [clusterBData, clusterBLoading, loadClusterB] = useClusterB();
  const [histogramData, loading, loadHistogram] = useABHistogram();
  // console.log('加载状态：',clusterALoading)
  useEffect(() => {
    let intervalId = setInterval(() => {
      loadHistogram();
      loadClusterB();
      loadClusterA();
    }, 1000 * 60);
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  return (
    <ContentCard className="cluster-dashboards">
      <div className="action-groups" style={{ textAlign: 'right' }}>
        <Button type="primary" ghost onClick={() => echartBig.current?.requestFullscreen()} style={{ marginRight: 12 }}>
          全屏显示
        </Button>
        <Button
          type="primary"
          onClick={() => {
            loadHistogram(), loadClusterA(), loadClusterB();
          }}
        >
          刷新数据
        </Button>
      </div>
      <div ref={echartBig} style={{ background: '#FFFF' }}>
        <Row>
          <Col span={16}>
            <ABHistorgram data={histogramData} loading={loading} />
            <div className="histogram" style={{ display: 'flex', width: '600px', fontSize: 16 }}>
              <div style={{ flex: 1, textAlign: 'center' }}>A集群</div>
              <div style={{ flex: 1, textAlign: 'center' }}>B集群</div>
            </div>
          </Col>
          <Col span={8}>
            <ClusterTable data={histogramData} loading={loading} />
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
