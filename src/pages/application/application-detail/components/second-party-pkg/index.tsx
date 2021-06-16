/**
 * TowPartyPkg
 * @description 二方包
 * @author moting.nq
 * @create 2021-04-15 09:33
 */

import React, { useContext, useEffect, useState } from 'react';
import { Tabs, Button } from 'antd';
import FeContext from '@/layouts/basic-layout/FeContext';
import { queryEnvData } from '@/layouts/basic-layout/service';
import { getRequest } from '@/utils/request';
import DeployContent from './deploy-content';
import { IProps } from './types';
import './index.less';

const { TabPane } = Tabs;
const rootCls = 'second-party-pkg';

const TowPartyPkg = ({
  location: {
    query: { appCode, id: appId, isContainClient },
  },
}: IProps) => {
  // const { envData } = useContext(FeContext);
  const [tabActive, setTabActive] = useState('cDev');
  // 环境
  const [envData, setEnvData] = useState<any[]>([]);

  // 环境数据
  const queryEnvDataList = async () => {
    const envResp = await getRequest(queryEnvData, {
      data: { isClient: true },
    });
    const envData = envResp?.data || [];
    setEnvData(
      envData.map((el: any) => ({
        ...el,
        label: el.typeName,
        value: el.typeCode,
      })),
    );
  };

  useEffect(() => {
    queryEnvDataList();
  }, []);

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
              env={item.value}
              onDeployNextEnvSuccess={() => {
                const i = envData.findIndex((item) => item.value === tabActive);
                setTabActive(envData[i + 1]?.value || 'cDev');
              }}
            />
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
};

TowPartyPkg.defaultProps = {};

export default TowPartyPkg;
