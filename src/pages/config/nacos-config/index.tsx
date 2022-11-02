
import React, { useState, useEffect } from 'react';
import { Tabs, Select } from 'antd';
import PageContainer from '@/components/page-container';
import { history, useLocation } from 'umi';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import NacosPage from './components/nacos';
import NamespacePage from './components/namespace'
import { getNacosEnvs } from './hook'
import VCPermission from '@/components/vc-permission';
import { parse, stringify } from 'query-string';
import DetailContext from './context'
import './index.less'
const { TabPane } = Tabs;

export default function AuthorityManage() {
  let location = useLocation();
  const query = parse(location.search);
  const initInfo: any = location.state || {};
  const [tabKey, setTabKey] = useState<any>('nacos');
  const [envOptions, setEnvOptions] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false)
  const [curEnvCode, setCurEnvCode] = useState<string>('')
  // useEffect(()=>{
  // history.push({
  //       pathname:  `/matrix/config/nacos-config/nacos`,        
  //     });
  // },[])
  const getEnvOptions = () => {
    setLoading(true)
    getNacosEnvs().then((res) => {
      setEnvOptions(res)
      setCurEnvCode(res[0]?.value)

    }).finally(() => {
      setLoading(false)
    })
  }

  useEffect(() => {
    getEnvOptions()
  }, [])

  return (<PageContainer className="nacos-config-wrap">
    {/* <ContentCard noPadding className="nacos-manage-page"> */}
    {/* <FilterCard className="nacos-config-filter">
      <div style={{ display: 'flex', height: 24, alignItems: "center", }}>
        <b>选择环境：</b> <Select style={{ width: 210 }} value={curEnvCode} showSearch  loading={loading} options={envOptions} onChange={(value: string) => {
          setCurEnvCode(value)
        }} />
      </div>


    </FilterCard> */}
    <ContentCard>
    <div className="nacos-manage-page">
      <Tabs
        activeKey={tabKey}
        onChange={(val) => {
          setTabKey(val);

          history.push({
            pathname: `/matrix/config/nacos-config/${val}`,

          });
        }}
        tabBarExtraContent={
          <div style={{ display: 'flex', height: 24, alignItems: "center", }}>
          <b>选择环境：</b> <Select style={{ width: 210 }} value={curEnvCode} showSearch  loading={loading} options={envOptions} onChange={(value: string) => {
            setCurEnvCode(value)
          }} />
        </div>
        }
      >
        <TabPane tab="nacos配置" key="nacos">
          <DetailContext.Provider value={{ envCode: curEnvCode,tabKey:tabKey }}>
            <VCPermission code={window.location.pathname} isShowErrorPage >
              <NacosPage />
            </VCPermission>
          </DetailContext.Provider>

        </TabPane>
        <TabPane tab="命名空间" key="namespace">
          <DetailContext.Provider value={{ envCode: curEnvCode,tabKey:tabKey }}>
            <VCPermission code={window.location.pathname} isShowErrorPage>

              <NamespacePage />

            </VCPermission>
          </DetailContext.Provider>

        </TabPane>
      </Tabs>
    </div>
    </ContentCard>
    {/* </ContentCard> */}
  </PageContainer>)
}