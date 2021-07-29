// 集群看板
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/27 14:34

import React, { useState, useRef } from 'react';
import { Button } from 'antd';
import MatrixPageContent from '@/components/matrix-page-content';
import { ContentCard } from '@/components/vc-page-content';
import HeaderTabs from '../_components/header-tabs';
import './index.less';

const frameURL =
  'http://kibana-zy-noauth.cfuture.shop/app/kibana#/dashboard/4784a610-eac3-11eb-8842-7b62ea642b25?embed=true&_g=(filters%3A!()%2CrefreshInterval%3A(pause%3A!t%2Cvalue%3A0)%2Ctime%3A(from%3Anow-1m%2Cto%3Anow))';

export default function Dashboard(props: any) {
  const [key, setKey] = useState(1);
  const frameRef = useRef<any>();

  return (
    <MatrixPageContent>
      <HeaderTabs activeKey="dashboard" history={props.history} />
      <ContentCard className="cluster-dashboard">
        <iframe ref={frameRef} key={key} src={frameURL} frameBorder="0"></iframe>
        <div className="action-group">
          <Button type="primary" ghost onClick={() => frameRef.current?.requestFullscreen()}>
            全屏显示
          </Button>
          <Button type="primary" onClick={() => setKey(Date.now())}>
            刷新页面
          </Button>
        </div>
      </ContentCard>
    </MatrixPageContent>
  );
}
