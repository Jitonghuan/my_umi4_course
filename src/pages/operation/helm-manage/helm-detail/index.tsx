// 详情页
// @author JITONGHUAN <muxi@come-future.com>
// @create 2022/02/21 17:10

import { useState, useEffect } from 'react';
import { Segmented, Divider } from 'antd';
import PageContainer from '@/components/page-container';
import { history } from 'umi';
import { ContentCard } from '@/components/vc-page-content';
import BasicInfo from './components/basic-info';
import HistoryLog from './components/history-log';
import ParamConfig from './components/param-config';
import { options } from './schema';
import { queryReleaseInfo } from './hook';

import './index.less';

export interface Item {
  id: number;
  versionName: string;
  versionDescription: string;
  releaseTime: number;
  gmtCreate: any;
  releaseStatus: number;
}
type releaseStatus = {
  releaseName: string;
  namespace: string;
  clusterName: boolean;
};

export default function HelmDetail(props: any) {
  const record: any = history.location?.state || {
    releaseName: '',
    namespace: '',
    clusterName: '',
  };
  const [activeValue, setActiveValue] = useState<string>('basic-info');

  useEffect(() => {
    if (!record) return;

    if (record?.releaseName && record?.namespace && record?.clusterName) {
      queryReleaseInfo({ ...record });
    }
  }, []);

  return (
    <PageContainer className="product-description">
      <ContentCard>
        <Segmented
          size="large"
          //  block
          options={options}
          defaultValue="basic-info"
          onChange={(value: any) => {
            setActiveValue(value);
          }}
        />
        {/* <Divider/> */}
        {activeValue === 'basic-info' && (
          <div className="basic-info-content">
            <BasicInfo />
          </div>
        )}
        {activeValue === 'param-config' && (
          <div className="param-config-content">
            <ParamConfig />
          </div>
        )}
        {activeValue === 'histiry-log' && (
          <div className="histiry-log-content">
            <HistoryLog />
          </div>
        )}
      </ContentCard>
    </PageContainer>
  );
}
