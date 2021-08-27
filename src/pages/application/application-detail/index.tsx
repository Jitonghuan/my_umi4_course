// 应用详情
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/25 17:31

import React, { useMemo, useEffect } from 'react';
import { history } from 'umi';
import { Tabs, Spin } from 'antd';
import VCPermission from '@/components/vc-permission';
import PageContainer from '@/components/page-container';
import { FilterCard } from '@/components/vc-page-content';
import DetailContext from './context';
import { tabsConfig } from './tab-config';
import { IProps } from './types';
import { useAppDetail } from '../hooks';
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

  const [appData, queryAppData] = useAppDetail(+appId);

  const tabActiveKey = useMemo(() => {
    const currRoute = /\/([\w-]+)$/.exec(props.location.pathname)?.[1];
    return activeKeyMap[currRoute!] || currRoute;
  }, [location.pathname]);

  useEffect(() => {
    // 每次切换进来需要重置 环境 tab 缓存
    sessionStorage.removeItem('__init_env_tab__');
  }, [appId]);

  // 过滤掉不显示的子页面 tab
  const filteredTabList = useMemo(() => {
    if (!appData) return [];

    // 是否为非二方包后端应用
    const isBackendAndNotClient = appData.isClient !== 1 && appData.appType === 'backend';

    return Object.keys(tabsConfig).filter((key) => {
      // 只有 HBOS 才显示 配置管理 和 启动参数
      // if (key === 'configMgr' || key === 'launchParameters')
      if (key === 'configMgr') {
        return (
          isBackendAndNotClient && (appData.appCategoryCode === 'hbos' || localStorage.getItem('SHOW_CONFIG') === '1')
        );
      }
      if (key === 'secondPartyPkg') {
        return appData.isContainClient === 1;
      }
      if (['monitor', 'AppParameters', 'deployInfo'].includes(key)) {
        return isBackendAndNotClient;
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
      <PageContainer>
        <div className="block-loading">
          <Spin tip="数据初始化中" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="application-detail-page">
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
    </PageContainer>
  );
}
