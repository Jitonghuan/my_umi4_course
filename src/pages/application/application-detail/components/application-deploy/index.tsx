// 应用部署
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/25 16:21

import React, { useContext, useState, useLayoutEffect, useEffect } from 'react';
import { Tabs, Select, Tag } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { FeContext } from '@/common/hooks';
import { ContentCard } from '@/components/vc-page-content';
import DetailContext from '../../context';
import SecondPartyPkg from '../second-party-pkg';
import DeployContent from './deploy-content';
import { getRequest } from '@/utils/request';
import { listAppEnvType } from '@/common/apis';
import './index.less';
import { values } from 'lodash';
import StepItem from './deploy-content/components/publish-content/steps/step-item';
import PipeLineManage from './pipelineManage';
import { getPipelineUrl } from '@/pages/application/service';

const { TabPane } = Tabs;

const temp: any = {
  dev: [
    { value: '流水线1', label: '流水线1' },
    { value: '流水线2', label: '流水线2' },
  ],
  test: [
    { value: '流水线3', label: '流水线3' },
    { value: '流水线4', label: '流水线5' },
  ],
  pre: [
    { value: '流水线5', label: '流水线5' },
    { value: '流水线6', label: '流水线6' },
  ],
  prod: [{ value: '流水线1', label: '流水线1' }],
};

export default function ApplicationDeploy(props: any) {
  const { appData } = useContext(DetailContext);
  // const { envTypeData } = useContext(FeContext);
  const [envTypeData, setEnvTypeData] = useState<IOption[]>([]);
  const [currentValue, setCurrentValue] = useState('');
  const [visible, setVisible] = useState<boolean>(false); //流水线管理
  const [pipeline, setPipeline] = useState<any>([]); //流水线
  const dataSource: any = [
    { id: 1, pipeLine: '流水线1' },
    { id: 2, pipeLine: '流水线2' },
  ];

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
  }, [tabActive]);

  // 二方包直接渲染另一个页面
  if (+appData?.isClient! === 1) {
    return <SecondPartyPkg {...props} />;
  }
  useEffect(() => {
    getPipeline();
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
    setTabActive(v);
    setCurrentValue(getCurrentValue(v));
  };

  const getCurrentValue = (env: string) => {
    let res = '';
    let data: any = JSON.parse(sessionStorage.getItem('env_pipeline_obj') || '');
    if (data[env]) {
      res = data[env];
    }
    return res;
  };

  // 流水线下拉框发生改变
  const handleChange = (value: string) => {
    setCurrentValue(value);
    let data: any = JSON.parse(sessionStorage.getItem('env_pipeline_obj') || '');
    sessionStorage.setItem('env_pipeline_obj', JSON.stringify({ ...data, [tabActive]: value }));
  };

  // 获取流水线
  const getPipeline = () => {
    // getRequest(getPipelineUrl, {
    //   data: { appCode: appData?.appCode, env: tabActive },
    // }).then((res) => {
    //   if (res?.success) {
    //     setPipeline(res.data.dataSource);
    //   }
    // });
    setPipeline(temp);
    handleData(temp);
  };

  // 处理数据
  const handleData = (data: any) => {
    let pipelineObj: any = {};
    const envList = Object.keys(data);
    envList.forEach((env: any) => {
      Object.assign(pipelineObj, {
        [env]: temp[env][0]['value'] || '',
      });
    });
    sessionStorage.setItem('env_pipeline_obj', JSON.stringify(pipelineObj));
    setCurrentValue(pipelineObj[tabActive]);
  };

  return (
    <ContentCard noPadding>
      <PipeLineManage
        visible={visible}
        handleCancel={() => {
          setVisible(false);
        }}
        dataSource={dataSource}
        onSave={getPipeline}
      />

      <Tabs
        onChange={(v) => {
          handleTabChange(v);
        }}
        activeKey={tabActive}
        type="card"
        tabBarExtraContent={
          <span className="tabs-extra">
            请选择：
            <Select
              value={currentValue}
              style={{ width: 120 }}
              size="small"
              onChange={handleChange}
              options={pipeline[tabActive]}
            ></Select>
            <SettingOutlined
              style={{ marginLeft: '10px' }}
              onClick={() => {
                setVisible(true);
              }}
            />
          </span>
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
