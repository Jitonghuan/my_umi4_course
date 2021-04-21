/**
 * ConfigParametersManage
 * @description 配置管理
 * @author moting.nq
 * @create 2021-04-19 18:26
 */

import React, { useMemo, useState } from 'react';
import { Tabs, Button } from 'antd';
import ConfigContent from './config-content';
import { IProps } from './types';
import './index.less';

const { TabPane } = Tabs;
const rootCls = 'config-parameters-manage-compo';
const typeMap = {
  configMgr: 'app',
  launchParameters: 'boot',
};

const ConfigParametersManage = ({
  location: {
    pathname,
    query: { id, appCode },
  },
}: IProps) => {
  const configType = useMemo(() => {
    const paths = pathname.split('/');
    const name = paths[paths.length - 1];
    return (typeMap as any)[name];
  }, [pathname]);

  if (!configType) return null;

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
          <ConfigContent env="DEV" configType={configType} appCode={appCode} />
        </TabPane>
        <TabPane tab="TEST" key="TEST">
          <ConfigContent env="TEST" configType={configType} appCode={appCode} />
        </TabPane>
        <TabPane tab="POC" key="POC">
          <ConfigContent env="POC" configType={configType} appCode={appCode} />
        </TabPane>
        <TabPane tab="PRD" key="PRD">
          <ConfigContent env="PRD" configType={configType} appCode={appCode} />
        </TabPane>
      </Tabs>
    </div>
  );
};

ConfigParametersManage.defaultProps = {};

export default ConfigParametersManage;
