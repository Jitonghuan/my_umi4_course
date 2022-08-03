/**
 * ConfigParametersManage
 * @description 配置管理
 * @author moting.nq
 * @create 2021-04-19 18:26
 */

import React, { useMemo, useContext, useState, useEffect } from 'react';
import { Tabs } from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import DetailContext from '../../context';
import ConfigContent from './config-content';
import { IProps } from './types';
import { listAppEnvType } from '@/common/apis';
import { getRequest } from '@/utils/request';
import './index.less';

const { TabPane } = Tabs;
const rootCls = 'config-parameters-manage-compo';
const typeMap = {
  configMgr: 'app',
  launchParameters: 'boot',
};

export default function ConfigParametersManage(props: IProps) {
  const { appData } = useContext(DetailContext);
  const {
    location: { pathname },
  } = props;
  const [envTypeData, setEnvTypeData] = useState<IOption[]>([]);
  useEffect(() => {
    queryData();
  }, []);
  const queryData = () => {
    getRequest(listAppEnvType, {
      data: { appCode: appData?.appCode, isClient: false },
    }).then((result) => {
      const { data } = result || [];
      let next: any = [];
      (data || []).map((el: any) => {
        if (el?.typeCode === 'dev') {
          next.push({ ...el, label: el?.typeName, value: el?.typeCode, sortType: 1 });
        }
        if (el?.typeCode === 'test') {
          next.push({ ...el, label: el?.typeName, value: el?.typeCode, sortType: 2 });
        }
        if (el?.typeCode === 'pre') {
          next.push({ ...el, label: el?.typeName, value: el?.typeCode, sortType: 3 });
        }
        if (el?.typeCode === 'prod') {
          next.push({ ...el, label: el?.typeName, value: el?.typeCode, sortType: 4 });
        }
      });
      next.sort((a: any, b: any) => {
        return a.sortType - b.sortType;
      }); //升序
      setEnvTypeData(next);
    });
  };

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
    <ContentCard noPadding className={rootCls} key={pathname}>
      <Tabs
        className={`${rootCls}__tabs`}
        defaultActiveKey={sessionStorage.getItem('__init_env_tab__') || undefined}
        onChange={handleTabActiveChange}
        // activeKey={this.state.activeKey}
        type="card"
      >
        {envTypeData?.map((item) => (
          <TabPane tab={item.label} key={item.value}>
            <ConfigContent env={item.value} configType={configType} />
          </TabPane>
        ))}
      </Tabs>
    </ContentCard>
  );
}
