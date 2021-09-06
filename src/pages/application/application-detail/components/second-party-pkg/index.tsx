/**
 * TowPartyPkg
 * @description 二方包
 * @author moting.nq
 * @create 2021-04-15 09:33
 */

import React, { useLayoutEffect, useEffect, useState } from 'react';
import { Tabs } from 'antd';
import { queryEnvTypeData } from '@/layouts/basic-layout/service';
import { getRequest } from '@/utils/request';
import DeployContent from './deploy-content';
import { ContentCard } from '@/components/vc-page-content';

const { TabPane } = Tabs;

export default function TowPartyPkg(props: any) {
  const [tabActive, setTabActive] = useState(sessionStorage.getItem('__init_secondpartypkg_env_tab__') || 'cDev');
  // 环境
  const [envTypeData, setEnvTypeData] = useState<any[]>([]);

  // 环境数据
  const queryEnvDataList = async () => {
    const envResp = await getRequest(queryEnvTypeData, {
      data: { isClient: true },
    });
    const envTypeData = envResp?.data || [];
    setEnvTypeData(
      envTypeData.map((el: any) => ({
        ...el,
        label: el.typeName,
        value: el.typeCode,
      })),
    );
  };

  useEffect(() => {
    queryEnvDataList();
  }, []);

  useLayoutEffect(() => {
    sessionStorage.setItem('__init_secondpartypkg_env_tab__', tabActive);
  }, [tabActive]);

  return (
    <ContentCard noPadding>
      <Tabs onChange={(v) => setTabActive(v)} activeKey={tabActive} type="card">
        {envTypeData?.map((item) => (
          <TabPane tab={item.label} key={item.value}>
            <DeployContent
              env={item.value}
              onDeployNextEnvSuccess={() => {
                const i = envTypeData.findIndex((item) => item.value === tabActive);
                setTabActive(envTypeData[i + 1]?.value || 'cDev');
              }}
            />
          </TabPane>
        ))}
      </Tabs>
    </ContentCard>
  );
}
