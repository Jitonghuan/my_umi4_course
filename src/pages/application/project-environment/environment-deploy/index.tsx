// 应用详情
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/25 17:31

import { useMemo, useEffect, useState } from 'react';
import { history, Link, useLocation, Outlet } from 'umi';
import { Tabs, Spin, Empty, Tag, Badge } from 'antd';
import VCPermission from '@/components/vc-permission';
import PageContainer from '@/components/page-container';
import { FilterCard } from '@/components/vc-page-content';
import { getRequest } from '@/utils/request';
import DetailContext from './context';
import { tabsConfig } from './tab-config';
import { parse } from 'query-string';
import { IProps } from './types';
import { useAppDetail } from '../../hooks';
import { listAppEnv } from '@/pages/application/service';
import './index.less';

const detailPath = '/matrix/application/environment-deploy';
const { TabPane } = Tabs;

// 额外的菜单匹配映射规则
const activeKeyMap: Record<string, any> = {
  addConfig: 'configMgr',
  addLaunchParameters: 'launchParameters',
};

export default function ApplicationDetail(props: IProps) {
  // const { location, children } = props;
  let location: any = useLocation();
  const query: any = parse(location.search);
  const { id: appId, appCode, projectEnvCode, projectEnvName, benchmarkEnvCode } = query || {};
  const [appData, isLoading, queryAppData] = useAppDetail(+appId, appCode);
  const [appEnvDataSource, setAppEnvDataSource] = useState<Record<string, any>[]>([]);
  const tabActiveKey = useMemo(() => {
    const currRoute = /\/([\w-]+)$/.exec(location.pathname)?.[1];
    return activeKeyMap[currRoute!] || currRoute;
  }, [location.pathname]);
  // 页面销毁时清空缓存
  useEffect(() => () => sessionStorage.removeItem('__init_env_tab__'), []);
  let currentUseNacos: any = [];
  let useNacosIndex: any;
  useEffect(() => {
    queryAppEnvData();
  }, []);
  // 查询应用环境数据  获取到的该应用的环境信息用来判断useNacose的值
  const queryAppEnvData = () => {
    getRequest(listAppEnv, {
      data: {
        appCode,
        categoryCode: appData?.appCategoryCode,
      },
    }).then((result) => {
      if (result?.success) {
        let dataSource = result?.data;
        setAppEnvDataSource(dataSource);
      }
    });
  };

  appEnvDataSource.map((item: any) => {
    currentUseNacos.push(item.useNacos);
  });
  if (currentUseNacos?.includes(1)) {
    useNacosIndex = true;
  }

  // 过滤掉不显示的子页面 tab
  const filteredTabList = useMemo(() => {
    if (!appData) return [];

    // 是否为非二方包后端应用
    const isBackendAndNotClient = appData.isClient !== 1 && appData.appType === 'backend';
    // 是否为前端应用
    const isFrontend = appData.appType === 'frontend';

    return Object.keys(tabsConfig).filter((key) => {
      // 只有 HBOS、HMOS、健康运营，数据中台可以显示配置管理 和 启动参数
      // if (key === 'configMgr' || key === 'launchParameters')
      if (key === 'configMgr') {
        return isBackendAndNotClient && (useNacosIndex || localStorage.getItem('SHOW_CONFIG') === '1');
      }
      // 二方包 tab
      if (key === 'secondPartyPkg') {
        return appData.isContainClient === 1;
      }
      // 后端非二方项目
      if (['monitor', 'AppParameters', 'deployInfo'].includes(key)) {
        return isBackendAndNotClient;
      }
      // 仅后端项目有
      if (['changeDetails'].includes(key)) {
        return !isFrontend;
      }
      // 仅前端项目有
      if (['feVersion'].includes(key)) {
        return isFrontend;
      }
      // 仅微前端主工程才有路由配置
      if (key === 'routeConfig') {
        return isFrontend && appData.projectType === 'micro' && appData.microFeType === 'mainProject';
      }

      return true;
    });
  }, [appData, useNacosIndex]);

  // 默认重定向到【概述】路由下
  if (location.pathname === detailPath) {
    return (
      history.replace({
        pathname: `${location.pathname}/appDeploy`,
        // query: { ...location.query },
        search: location.search
      }),
      null
    );
  }

  // 没有数据的时整体不显示，防止出现空数据异常
  if (!appData && isLoading) {
    return (
      <PageContainer>
        <div className="block-loading">
          <Spin tip="数据初始化中" />
        </div>
      </PageContainer>
    );
  }

  if (!appData && !isLoading) {
    return (
      <PageContainer>
        <div className="block-empty">
          <Empty
            description={
              <span>
                未找到应用，返回 <Link to="/matrix/application/project-environment">项目环境列表页</Link>
              </span>
            }
          />
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
              search: location.search
              // query: { ...location.query },
            });
          }}
          tabBarExtraContent={
            <div className="tab-right-extra">
              <Badge status="processing" text="当前项目环境：" />
              <h4>{projectEnvCode}</h4>
              <span>
                <Tag color="blue">{projectEnvName}</Tag>
              </span>
              ｜当前应用：
              <h4>{appData?.appCode}</h4>
              <Tag color="volcano">
                {/* <CloseCircleTwoTone style={{fontSize:14}} /> */}
                <a
                  onClick={() => {
                    history.push({
                      pathname: '/matrix/application/environment-detail',
                    },
                      {
                        envCode: projectEnvCode,
                        benchmarkEnvCode: benchmarkEnvCode,
                      },
                    );
                  }}
                >
                  返回项目环境
                </a>
              </Tag>
              {/* <span>{appData?.appName}</span> */}
            </div>
          }
        >
          {filteredTabList.map((key) => (
            <TabPane tab={tabsConfig[key]} key={key} />
          ))}
        </Tabs>
      </FilterCard>
      <DetailContext.Provider value={{ appData, queryAppData, projectEnvCode, projectEnvName, benchmarkEnvCode }}>
        <VCPermission code={window.location.pathname} isShowErrorPage>
          <Outlet />
        </VCPermission>
      </DetailContext.Provider>
    </PageContainer>
  );
}
