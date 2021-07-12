/**
 * ConfigParametersManage
 * @description 配置管理
 * @author moting.nq
 * @create 2021-04-19 18:26
 */

import React, { useMemo, useContext } from 'react';
import { Tabs } from 'antd';
import FeContext from '@/layouts/basic-layout/fe-context';
import ConfigContent from './config-content';
import DetailContext from '../../context';
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
    query: { id: appId },
  },
}: IProps) => {
  const { envData } = useContext(FeContext);
  const { appData } = useContext(DetailContext);
  const { appCode } = appData || {};

  const configType = useMemo(() => {
    const paths = pathname.split('/');
    const name = paths[paths.length - 1];
    return (typeMap as any)[name];
  }, [pathname]);

  const handleTabActiveChange = (next: string) => {
    sessionStorage.setItem('__init_env_tab__', next);
  };

  if (!configType) return null;

  return (
    <div className={rootCls} key={pathname}>
      <Tabs
        className={`${rootCls}__tabs`}
        defaultActiveKey={sessionStorage.getItem('__init_env_tab__') || undefined}
        onChange={handleTabActiveChange}
        // activeKey={this.state.activeKey}
        type="card"
        tabBarStyle={{ background: '#E6EBF5' }}
      >
        {envData?.map((item) => (
          <TabPane tab={item.label} key={item.value}>
            <ConfigContent env={item.value} configType={configType} appCode={appCode} appId={appId} />
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
};

ConfigParametersManage.defaultProps = {};

export default ConfigParametersManage;
