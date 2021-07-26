// 日志搜索
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/06/23 09:25

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Form, Select, Spin, Button } from 'antd';
import MatrixPageContent from '@/components/matrix-page-content';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import { useEnvOptions, useLogStoreOptions, useFrameUrl } from './hooks';
import './index.less';

export default function LoggerSearch(props: any) {
  const [envCode, setEnvCode] = useState<string>();
  const [logStore, setLogStore] = useState<string>();
  const [envOptions] = useEnvOptions();
  const [logStoreOptions] = useLogStoreOptions();
  const [frameUrl, urlLoading] = useFrameUrl(envCode, logStore);
  const [framePending, setFramePending] = useState(false);
  const timmerRef = useRef<any>();
  const frameRef = useRef<any>();

  useEffect(() => {
    if (frameUrl) {
      setFramePending(true);
    }
  }, [frameUrl]);

  const handleFrameComplete = () => {
    clearTimeout(timmerRef.current);

    timmerRef.current = setTimeout(() => {
      setFramePending(false);
    }, 500);
  };

  const handleFullScreen = useCallback(() => {
    frameRef.current?.requestFullscreen();
  }, []);

  return (
    <MatrixPageContent>
      <FilterCard>
        <Form layout="inline">
          <Form.Item label="环境Code">
            <Select
              value={envCode}
              onChange={(n) => setEnvCode(n)}
              options={envOptions}
              style={{ width: 200 }}
              placeholder="请选择环境"
            />
          </Form.Item>
          <Form.Item label="日志库">
            <Select
              value={logStore}
              onChange={(n) => setLogStore(n)}
              options={logStoreOptions}
              style={{ width: 200 }}
              placeholder="请选择日志库"
            />
          </Form.Item>
          <s className="flex-air"></s>
          {!urlLoading && frameUrl && !framePending ? (
            <Button type="primary" onClick={handleFullScreen}>
              全屏显示
            </Button>
          ) : null}
        </Form>
      </FilterCard>
      <ContentCard className="page-logger-search-content">
        {urlLoading || framePending ? (
          <div className="loading-wrapper">
            <Spin tip="加载中" />
          </div>
        ) : null}
        {!urlLoading && (!envCode || !logStore) ? <div className="empty-holder">请选择环境和日志库</div> : null}
        {!urlLoading && envCode && logStore && !frameUrl ? (
          <div className="empty-holder">未找到日志检索页面</div>
        ) : null}
        {!urlLoading && frameUrl ? (
          <iframe onLoad={handleFrameComplete} src={frameUrl} frameBorder="0" ref={frameRef} />
        ) : null}
      </ContentCard>
    </MatrixPageContent>
  );
}
