// 集群看板
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/27 14:34

import React, { useState, useRef } from 'react';
import { Button, Spin } from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import { useFrameURL } from './hooks';
import './index.less';

export default function Dashboard() {
  const [key, setKey] = useState(1);
  const frameRef = useRef<any>();
  const [frameURL, isLoading] = useFrameURL(key);

  return (
    <ContentCard className="cluster-dashboard">
      <Spin style={{ display: 'block' }} spinning={isLoading}>
        <iframe ref={frameRef} src={frameURL} frameBorder="0"></iframe>
      </Spin>
      <div className="action-group">
        <Button type="primary" ghost onClick={() => frameRef.current?.requestFullscreen()}>
          全屏显示
        </Button>
        <Button type="primary" onClick={() => setKey(Date.now())}>
          刷新页面
        </Button>
      </div>
    </ContentCard>
  );
}
