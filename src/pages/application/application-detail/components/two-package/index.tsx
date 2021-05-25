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
    query: { appCode, id: appId, isContainClient },
  },
}: IProps) => {
  const { envData } = useContext(FeContext);
  const [tabActive, setTabActive] = useState('dev');

  const curEnvData = envData?.filter((el) => {
    if (Number(isContainClient) === 1) {
      // 二方包
      return ['dev', 'prod'].includes(el.typeCode);
    }

    return true;
  });

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
              env={item.value}
              onDeployNextEnvSuccess={() => {
                const i = curEnvData.findIndex(
                  (item) => item.value === tabActive,
                );
                setTabActive(curEnvData[i + 1]?.value || 'dev');
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
