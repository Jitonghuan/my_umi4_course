// 应用部署
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/25 16:21

import React, { useContext, useState, useLayoutEffect, useEffect, useMemo } from 'react';
import { Tabs, Select, Tag, Spin } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { FeContext } from '@/common/hooks';
import { ContentCard } from '@/components/vc-page-content';
import DetailContext from '../../context';
import SecondPartyPkg from '../second-party-pkg';
import DeployContent from './deploy-content';
import { getRequest } from '@/utils/request';
import { listAppEnvType } from '@/common/apis';
import { history } from 'umi';
import './index.less';
import { values } from 'lodash';
import StepItem from './deploy-content/components/publish-content/steps/step-item';
import PipeLineManage from './pipelineManage';
import { getPipelineUrl, retry } from '@/pages/application/service';
import { active } from '_@types_d3-transition@3.0.1@@types/d3-transition';

const { TabPane } = Tabs;

export default function ApplicationDeploy(props: any) {
  const { appData } = useContext(DetailContext);
  // const { envTypeData } = useContext(FeContext);
  const [envTypeData, setEnvTypeData] = useState<IOption[]>([]);
  const [currentValue, setCurrentValue] = useState('');
  const [visible, setVisible] = useState<boolean>(false); //流水线管理
  const [datasource, setDatasource] = useState<any>([]); //流水线
  const [pipelineOption, setPipelineOption] = useState<any>([]); //流水线下拉框数据
  const initTabActive = props.location.query.activeTab;

  let env = window.location.href.includes('matrix-zslnyy')
    ? 'prod'
    : window.location.href.includes('matrix-fygs')
    ? 'prod'
    : window.location.href.includes('matrix-base-poc')
    ? 'prod'
    : '';
  const [tabActive, setTabActive] = useState(
    props.location.query.activeTab || sessionStorage.getItem('__init_env_tab__') || env,
  );

  useEffect(() => {
    sessionStorage.setItem('__init_env_tab__', tabActive);
    history.push({ query: { ...props.location.query, activeTab: tabActive } });
  }, [tabActive]);
  useEffect(() => {
    if (initTabActive && +appData?.isClient! === 0) {
      getPipeline(initTabActive);
    }
  }, [initTabActive]);

  // 二方包直接渲染另一个页面
  if (+appData?.isClient! === 1) {
    return <SecondPartyPkg {...props} />;
  }
  useEffect(() => {
    queryData();
  }, []);

  const nextTab = useMemo(() => {
    let data = '';
    if (envTypeData && tabActive) {
      const i = envTypeData.findIndex((item: any) => item.value === tabActive);
      data = envTypeData[i + 1]?.value || '';
    }
    return data;
  }, [tabActive, envTypeData]);

  // const pipelineName=useMemo(()=>{
  //   let result=''
  //  if(pipelineOption&&currentValue){
  //   const data=pipelineOption.find((item:any)=>item.value===currentValue)
  //   if(data){
  //    result=data.label
  //   }
  //  }
  //  return result
  // },[currentValue,pipelineOption])

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
      const currentTab = sessionStorage.getItem('__init_env_tab__') || next[0]?.typeCode || env;
      setTabActive(currentTab);
      let pipelineObj: any = {};
      const saveData = JSON.parse(sessionStorage.getItem('env_pipeline_obj') || '{}');
      next.forEach((e: any) => {
        if (e.typeCode) {
          pipelineObj[e.typeCode] = saveData && saveData[e.typeCode] ? saveData[e.typeCode] : '';
        }
      });
      sessionStorage.setItem('env_pipeline_obj', JSON.stringify(pipelineObj));
      setEnvTypeData(next);
    });
  };

  // 流水线下拉框发生改变
  const handleChange = (value: string) => {
    setCurrentValue(value);
    let data: any = JSON.parse(sessionStorage.getItem('env_pipeline_obj') || '');
    sessionStorage.setItem('env_pipeline_obj', JSON.stringify({ ...data, [tabActive]: value }));
  };

  // tab页切换
  const handleTabChange = (v: string) => {
    setCurrentValue('');
    debugger;
    setTabActive(v);
    getPipeline(v);
  };

  // 获取流水线
  const getPipeline = (v?: string) => {
    const tab = v ? v : tabActive;
    getRequest(getPipelineUrl, {
      data: { appCode: appData?.appCode, envTypeCode: tab, pageIndex: -1, size: -1 },
    }).then((res) => {
      if (res?.success) {
        let data = res?.data?.dataSource;
        setDatasource(data);
        const pipelineOptionData = data.map((item: any) => ({ value: item.pipelineCode, label: item.pipelineName }));
        setPipelineOption(pipelineOptionData);
        if (pipelineOptionData.length !== 0) {
          handleData(pipelineOptionData, tab);
        }
      }
    });
  };

  // 处理数据
  const handleData = (data: any, tab: string) => {
    let storageData = JSON.parse(sessionStorage.getItem('env_pipeline_obj') || '');
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

  return (
    <ContentCard noPadding>
      <PipeLineManage
        visible={visible}
        handleCancel={() => {
          setVisible(false);
        }}
        dataSource={datasource}
        onSave={getPipeline}
        appData={appData}
        envTypeCode={tabActive}
      />

      <Tabs
        onChange={(v) => {
          handleTabChange(v);
        }}
        activeKey={tabActive}
        type="card"
        tabBarExtraContent={
          <div className="tabs-extra">
            <span>
              当前流水线：<Tag color="blue">{currentValue || '---'}</Tag>
            </span>
            <span className="tabs-extra-select">
              请选择：
              <Select
                value={currentValue}
                style={{ width: 220 }}
                size="small"
                onChange={handleChange}
                options={pipelineOption}
              ></Select>
              <SettingOutlined
                style={{ marginLeft: '10px' }}
                onClick={() => {
                  setVisible(true);
                }}
              />
            </span>
          </div>
        }
      >
        {envTypeData?.map((item) => (
          <TabPane tab={item.label} key={item.value}>
            <DeployContent
              isActive={item.value === tabActive}
              envTypeCode={item.value}
              pipelineCode={currentValue}
              visible={visible}
              onDeployNextEnvSuccess={() => {
                const i = envTypeData.findIndex((item) => item.value === tabActive);
                setTabActive(envTypeData[i + 1]?.value);
                getPipeline(envTypeData[i + 1]?.value);
              }}
              nextTab={nextTab}
            />
          </TabPane>
        ))}
      </Tabs>
    </ContentCard>
  );
}
