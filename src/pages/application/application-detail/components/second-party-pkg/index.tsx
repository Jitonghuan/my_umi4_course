/**
 * TowPartyPkg
 * @description 二方包
 * @author moting.nq
 * @create 2021-04-15 09:33
 */

import React, { useLayoutEffect, useEffect, useState } from 'react';
import { Tabs } from 'antd';
import { queryEnvData } from '@/layouts/basic-layout/service';
import { getRequest } from '@/utils/request';
import DeployContent from './deploy-content';
import { ContentCard } from '@/components/vc-page-content';
import { IProps } from './types';
import './index.less';

const { TabPane } = Tabs;
const rootCls = 'second-party-pkg';

export default function TowPartyPkg(props: IProps) {
  const {
    location: {
      query: { appCode },
    },
  } = props;

  const [tabActive, setTabActive] = useState(sessionStorage.getItem('__init_secondpartypkg_env_tab__') || 'cDev');
  // 环境
  const [envData, setEnvData] = useState<any[]>([]);

  // 环境数据
  const queryEnvDataList = async () => {
    const envResp = await getRequest(queryEnvData, {
      data: { isClient: true },
    });
    const envData = envResp?.data || [];
    setEnvData(
      envData.map((el: any) => ({
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
    <ContentCard noPadding className={rootCls}>
      <Tabs className={`${rootCls}__tabs`} onChange={(v) => setTabActive(v)} activeKey={tabActive} type="card">
        {envData?.map((item) => (
          <TabPane tab={item.label} key={item.value}>
            <DeployContent
              appCode={appCode}
              env={item.value}
              onDeployNextEnvSuccess={() => {
                const i = envData.findIndex((item) => item.value === tabActive);
                setTabActive(envData[i + 1]?.value || 'cDev');
              }}
            />
          </TabPane>
        ))}
      </Tabs>
    </ContentCard>
  );
}
