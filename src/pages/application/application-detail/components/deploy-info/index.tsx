// 部署信息
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/18 09:45

import React, { useState, useEffect, useContext, useRef, useMemo } from 'react';
import { Tabs } from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import DetailContext from '@/pages/application/application-detail/context';
import { useAppDeployInfo, useAppChangeOrder } from './hooks';
import { useAppEnvCodeData } from '@/pages/application/hooks';
import { getRequest } from '@/utils/request';
import { listAppEnvType } from '@/common/apis';
import DeployInfoContent from './deployInfo-content';
import './index.less';
const { TabPane } = Tabs;
export default function AppDeployInfo() {
  const { appData } = useContext(DetailContext);
  const [envTypeData, setEnvTypeData] = useState<IOption[]>([]);
  const [appEnvCodeData, isLoading] = useAppEnvCodeData(appData?.appCode);
  const [currEnvCode, setCurrEnv] = useState<string>();
  const [deployData, deployDataLoading, reloadDeployData] = useAppDeployInfo(currEnvCode, appData?.deploymentName);
  const [tabActive, setTabActive] = useState(localStorage.getItem('__init_env_tab__') || 'dev');
  const [changeOrderData, changeOrderDataLoading, reloadChangeOrderData] = useAppChangeOrder(
    currEnvCode,
    appData?.deploymentName,
  );
  const intervalRef = useRef<any>();
  const changeTab = (value: any) => {
    setTabActive(value);
    localStorage.setItem('__init_env_tab__', value);
  };

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

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      reloadDeployData(false);
      reloadChangeOrderData(false);
    }, 3000);

    return () => {
      clearInterval(intervalRef.current);
    };
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
            />
          </TabPane>
        ))}
      </Tabs>
    </ContentCard>
  );
}
