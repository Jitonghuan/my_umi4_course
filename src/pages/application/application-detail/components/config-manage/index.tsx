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
//  import './index.less';

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
          <ConfigContent />
        </TabPane>
        <TabPane tab="TEST" key="TEST">
          <ConfigContent />
        </TabPane>
        <TabPane tab="POC" key="POC">
          <ConfigContent />
        </TabPane>
        <TabPane tab="PRD" key="PRD">
          <ConfigContent />
        </TabPane>
      </Tabs>
    </div>
  );
};

ConfigManage.defaultProps = {};

export default ConfigManage;
