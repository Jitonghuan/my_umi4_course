import React, {useState, useEffect, useContext} from 'react';
import { Tabs } from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import DeployContent from './deploy-content';
import HotFix from './deploy-content/components/hot-fix';
import { history } from 'umi';
import './index.less';
import {getRequest} from "@/utils/request";
import {getPipelineUrl} from "@/pages/application/service";
import DetailContext from "@/pages/npm-manage/detail/context";

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
    label: 'PROD',
    value: 'latest'
  }
];

export default function Deploy(props: any) {
  const { npmData } = useContext(DetailContext);
  const [currentValue, setCurrentValue] = useState('');
  const [tabActive, setTabActive] = useState(
    props.location.query.activeTab || 'dev',
  );

  useEffect(() => {
    history.push({ query: { ...props.location.query, activeTab: tabActive } });
  }, [tabActive]);

  // tab页切换
  const handleTabChange = (v: string) => {
    setTabActive(v);
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

  useEffect(() => {
    getPipeline();
  }, [])

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
        <TabPane tab="HOTFIX" key='hotFix'>
          <HotFix isActive={'hotFix' === tabActive} />
        </TabPane>
      </Tabs>
    </ContentCard>
  );
}
