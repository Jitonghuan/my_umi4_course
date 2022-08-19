// 路由模板
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/02 14:21

import React, { useState, useContext, useEffect, useLayoutEffect, useCallback, useMemo } from 'react';
import { Select, Button, Tabs, Spin, Empty, Modal, message } from 'antd';
import { FeContext } from '@/common/hooks';
import { ContentCard } from '@/components/vc-page-content';
import DetailContext from '../../context';
import AceDiff from '@/components/ace-diff';
import * as APIS from '@/pages/application/service';
import { putRequest, postRequest, getRequest } from '@/utils/request';
import { useRouteItemData } from './hooks';
import { useAppEnvCodeData } from '@/pages/application/hooks';
import { listAppEnvType } from '@/common/apis';
import './index.less';

export default function RouteConfig() {
  const { appData } = useContext(DetailContext);
  // const { envTypeData } = useContext(FeContext);
  const [tabActive, setTabActive] = useState(sessionStorage.getItem('__init_env_tab__') || 'dev');
  const [appEnvCodeData] = useAppEnvCodeData(appData?.appCode);
  const [envCode, setEnvCode] = useState<string>();
  const [routeContent, isLoading, reloadData] = useRouteItemData(appData!, envCode);
  const [editValue, setEditValue] = useState<string>();

  useLayoutEffect(() => {
    sessionStorage.setItem('__init_env_tab__', tabActive);
  }, [tabActive]);

  useEffect(() => {
    setEditValue(routeContent?.value || '');
  }, [routeContent]);

  const handleTabChange = useCallback((next: string) => {
    setTabActive(next);
    setEditValue('');
    setEnvCode(undefined);
  }, []);

  const [envTypeData, setEnvTypeData] = useState<IOption[]>([]);
  useEffect(() => {
    queryData();
  }, []);
  const queryData = () => {
    getRequest(listAppEnvType, {
      data: { appCode: appData?.appCode, isClient: false },
    }).then((result) => {
      const { data } = result || [];
      let next: any = [];
      (data || []).map((el: any) => {
        if (el?.typeCode === 'dev') {
          next.push({ ...el, label: el?.typeName, value: el?.typeCode, sortType: 1 });
        }
        if (el?.typeCode === 'test') {
          next.push({ ...el, label: el?.typeName, value: el?.typeCode, sortType: 2 });
        }
        if (el?.typeCode === 'pre') {
          next.push({ ...el, label: el?.typeName, value: el?.typeCode, sortType: 3 });
        }
        if (el?.typeCode === 'prod') {
          next.push({ ...el, label: el?.typeName, value: el?.typeCode, sortType: 4 });
        }
      });
      next.sort((a: any, b: any) => {
        return a.sortType - b.sortType;
      }); //升序
      setEnvTypeData(next);
    });
  };
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
    setEditValue(routeContent?.value || '');
  }, [routeContent]);

  // 提交数据
  const handleSubmit = useCallback(() => {
    Modal.confirm({
      title: '操作确认',
      content: `确定要修改吗？（保存后会立即对 ${envCode} 环境生效！）`,
      onOk: async () => {
        const payload = {
          appCode: appData?.appCode,
          appCategoryCode: appData?.appCategoryCode,
          envCode,
          value: editValue,
        };

        if (!!routeContent?.id) {
          await putRequest(APIS.updateFeRouteConfig, {
            data: {
              id: routeContent.id,
              ...payload,
            },
          });
        } else {
          await postRequest(APIS.createFeRouteConfig, {
            data: payload,
          });
        }

        message.success(`保存成功！请及时到 ${envCode} 环境验证`);
        reloadData();
      },
    });
  }, [appData, envCode, routeContent, editValue]);

  return (
    <ContentCard noPadding className="page-route-template">
      <Tabs onChange={handleTabChange} activeKey={tabActive} type="card">
        {envTypeData?.map((item: any) => (
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
              style={{ width: 300, marginRight: 20 }}
              options={envCodeOptions}
            />
          </div>
          <div className="caption-right">
            <Button size="large" disabled={!envCode} onClick={handleReset}>
              重置
            </Button>
            <Button type="primary" size="large" disabled={!envCode} onClick={handleSubmit}>
              保存
            </Button>
          </div>
        </div>

        {envCode ? (
          <Spin spinning={isLoading}>
            <AceDiff
              originValue={routeContent?.value}
              mode={editorLanguage}
              height="100%"
              value={editValue}
              onChange={(n) => setEditValue(n)}
            />
          </Spin>
        ) : (
          <Empty description="请选择发布环境" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </div>
    </ContentCard>
  );
}
