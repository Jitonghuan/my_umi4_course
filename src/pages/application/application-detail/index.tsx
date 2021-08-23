/**
 * ApplicationDetail
 * @description 应用详情
 * @author moting.nq
 * @create 2021-04-09 18:39
 */

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { history } from 'umi';
import { Tabs, Spin } from 'antd';
import VCPermission from '@/components/vc-permission';
import MatrixPageContent from '@/components/matrix-page-content';
import { FilterCard } from '@/components/vc-page-content';
import DetailContext, { ContextTypes } from './context';
import { tabsConfig } from './tab-config';
import { queryApps } from '../service';
import { IProps } from './types';
import './index.less';

const detailPath = '/matrix/application/detail';
const { TabPane } = Tabs;

// 额外的菜单匹配映射规则
const activeKeyMap: Record<string, any> = {
  addConfig: 'configMgr',
  addLaunchParameters: 'launchParameters',
};

export default function ApplicationDetail(props: IProps) {
  const { location, children } = props;
  const appId = location.query?.id;
  const [appData, setAppData] = useState<ContextTypes['appData']>();

  const tabActiveKey = useMemo(() => {
    const currRoute = /\/([\w-]+)$/.exec(props.location.pathname)?.[1];
    return activeKeyMap[currRoute!] || currRoute;
  }, [location.pathname]);

  // 请求应用数据
  const queryAppData = useCallback(() => {
    queryApps({
      id: +appId,
      pageIndex: 1,
      pageSize: 10,
    }).then((res: any) => {
      setAppData(res?.list?.[0]);
    });
  }, [appId]);

  useEffect(() => {
    if (!appId) {
      setAppData(undefined);
      return;
    }
    queryAppData();

    // 每次切换进来需要重置 tab 缓存
    sessionStorage.removeItem('__init_env_tab__');
  }, [appId]);

  // 过滤掉不显示的 tab
  const filteredTabList = useMemo(() => {
    if (!appData) return [];

    return Object.keys(tabsConfig).filter((key) => {
      // 只有 HBOS 才显示 配置管理 和 启动参数
      // if (key === 'configMgr' || key === 'launchParameters')
      if (key === 'configMgr') {
        return appData.appCategoryCode === 'hbos' || localStorage.getItem('SHOW_CONFIG') === '1';
      }

      if (key === 'secondPartyPkg') {
        return appData.isContainClient === 1;
      }

      if (key === 'monitor') {
        return appData.isClient !== 1 && appData.appType === 'backend';
      }
      if (key === 'AppParameters') {
        return appData.isClient !== 1 && appData.appType === 'backend';
      }

      return true;
    });
  }, [appData]);

  // 默认重定向到【概述】路由下
  if (location.pathname === detailPath) {
    return (
      history.replace({
        pathname: `${location.pathname}/overview`,
        query: { ...location.query },
      }),
      null
    );
  }

  // 没有数据的时整体不显示，防止出现空数据异常
  if (!appData) {
    return (
      <MatrixPageContent>
        <div className="block-loading">
          <Spin tip="数据初始化中" />
        </div>
      </MatrixPageContent>
    );
  }

  return (
    <MatrixPageContent className="application-detail-page">
      <FilterCard className="layout-compact">
        <Tabs
          activeKey={tabActiveKey}
          onChange={(key) => {
            history.replace({
              pathname: `${detailPath}/${key}`,
              query: { ...location.query },
            });
          }}
          tabBarExtraContent={
            <div className="tab-right-extra">
              <h4>{appData?.appCode}</h4>
              <span>{appData?.appName}</span>
            </div>
          }
        >
          {filteredTabList.map((key) => (
            <TabPane tab={tabsConfig[key]} key={key} />
          ))}
        </Tabs>
      </FilterCard>

      <DetailContext.Provider value={{ appData, queryAppData }}>
        <VCPermission code={window.location.pathname} isShowErrorPage>
          {children}
        </VCPermission>
      </DetailContext.Provider>
    </MatrixPageContent>
  );
}
