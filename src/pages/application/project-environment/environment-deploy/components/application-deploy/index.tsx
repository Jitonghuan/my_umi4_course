// 项目环境部署
// @author JITONGHUAN <muxi@come-future.com>
// @create 2022/02/23 16:21

import React, { useContext, useState, useLayoutEffect, useEffect } from 'react';
import { Tabs } from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import DetailContext from '../../context';
import DeployContent from './deploy-content';
import { getRequest } from '@/utils/request';
import { listAppEnvType } from '@/common/apis';
import { getPipelineUrl } from '@/pages/application/service';

const { TabPane } = Tabs;

export default function ApplicationDeploy(props: any) {
  const { appData, projectEnvCode } = useContext(DetailContext);
  // const { envTypeData } = useContext(FeContext);
  const [envTypeData, setEnvTypeData] = useState<IOption[]>([]);
  const [tabActive, setTabActive] = useState(sessionStorage.getItem('__init_env_tab__') || 'dev');
  const [pipelineCode, setPipelineCode] = useState('');

  useLayoutEffect(() => {
    sessionStorage.setItem('__init_env_tab__', tabActive);
  }, [tabActive]);

  // 获取流水线
  const getPipeline = () => {
    getRequest(getPipelineUrl, {
      data: { appCode: appData?.appCode, envTypeCode: tabActive, proEnvCode: projectEnvCode, pageIndex: -1, size: -1 },
    }).then((res) => {
      if (res?.success) {
        let data = res?.data?.dataSource;
        if (data && data.length !== 0) {
          setPipelineCode(data[0].pipelineCode);
        }
      }
    });
  };

  useEffect(() => {
    getPipeline();
  }, []);

  // useEffect(() => {
  //   queryData();
  // }, []);
  // const queryData = () => {
  //   getRequest(listAppEnvType, {
  //     data: { appCode: appData?.appCode, isClient: false },
  //   }).then((result) => {
  //     const { data } = result || [];
  //     let next: any = [];
  //     (data || []).map((el: any) => {
  //       if (el?.typeCode === 'dev') {
  //         next.push({ ...el, label: el?.typeName, value: el?.typeCode, sortType: 1 });
  //       }
  //       if (el?.typeCode === 'test') {
  //         next.push({ ...el, label: el?.typeName, value: el?.typeCode, sortType: 2 });
  //       }
  //       if (el?.typeCode === 'pre') {
  //         next.push({ ...el, label: el?.typeName, value: el?.typeCode, sortType: 3 });
  //       }
  //       if (el?.typeCode === 'prod') {
  //         next.push({ ...el, label: el?.typeName, value: el?.typeCode, sortType: 4 });
  //       }
  //     });
  //     next.sort((a: any, b: any) => {
  //       return a.sortType - b.sortType;
  //     }); //升序
  //     setEnvTypeData(next);
  //   });
  // };

  return (
    <ContentCard>
      <DeployContent
        // isActive={item.value === tabActive}
        envTypeCode={projectEnvCode || ''}
        pipelineCode={pipelineCode}
      />
    </ContentCard>
  );
}
