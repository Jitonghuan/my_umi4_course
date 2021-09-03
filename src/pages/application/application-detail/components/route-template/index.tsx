// 路由模板
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/02 14:21

import React, { useState, useContext, useEffect, useLayoutEffect, useCallback, useMemo } from 'react';
import { Select, Form, Table, Button, Tabs } from 'antd';
import FeContext from '@/layouts/basic-layout/fe-context';
import { ContentCard } from '@/components/vc-page-content';
import DetailContext from '../../context';
import AceEditor from '@/components/ace-editor';
import './index.less';

export default function RouteTemplate() {
  const { appData } = useContext(DetailContext);
  const { envData } = useContext(FeContext);
  const [tabActive, setTabActive] = useState(sessionStorage.getItem('__init_env_tab__') || 'dev');
  const [form] = Form.useForm();

  useLayoutEffect(() => {
    sessionStorage.setItem('__init_env_tab__', tabActive);
  }, [tabActive]);

  const editorLanguage = useMemo(() => {
    const { routeFile } = appData!;
    if (/\.json$/.test(routeFile!)) return 'json';
    if (/\.(tpl|html)$/.test(routeFile!)) return 'html';

    return 'text';
  }, [appData]);

  return (
    <ContentCard noPadding className="page-route-template">
      <Tabs onChange={(v) => setTabActive(v)} activeKey={tabActive} type="card">
        {envData?.map((item) => (
          <Tabs.TabPane tab={item.label} key={item.value} />
        ))}
      </Tabs>

      <Form form={form} layout="inline">
        <Form.Item label="发布环境"></Form.Item>
      </Form>
    </ContentCard>
  );
}
