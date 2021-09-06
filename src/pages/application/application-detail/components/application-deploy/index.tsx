// 应用部署
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/25 16:21

import React, { useContext, useState, useLayoutEffect } from 'react';
import { Tabs } from 'antd';
import FeContext from '@/layouts/basic-layout/fe-context';
import { ContentCard } from '@/components/vc-page-content';
import DetailContext from '../../context';
import SecondPartyPkg from '../second-party-pkg';
import DeployContent from './deploy-content';

const { TabPane } = Tabs;

export default function ApplicationDeploy(props: any) {
  const { appData } = useContext(DetailContext);
  const { envTypeData } = useContext(FeContext);
  const [tabActive, setTabActive] = useState(sessionStorage.getItem('__init_env_tab__') || 'dev');

  useLayoutEffect(() => {
    sessionStorage.setItem('__init_env_tab__', tabActive);
  }, [tabActive]);

  // 二方包直接渲染另一个页面
  if (+appData?.isClient! === 1) {
    return <SecondPartyPkg {...props} />;
  }

  return (
    <ContentCard noPadding>
      <Tabs onChange={(v) => setTabActive(v)} activeKey={tabActive} type="card">
        {envTypeData?.map((item) => (
          <TabPane tab={item.label} key={item.value}>
            <DeployContent
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
