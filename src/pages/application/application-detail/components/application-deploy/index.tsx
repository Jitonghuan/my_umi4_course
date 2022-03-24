// 应用部署
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/25 16:21

import React, { useContext, useState, useLayoutEffect, useEffect } from 'react';
import { Tabs, Select } from 'antd';
import { FeContext } from '@/common/hooks';
import { ContentCard } from '@/components/vc-page-content';
import DetailContext from '../../context';
import SecondPartyPkg from '../second-party-pkg';
import DeployContent from './deploy-content';
import { getRequest } from '@/utils/request';
import { listAppEnvType } from '@/common/apis';
import './index.less';
import { values } from 'lodash';

const { TabPane } = Tabs;

export default function ApplicationDeploy(props: any) {
  const { appData } = useContext(DetailContext);
  // const { envTypeData } = useContext(FeContext);
  const [envTypeData, setEnvTypeData] = useState<IOption[]>([]);
  const [valueObj, setValueObj] = useState<any>({});
  const [currentValue, setCurrentValue] = useState('');
  const [options, setOptions] = useState<any>([
    { value: '流水线1', key: '流水线1' },
    { value: '流水线2', key: '流水线2' },
  ]);
  let env = window.location.href.includes('zslnyy')
    ? 'prod'
    : window.location.href.includes('fygs')
    ? 'prod'
    : window.location.href.includes('base-poc')
    ? 'prod'
    : 'dev';
  const [tabActive, setTabActive] = useState(sessionStorage.getItem('__init_env_tab__') || env);

  useLayoutEffect(() => {
    sessionStorage.setItem('__init_env_tab__', tabActive);
    const temp: any = {
      dev: [
        { value: '流水线1', key: '流水线1' },
        { value: '流水线2', key: '流水线2' },
      ],
      test: [
        { value: '流水线3', key: '流水线3' },
        { value: '流水线4', key: '流水线5' },
      ],
      pre: [
        { value: '流水线5', key: '流水线5' },
        { value: '流水线6', key: '流水线6' },
      ],
      prod: [
        { value: '流水线1', key: '流水线1' },
        { value: '流水线1', key: '流水线1' },
      ],
    };
    let item: any = sessionStorage.getItem('__init_env_tab__');
    setOptions(temp[item]);
  }, [tabActive]);

  // 二方包直接渲染另一个页面
  if (+appData?.isClient! === 1) {
    return <SecondPartyPkg {...props} />;
  }
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

  const handleTabChange = (v: string) => {
    setTabActive(v), console.log(valueObj, 'valueObj');
    console.log(options);
    setCurrentValue(valueObj[tabActive] ? valueObj[tabActive] : options[0].value);
  };

  const handleChange = (value: string) => {
    if (valueObj.value) {
      setValueObj((v: any) => {
        Object.assign(v, { tabActive: value });
      });
    } else {
      setValueObj((v: any) => ({ ...v, tabActive: value }));
    }
  };

  return (
    <ContentCard noPadding>
      <Tabs
        onChange={(v) => {
          handleTabChange(v);
        }}
        activeKey={tabActive}
        type="card"
        tabBarExtraContent={
          <div className="tabs-extra">
            请选择：
            <Select
              defaultValue={currentValue}
              style={{ width: 120 }}
              size="small"
              onChange={handleChange}
              options={options}
            ></Select>
          </div>
        }
      >
        {envTypeData?.map((item) => (
          <TabPane tab={item.label} key={item.value}>
            <DeployContent
              isActive={item.value === tabActive}
              envTypeCode={item.value}
              onDeployNextEnvSuccess={() => {
                const i = envTypeData.findIndex((item) => item.value === tabActive);
                setTabActive(envTypeData[i + 1]?.value);
              }}
            />
          </TabPane>
        ))}
      </Tabs>
    </ContentCard>
  );
}
