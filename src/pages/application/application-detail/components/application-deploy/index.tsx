/**
 * ApplicationDeploy
 * @description 应用部署
 * @author moting.nq
 * @create 2021-04-15 09:33
 */

import React, { useContext, useState, useEffect } from 'react';
import { Tabs, Button } from 'antd';
import FeContext from '@/layouts/basic-layout/FeContext';
import { queryEnvData } from '@/layouts/basic-layout/service';
import { getRequest } from '@/utils/request';
import DeployContent from './deploy-content';
import { IProps } from './types';
import './index.less';

const { TabPane } = Tabs;
const rootCls = 'app-deploy-compo';

const ApplicationDeploy = ({
  location: {
    query: { appCode, id: appId, isClient },
  },
}: IProps) => {
  const isTwoPackage = Number(isClient) === 1;

  const { envData } = useContext(FeContext);
  const [tabActive, setTabActive] = useState(isTwoPackage ? 'cDev' : 'dev');
  // 二方包环境
  const [envTwoPackageData, setEnvTwoPackageData] = useState<any[]>([]);

  // 环境数据
  const queryEnvDataList = async () => {
    const envResp = await getRequest(queryEnvData, {
      data: { isClient: true },
    });
    const envData = envResp?.data || [];
    setEnvTwoPackageData(
      envData.map((el: any) => ({
        ...el,
        label: el.typeName,
        value: el.typeCode,
      })),
    );
  };

  useEffect(() => {
    if (isTwoPackage) {
      queryEnvDataList();
    }
  }, [isClient]);

  const curEnvData = isTwoPackage ? envTwoPackageData : envData;

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
              envTypeCode={item.value}
              onDeployNextEnvSuccess={() => {
                const i = curEnvData.findIndex(
                  (item) => item.value === tabActive,
                );
                setTabActive(curEnvData[i + 1]?.value);
                console.log(tabActive);
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
