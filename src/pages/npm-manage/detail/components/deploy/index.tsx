import React, { useState, useEffect, useContext } from 'react';
import { Tabs } from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import DeployContent from './deploy-content';
import HotFix from './deploy-content/components/hot-fix';
import { getRequest } from "@/utils/request";
import { history,useLocation } from 'umi';
import { parse,stringify } from 'query-string';
import { getPipelineUrl } from "@/pages/application/service";
import DetailContext from "@/pages/npm-manage/detail/context";
import './index.less';

const { TabPane } = Tabs;

const envTypeData = [
  {
    label: 'DEV',
    value: 'dev'
  },
  {
    label: 'TEST',
    value: 'test'
  },
  {
    label: 'PRE',
    value: 'pre'
  },
  {
    label: 'LATEST',
    value: 'prod'
  }
];

export default function Deploy(props: any) {
  const { npmData } = useContext(DetailContext);
  const [currentValue, setCurrentValue] = useState('');
  let location:any = useLocation();
  const query :any= parse(location.search);
  const [tabActive, setTabActive] = useState(
    query.activeTab || 'dev',
  );

  useEffect(() => {
    getPipeline();
  }, [])

  // tab页切换
  const handleTabChange = (v: string) => {
    setTabActive(v);
    const newQuery={
      ...query,
      activeTab: v
    }
    history.push({
      pathname:location.pathname,
      search: stringify(newQuery),
      //  query: { ...props.location.query, activeTab: v } 
      });
    setCurrentValue('');
    if (v) {
      getPipeline(v);
    }
  };

  // 获取流水线
  const getPipeline = (v?: string) => {
    const tab = v ? v : tabActive;
    getRequest(getPipelineUrl, {
      data: { appCode: npmData?.npmName, envTypeCode: tab, pageIndex: -1, size: -1 },
    }).then((res) => {
      if (res?.success) {
        let data = res?.data?.dataSource;
        const pipelineOptionData = data.map((item: any) => ({ value: item.pipelineCode, label: item.pipelineName }));
        if (pipelineOptionData.length !== 0) {
          setCurrentValue(pipelineOptionData[0].value);
        }
      }
    });
  };

  return (
    <ContentCard noPadding>

      <Tabs
        onChange={(v) => {
          handleTabChange(v);
        }}
        activeKey={tabActive}
        type="card"
      >
        {envTypeData?.map((item) => (
          <TabPane tab={item.label} key={item.value}>
            <DeployContent
              isActive={item.value === tabActive}
              envTypeCode={item.value}
              pipelineCode={currentValue}
              envList={envTypeData}
            />
          </TabPane>
        ))}
        <TabPane tab="HOTFIX" key='hotfix'>
          <HotFix isActive={'hotfix' === tabActive} envTypeCode='hotfix' pipelineCode={currentValue} />
        </TabPane>
      </Tabs>
    </ContentCard>
  );
}
