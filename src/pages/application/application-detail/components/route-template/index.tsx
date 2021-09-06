// 路由模板
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/02 14:21

import React, { useState, useContext, useEffect, useLayoutEffect, useCallback, useMemo } from 'react';
import { Select, Button, Tabs, Spin, Empty, Modal, message } from 'antd';
import FeContext from '@/layouts/basic-layout/fe-context';
import { ContentCard } from '@/components/vc-page-content';
import DetailContext from '../../context';
import AceEditor from '@/components/ace-editor';
import * as APIS from '@/pages/application/service';
import { putRequest, postRequest } from '@/utils/request';
import { useRouteItemData } from './hooks';
import { useAppEnvCodeData } from '@/pages/application/hooks';
import './index.less';

export default function RouteTemplate() {
  const { appData } = useContext(DetailContext);
  const { envTypeData } = useContext(FeContext);
  const [tabActive, setTabActive] = useState(sessionStorage.getItem('__init_env_tab__') || 'dev');
  const [appEnvCodeData] = useAppEnvCodeData(appData?.appCode);
  const [envCode, setEnvCode] = useState<string>();
  const [routeTemplate, isLoading, reloadData] = useRouteItemData(appData!, envCode);
  const [editValue, setEditValue] = useState<string>();

  useLayoutEffect(() => {
    sessionStorage.setItem('__init_env_tab__', tabActive);
  }, [tabActive]);

  useEffect(() => {
    setEditValue(routeTemplate?.value);
  }, [routeTemplate]);

  const handleTabChange = useCallback((next: string) => {
    setTabActive(next);
    setEditValue('');
    setEnvCode(undefined);
  }, []);

  const envCodeOptions: IOption[] = useMemo(() => {
    const next = appEnvCodeData[tabActive] || [];
    return next.map((n) => ({
      label: `${n.envName} (${n.envCode})`,
      value: n.envCode,
    }));
  }, [tabActive, appEnvCodeData]);

  useEffect(() => {
    if (!envCode && envCodeOptions?.length) {
      setEnvCode(envCodeOptions[0].value);
    }
  }, [envCodeOptions]);

  const editorLanguage = useMemo(() => {
    const { routeFile } = appData!;
    if (/\.json$/.test(routeFile!)) return 'json';
    if (/\.(tpl|html)$/.test(routeFile!)) return 'html';

    return 'text';
  }, [appData]);

  // 重置模板
  const handleReset = useCallback(() => {
    setEditValue(routeTemplate?.value || '');
  }, [routeTemplate]);

  // 提交数据
  const handleSubmit = useCallback(() => {
    Modal.confirm({
      title: '操作确认',
      content: `确定要修改吗？（下次发布至 ${envCode} 环境时生效）`,
      onOk: async () => {
        const payload = {
          appCode: appData?.appCode,
          appCategoryCode: appData?.appCategoryCode,
          envCode,
          value: editValue,
        };

        if (!!routeTemplate?.id) {
          await putRequest(APIS.updateFeRouteTemplate, {
            data: {
              id: routeTemplate.id,
              ...payload,
            },
          });
        } else {
          await postRequest(APIS.createFeRouteTemplate, {
            data: payload,
          });
        }

        message.success(`保存成功！下次发布至 ${envCode} 环境时生效`);
        reloadData();
      },
    });
  }, [appData, envCode, routeTemplate, editValue]);

  return (
    <ContentCard noPadding className="page-route-template">
      <Tabs onChange={handleTabChange} activeKey={tabActive} type="card">
        {envTypeData?.map((item) => (
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
            <Button type="default" size="large" disabled={!envCode} onClick={handleReset}>
              重置
            </Button>
            <Button type="primary" size="large" disabled={!envCode} onClick={handleSubmit}>
              保存
            </Button>
          </div>
        </div>

        {envCode ? (
          <Spin spinning={isLoading}>
            <AceEditor mode={editorLanguage} height="100%" value={editValue} onChange={(n) => setEditValue(n)} />
          </Spin>
        ) : (
          <Empty description="请选择发布环境" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </div>
    </ContentCard>
  );
}
