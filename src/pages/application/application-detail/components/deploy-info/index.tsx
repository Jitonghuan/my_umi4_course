// 部署信息
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/18 09:45

import React, { useState, useEffect, useContext, useMemo } from 'react';
import useInterval from '@/pages/application/application-detail/components/application-deploy/deploy-content/useInterval';
import { Tabs, Modal } from 'antd';
import appConfig from '@/app.config';
import { ContentCard } from '@/components/vc-page-content';
import DetailContext from '@/pages/application/application-detail/context';
import { useAppDeployInfo, useAppChangeOrder } from './hooks';
import { useAppEnvCodeData } from '@/pages/application/hooks';
import { getRequest } from '@/utils/request';
import { listAppEnvType } from '@/common/apis';
import DeployInfoContent from './deployInfo-content';
import { history, useLocation } from 'umi';
import { parse, stringify } from 'query-string';
import './index.less';
const { TabPane } = Tabs;
export default function AppDeployInfo(props: any) {
  let location = useLocation();
  const query = parse(location.search);
  const type = query?.type || "";
  const viewLogEnv = query?.viewLogEnv || "";
  const viewLogEnvType = query?.viewLogEnvType || "";
  const { appData } = useContext(DetailContext);
  const [envTypeData, setEnvTypeData] = useState<IOption[]>([]);
  const [appEnvCodeData, isLoading] = useAppEnvCodeData(appData?.appCode);
  const [currEnvCode, setCurrEnv] = useState<string>();
  const [deployData, deployDataLoading, reloadDeployData] = useAppDeployInfo(currEnvCode, appData?.deploymentName);
  let env = appConfig.IS_Matrix === 'public' ? '' : 'prod';
  const [tabActive, setTabActive] = useState<any>(
    query.activeTab || localStorage.getItem('__init_env_tab__') || env,
  );
  useEffect(() => {
    localStorage.setItem('__init_env_tab__', tabActive || env);
    const newQuery = {
      ...query,
      activeTab: tabActive
    }
    history.replace({
      pathname: location.pathname,
      search: stringify(newQuery),
    },
    );
  }, [tabActive])

  const [changeOrderData, changeOrderDataLoading, reloadChangeOrderData] = useAppChangeOrder(
    currEnvCode,
    appData?.deploymentName,
  );

  const changeTab = (value: any) => {
    setTabActive(value);
  };

  const envList = useMemo(() => appEnvCodeData['prod'] || [], [appEnvCodeData]);
  const warning = () => {
    Modal.warning({
      title: '该应用未绑定环境！',
      content: '请先为该应用绑定环境哦...',
    });
  };
  useEffect(() => {
    queryData();
  }, []);
  const queryData = async () => {
    let envTypeDataSource: any = [];
    await getRequest(listAppEnvType, {
      data: { appCode: appData?.appCode, isClient: false },
    }).then((result) => {
      if (result?.success) {
        const { data } = result || [];
        envTypeDataSource = result?.data;

        if (result?.data?.length < 1 || !result?.data?.length) {
          warning()
          return

        }
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
        let currentTabActive =
          localStorage.__init_env_tab__ &&
            envTypeDataSource.some((item: any) => item.typeCode === localStorage.__init_env_tab__)
            ? localStorage.getItem('__init_env_tab__')
            : next[0]?.typeCode || env;
        setTabActive(currentTabActive);

      }

    });

  };

  useEffect(() => {
    if (envList.length && !currEnvCode) {
      setCurrEnv(envList[0].envCode);
    }
  }, [envList]);
  //定义定时器方法
  const intervalFunc = () => {
    reloadDeployData(false);
  };
  // 定时请求发布内容
  const { getStatus: getTimerStatus, handle: timerHandle } = useInterval(intervalFunc, 3000, { immediate: false });
  useEffect(() => {
    timerHandle('do', true);
  }, [currEnvCode, appData]);

  return (
    <ContentCard noPadding className="page-app-deploy-info">
      <Tabs onChange={changeTab} activeKey={tabActive} type="card">
        {envTypeData?.map((item) => (
          <TabPane tab={item.label} key={item.value}>
            <DeployInfoContent
              isActive={item.value === tabActive}
              envTypeCode={item.value}
              onDeployNextEnvSuccess={() => {
                const i = envTypeData.findIndex((item) => item.value === tabActive);
                setTabActive(envTypeData[i + 1]?.value);
              }}
              intervalStop={() => {
                timerHandle('stop');
              }}
              intervalStart={() => {
                timerHandle('do', true);
              }}
              viewLogEnv={viewLogEnv}
              type={type}
              viewLogEnvType={viewLogEnvType}
            />
          </TabPane>
        ))}
      </Tabs>
    </ContentCard>
  );
}
