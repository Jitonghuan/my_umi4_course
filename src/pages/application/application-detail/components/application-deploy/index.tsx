/**
 * ApplicationDeploy
 * @description 应用部署
 * @author moting.nq
 * @create 2021-04-15 09:33
 */

import React, { useContext, useState } from 'react';
import { Tabs, Button } from 'antd';
import FeContext from '@/layouts/basic-layout/FeContext';
import DeployContent from './deploy-content';
import { IProps } from './types';
import './index.less';

const { TabPane } = Tabs;
const rootCls = 'app-deploy-compo';

const ApplicationDeploy = ({
  location: {
    query: { appCode, id: appId },
  },
}: IProps) => {
  const { envData } = useContext(FeContext);

  const [tabActive, setTabActive] = useState('dev');

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
          <TabPane tab={item.envName} key={item.value}>
            <DeployContent
              env={item.value}
              onDeployNextEnvSuccess={() => {
                const i = envData.findIndex((item) => item.value === tabActive);
                setTabActive(envData[i + 1]?.value || 'dev');
              }}
            />
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
};

ApplicationDeploy.defaultProps = {};

export default ApplicationDeploy;
