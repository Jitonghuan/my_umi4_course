/**
 * ApplicationDeploy
 * @description 应用部署
 * @author moting.nq
 * @create 2021-04-15 09:33
 */

import React from 'react';
import { Tabs, Button } from 'antd';
import DeployContent from './deploy-content';
import { IProps } from './types';
import './index.less';

const { TabPane } = Tabs;
const rootCls = 'app-deploy-compo';

const ApplicationDeploy = (props: IProps) => {
  return (
    <div className={rootCls}>
      <Tabs
        className={`${rootCls}__tabs`}
        // onChange={this.onChange}
        // activeKey={this.state.activeKey}
        type="card"
        tabBarStyle={{ background: '#E6EBF5' }}
      >
        <TabPane tab="DEV" key="DEV">
          <DeployContent />
        </TabPane>
        <TabPane tab="TEST" key="TEST">
          TEST
        </TabPane>
        <TabPane tab="POC" key="POC">
          POC
        </TabPane>
        <TabPane tab="PRD" key="PRD">
          PRD
        </TabPane>
      </Tabs>
    </div>
  );
};

ApplicationDeploy.defaultProps = {};

export default ApplicationDeploy;
