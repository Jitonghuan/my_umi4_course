/**
 * ApplicationDeploy
 * @description 应用部署
 * @author moting.nq
 * @create 2021-04-15 09:33
 */

import React, { useContext } from 'react';
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

  return (
    <div className={rootCls}>
      <Tabs
        className={`${rootCls}__tabs`}
        // onChange={this.onChange}
        // activeKey={this.state.activeKey}
        type="card"
        tabBarStyle={{ background: '#E6EBF5' }}
      >
        {envData?.map((item) => (
          <TabPane tab={item.envName} key={item.envCode}>
            <DeployContent env={item.envCode} appCode={appCode} appId={appId} />
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
};

ApplicationDeploy.defaultProps = {};

export default ApplicationDeploy;
