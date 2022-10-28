// 部署信息
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/18 09:45

import React, { useState, useEffect, useContext, useMemo } from 'react';
import useInterval from '@/pages/application/application-detail/components/application-deploy/deploy-content/useInterval';
import { Tabs } from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import DetailContext from '../../context';
import { useLocation } from 'umi';
import { parse } from 'query-string';
import { useAppDeployInfo, } from './hooks';
import { useAppEnvCodeData } from '@/pages/application/hooks';
import { getRequest } from '@/utils/request';
import { listAppEnvType } from '@/common/apis';
import DeployInfoContent from './deployInfo-content';
import './index.less';
const { TabPane } = Tabs;
export default function AppDeployInfo(props: any) {
  let location: any = useLocation();
  const query: any = parse(location.search);
  const { type, viewLogEnv, viewLogEnvType } = query;
  const { appData } = useContext(DetailContext);
  const [envTypeData, setEnvTypeData] = useState<IOption[]>([]);
  const [appEnvCodeData, isLoading] = useAppEnvCodeData(appData?.appCode);
  const [currEnvCode, setCurrEnv] = useState<string>();
  const [deployData, deployDataLoading, reloadDeployData] = useAppDeployInfo(currEnvCode, appData?.deploymentName);
  try {
    localStorage.__init_env_tab__ ? localStorage.getItem('__init_env_tab__') : 'dev';
  } catch (error) {
    localStorage.setItem('__init_env_tab__', 'dev');
  }

  const envList = useMemo(() => appEnvCodeData['prod'] || [], [appEnvCodeData]);
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
      <DeployInfoContent
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
    </ContentCard>
  );
}
