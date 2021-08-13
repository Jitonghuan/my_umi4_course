/**
 * ApplicationDeploy
 * @description 应用部署
 * @author moting.nq
 * @create 2021-04-15 09:33
 */

import React, { useContext, useState, useEffect, useLayoutEffect } from 'react';
import { Tabs, Button } from 'antd';
import FeContext from '@/layouts/basic-layout/fe-context';
import { queryEnvData } from '@/layouts/basic-layout/service';
import { getRequest } from '@/utils/request';
import SecondPartyPkg from '../second-party-pkg';
import DeployContent from './deploy-content';
import { IProps } from './types';
import './index.less';

const { TabPane } = Tabs;
const rootCls = 'app-deploy-compo';

export default function ApplicationDeploy(props: IProps) {
  const {
    location: {
      query: { appCode, id: appId, isClient },
    },
  } = props;
  const isSecondPartyPkg = Number(isClient) === 1;

  const { envData } = useContext(FeContext);
  const [tabActive, setTabActive] = useState(
    sessionStorage.getItem('__init_env_tab__') || (isSecondPartyPkg ? 'cDev' : 'dev'),
  );
  // 二方包环境
  const [envSecondPartyPkgData, setEnvSecondPartyPkgData] = useState<any[]>([]);

  // 环境数据
  const queryEnvDataList = async () => {
    const envResp = await getRequest(queryEnvData, {
      data: { isClient: true },
    });
    const envData = envResp?.data || [];
    setEnvSecondPartyPkgData(
      envData.map((el: any) => ({
        ...el,
        label: el.typeName,
        value: el.typeCode,
      })),
    );
  };

  useEffect(() => {
    if (isSecondPartyPkg) {
      queryEnvDataList();
    }
  }, [isClient]);

  useLayoutEffect(() => {
    sessionStorage.setItem('__init_env_tab__', tabActive);
  }, [tabActive]);

  const curEnvData = isSecondPartyPkg ? envSecondPartyPkgData : envData;

  if (+isClient === 1) {
    return <SecondPartyPkg {...(props as any)} />;
  }

  return (
    <div className={rootCls}>
      <Tabs
        className={`${rootCls}__tabs`}
        onChange={(v) => setTabActive(v)}
        activeKey={tabActive}
        type="card"
        tabBarStyle={{ background: '#E6EBF5' }}
      >
        {curEnvData?.map((item) => (
          <TabPane tab={item.label} key={item.value}>
            <DeployContent
              isActive={item.value === tabActive}
              appCode={appCode}
              envTypeCode={item.value}
              onDeployNextEnvSuccess={() => {
                const i = curEnvData.findIndex((item) => item.value === tabActive);
                setTabActive(curEnvData[i + 1]?.value);
              }}
            />
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
}
