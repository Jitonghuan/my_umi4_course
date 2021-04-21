/**
 * ConfigManage
 * @description 配置管理
 * @author moting.nq
 * @create 2021-04-19 18:26
 */

import React from 'react';
import { Tabs, Button } from 'antd';
import ConfigContent from './config-content';
import { IProps } from './types';
import './index.less';

const { TabPane } = Tabs;
const rootCls = 'config-manage-compo';

const ConfigManage = (props: IProps) => {
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
          <ConfigContent env="DEV" />
        </TabPane>
        <TabPane tab="TEST" key="TEST">
          <ConfigContent env="TEST" />
        </TabPane>
        <TabPane tab="POC" key="POC">
          <ConfigContent env="POC" />
        </TabPane>
        <TabPane tab="PRD" key="PRD">
          <ConfigContent env="PRD" />
        </TabPane>
      </Tabs>
    </div>
  );
};

ConfigManage.defaultProps = {};

export default ConfigManage;
