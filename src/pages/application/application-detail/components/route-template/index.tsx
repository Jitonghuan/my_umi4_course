// 路由模板
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/02 14:21

import React, { useState, useContext, useEffect, useLayoutEffect, useCallback, useMemo } from 'react';
import { Select, Button, Tabs, Spin } from 'antd';
import FeContext from '@/layouts/basic-layout/fe-context';
import { ContentCard } from '@/components/vc-page-content';
import DetailContext from '../../context';
import AceEditor from '@/components/ace-editor';
import { useAppEnvCodeData, useRouteItemData } from './hooks';
import './index.less';

export default function RouteTemplate() {
  const { appData } = useContext(DetailContext);
  const { envData } = useContext(FeContext);
  const [tabActive, setTabActive] = useState(sessionStorage.getItem('__init_env_tab__') || 'dev');
  const [appEnvCodeData] = useAppEnvCodeData(appData?.appCode);
  const [envCode, setEnvCode] = useState<string>();
  const [routeTemplate, isLoading] = useRouteItemData(appData!, envCode);
  const [editValue, setEditValue] = useState<string>();

  useLayoutEffect(() => {
    sessionStorage.setItem('__init_env_tab__', tabActive);
  }, [tabActive]);

  useEffect(() => {
    setEditValue(routeTemplate?.value);
  }, [routeTemplate]);

  const handleTabChange = useCallback((next) => {
    setTabActive(next);
    setEnvCode(undefined);
    setEditValue('');
  }, []);

  const envCodeOptions: IOption[] = useMemo(() => {
    const next = appEnvCodeData[tabActive] || [];
    return next.map((n) => ({
      label: `${n.envName} (${n.envCode})`,
      value: n.envCode,
    }));
  }, [tabActive, appEnvCodeData]);

  const editorLanguage = useMemo(() => {
    const { routeFile } = appData!;
    if (/\.json$/.test(routeFile!)) return 'json';
    if (/\.(tpl|html)$/.test(routeFile!)) return 'html';

    return 'text';
  }, [appData]);

  return (
    <ContentCard noPadding className="page-route-template">
      <Tabs onChange={handleTabChange} activeKey={tabActive} type="card">
        {envData?.map((item) => (
          <Tabs.TabPane tab={item.label} key={item.value} />
        ))}
      </Tabs>
      <div className="tab-content">
        <div className="table-caption">
          <div className="caption-left">
            <span>发布环境：</span>
            <Select
              value={envCode}
              onChange={(next) => setEnvCode(next)}
              placeholder="请选择环境"
              style={{ width: 300 }}
              options={envCodeOptions}
            />
          </div>
          <div className="caption-right">
            <Button type="default" size="large" disabled={!envCode}>
              重置
            </Button>
            <Button type="primary" size="large" disabled={!envCode}>
              保存
            </Button>
          </div>
        </div>
        <Spin spinning={isLoading}>
          <AceEditor
            readOnly={!envCode}
            mode={editorLanguage}
            height="100%"
            value={editValue}
            onChange={(n) => setEditValue(n)}
          />
        </Spin>
      </div>
    </ContentCard>
  );
}
