import React, { useState, useEffect } from 'react';
import { Tabs, Select, Spin,Empty } from 'antd';
import PageContainer from '@/components/page-container';
import { history, useLocation } from 'umi';
import DetailContext from './context'
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import VCPermission from '@/components/vc-permission';
import ContentDetail from './content-detail';
import DevDetail from './dev-detail'
import { useGetDdlDesignFlow } from './hook'
import { parse, stringify } from 'query-string';
import './index.less'
export default function DDLDetail() {
  const [tabKey, setTabKey] = useState<any>('');
  let location = useLocation();
  const query = parse(location.search);
  const initInfo: any = location.state || {};
  const afferentId = Number(query?.id)
  const [label, setLabel] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(false)
 
  useEffect(() => {
    if (initInfo?.record?.id) {
      getDdlDesignFlow()
    }

  }, [initInfo?.record?.id])
  const getDdlDesignFlow = () => {
    setLoading(true)
    useGetDdlDesignFlow(initInfo?.record?.id).then((res) => {
      let envs=res?.env;
      setLabel(envs)
      if(envs?.length>0){
        setTabKey(envs[0]?.value)
      }
    }).finally(() => {
      setLoading(false)
    })
  }
  const changeTabKey=(next:string)=>{
    setTabKey(next)
  }

  return (
    <PageContainer>
      <Spin spinning={loading}>
        <Tabs
          activeKey={tabKey}
          onChange={(val) => {
            setTabKey(val);
          }}
        >
          {label?.length > 0 ? label?.map((ele: any,index:number) => {
            return (
              <>
                <Tabs.TabPane tab={ele?.label} key={ele?.value} >
                  {ele?.id===1?<DetailContext.Provider value={{ tabKey:ele?.value,changeTabKey,parentWfId:initInfo?.record?.id }}>
                     <DevDetail />

                 </DetailContext.Provider>:
                 <DetailContext.Provider value={{tabKey:ele?.value,changeTabKey,parentWfId:initInfo?.record?.id }}> 
                    <ContentDetail />
                  </DetailContext.Provider>
                  }
                </Tabs.TabPane>
              </>
            )
          }) : <Tabs.TabPane tab="研发" key="dev" >
               <DetailContext.Provider value={{ tabKey:"dev" }}>
                 <DevDetail />
               </DetailContext.Provider>
            </Tabs.TabPane>}
        </Tabs>
      </Spin>
     
    </PageContainer>
  )
}