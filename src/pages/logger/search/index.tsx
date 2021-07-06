// 日志搜索
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/06/23 09:25
// TODO iframe 加一个 onload，页面显示 loading 中的提示

import React, { useState } from 'react';
import { Form, Select, Spin } from 'antd';
import MatrixPageContent from '@/components/matrix-page-content';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import { useEnvOptions, useLogStoreOptions, useFrameUrl } from './hooks';
import './index.less';

export default function LoggerSearch() {
  const [envCode, setEnvCode] = useState<string>();
  const [logStore, setLogStore] = useState<string>();
  const [envOptions] = useEnvOptions();
  const [logStoreOptions] = useLogStoreOptions();
  const [frameUrl, frameLoading] = useFrameUrl(envCode, logStore);

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
        </Form>
      </FilterCard>
      <ContentCard className="page-logger-search-content">
        {frameLoading ? <Spin /> : null}
        {!frameLoading && (!envCode || !logStore) ? <div className="empty-holder">请选择环境和日志库</div> : null}
        {!frameLoading && envCode && logStore && !frameUrl ? (
          <div className="empty-holder">未找到日志检索页面</div>
        ) : null}
        {!frameLoading && frameUrl ? <iframe src={frameUrl} frameBorder="0" /> : null}
      </ContentCard>
    </MatrixPageContent>
  );
}
