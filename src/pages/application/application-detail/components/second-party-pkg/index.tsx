/**
 * TowPartyPkg
 * @description 二方包
 * @author moting.nq
 * @create 2021-04-15 09:33
 */

import React, { useLayoutEffect, useEffect, useState, useContext } from 'react';
import { Tabs, Select } from 'antd';
import { queryEnvTypeData } from '@/common/apis';
import { getRequest } from '@/utils/request';
import DeployContent from './deploy-content';
import { ContentCard } from '@/components/vc-page-content';
import { listAppEnvType } from '@/common/apis';
import DetailContext from '../../context';
import { getPipelineUrl } from '@/pages/application/service';

const { TabPane } = Tabs;

export default function TowPartyPkg(props: any) {
  const { appData } = useContext(DetailContext);
  const [tabActive, setTabActive] = useState(sessionStorage.getItem('__init_secondpartypkg_env_tab__') || 'cDev');
  // 环境
  const [envTypeData, setEnvTypeData] = useState<any[]>([]);
  const [datasource, setDatasource] = useState<any>([]); //流水线
  const [currentValue, setCurrentValue] = useState('');
  const [pipelineOption, setPipelineOption] = useState<any>([]); //流水线下拉框数据

  // 环境数据
  const queryEnvDataList = async () => {
    const envResp = await getRequest(listAppEnvType, {
      data: { isClient: true },
    });
    const envTypeData = envResp?.data || [];
    let pipelineObj: any = {};
    envTypeData.forEach((e: any) => {
      if (e.typeName) {
        pipelineObj[e.typeName] = '';
      }
    });
    sessionStorage.setItem('secondpartypkg_pipeline_obj', JSON.stringify(pipelineObj));
    setEnvTypeData(
      envTypeData.map((el: any) => ({
        ...el,
        label: el.typeName,
        value: el.typeCode,
      })),
    );
  };

  useEffect(() => {
    queryEnvDataList();
  }, []);

  useLayoutEffect(() => {
    sessionStorage.setItem('__init_secondpartypkg_env_tab__', tabActive);
  }, [tabActive]);

  useEffect(() => {
    queryData();
  }, []);
  const queryData = () => {
    getRequest(listAppEnvType, {
      data: { isClient: true },
    }).then((result) => {
      const dataSource = result?.data || {};
      const next = (dataSource || []).map((el: any) => ({
        ...el,
        label: el?.typeName,
        value: el?.typeCode,
      }));
      setEnvTypeData(next);
    });
  };

  // 获取流水线
  const getPipeline = () => {
    const tab = sessionStorage.getItem('__init_secondpartypkg_env_tab__');
    getRequest(getPipelineUrl, {
      data: { appCode: appData?.appCode, envTypeCode: tab, pageIndex: -1, size: -1 },
    }).then((res) => {
      if (res?.success) {
        let data = res.data.dataSource;
        const options = data.map((item: any) => ({ value: item.pipelineCode, label: item.pipelineName }));
        setPipelineOption(options);
        if (options.length !== 0) {
          handleData(options, tabActive);
        }
      }
    });
  };

  // 处理数据
  const handleData = (data: any, tab: string) => {
    let storageData = JSON.parse(sessionStorage.getItem('secondpartypkg_pipeline_obj') || '');
    let currentTabValue = storageData[tab];
    const pipelineCodeList = data.map((item: any) => item.value);
    // 选择的流水线被删除了或者第一次进入页面
    if (!pipelineCodeList.includes(currentTabValue) || !currentTabValue) {
      setCurrentValue(data[0].value);
      let value: any = JSON.parse(sessionStorage.getItem('env_pipeline_obj') || '');
      sessionStorage.setItem('env_pipeline_obj', JSON.stringify({ ...value, [tab]: data[0].value }));
    }
    // 设置过流水线且没被删除
    if (pipelineCodeList.includes(currentTabValue)) {
      setCurrentValue(storageData[tab]);
    }
  };

  const handleChange = (val: string) => {
    console.log(val);
  };

  return (
    <ContentCard noPadding>
      <Tabs
        onChange={(v) => {
          setTabActive(v), getPipeline();
        }}
        activeKey={tabActive}
        type="card"
        tabBarExtraContent={
          <span className="tabs-extra">
            请选择：
            <Select
              value={currentValue}
              style={{ width: 180 }}
              size="small"
              onChange={handleChange}
              options={pipelineOption}
            ></Select>
          </span>
        }
      >
        {envTypeData?.map((item) => (
          <TabPane tab={item.label} key={item.value}>
            <DeployContent
              env={item.value}
              pipelineCode={currentValue}
              onDeployNextEnvSuccess={() => {
                const i = envTypeData.findIndex((item) => item.value === tabActive);
                setTabActive(envTypeData[i + 1]?.value || 'cDev');
              }}
            />
          </TabPane>
        ))}
      </Tabs>
    </ContentCard>
  );
}
