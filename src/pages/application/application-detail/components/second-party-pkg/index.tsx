/**
 * TowPartyPkg
 * @description 二方包
 * @author moting.nq
 * @create 2021-04-15 09:33
 */

import React, { useLayoutEffect, useEffect, useState, useContext, useMemo } from 'react';
import { Tabs, Select, Tag } from 'antd';
import { queryEnvTypeData } from '@/common/apis';
import { getRequest } from '@/utils/request';
import DeployContent from './deploy-content';
import { ContentCard } from '@/components/vc-page-content';
import { listAppEnvType } from '@/common/apis';
import DetailContext from '../../context';
import { getPipelineUrl } from '@/pages/application/service';
import './index.less';

const { TabPane } = Tabs;

export default function TowPartyPkg(props: any) {
  const { appData } = useContext(DetailContext);
  const [tabActive, setTabActive] = useState(sessionStorage.getItem('__init_secondpartypkg_env_tab__') || 'cDev');
  // 环境
  const [envTypeData, setEnvTypeData] = useState<any[]>([]);
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
    getPipeline();
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
  const getPipeline = (v?: string) => {
    const tab = v ? v : sessionStorage.getItem('__init_secondpartypkg_env_tab__');
    getRequest(getPipelineUrl, {
      data: { appCode: appData?.appCode, envTypeCode: tab, pageIndex: -1, size: -1 },
    }).then((res) => {
      if (res?.success) {
        let data = res.data.dataSource;
        const options = data.map((item: any) => ({ value: item.pipelineCode, label: item.pipelineName }));
        setPipelineOption(options);
        if (options.length !== 0) {
          setCurrentValue(options[0].value);
        } else {
          setCurrentValue('');
        }
      }
    });
  };

  const handleChange = (val: string) => {};

  return (
    <ContentCard noPadding>
      <Tabs
        onChange={(v) => {
          setCurrentValue(''), setTabActive(v), getPipeline(v);
        }}
        activeKey={tabActive}
        type="card"
        tabBarExtraContent={
          <div className="second-tabs-extra">
            <span>
              当前流水线：<Tag color="blue">{currentValue || '---'}</Tag>
            </span>
            <span className="tabs-extra">
              请选择：
              <Select
                value={currentValue}
                style={{ width: 220 }}
                size="small"
                onChange={handleChange}
                options={pipelineOption}
              ></Select>
            </span>
          </div>
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
