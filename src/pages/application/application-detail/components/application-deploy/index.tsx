// 应用部署
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/25 16:21

import React, { useContext, useState, useLayoutEffect } from 'react';
import { Tabs } from 'antd';
import FeContext from '@/layouts/basic-layout/fe-context';
import SecondPartyPkg from '../second-party-pkg';
import DeployContent from './deploy-content';
import { IProps } from './types';
import './index.less';

const { TabPane } = Tabs;
const rootCls = 'app-deploy-compo';

export default function ApplicationDeploy(props: IProps) {
  const {
    location: {
      query: { appCode, isClient },
    },
  } = props;
  const { envData } = useContext(FeContext);

  const [tabActive, setTabActive] = useState(sessionStorage.getItem('__init_env_tab__') || 'dev');

  useLayoutEffect(() => {
    sessionStorage.setItem('__init_env_tab__', tabActive);
  }, [tabActive]);

  // 二方包直接渲染另一个页面
  if (+isClient! === 1) {
    return <SecondPartyPkg {...props} />;
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
        {envData?.map((item) => (
          <TabPane tab={item.label} key={item.value}>
            <DeployContent
              isActive={item.value === tabActive}
              appCode={appCode}
              envTypeCode={item.value}
              onDeployNextEnvSuccess={() => {
                const i = envData.findIndex((item) => item.value === tabActive);
                setTabActive(envData[i + 1]?.value);
              }}
            />
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
}
