import React, { useState, useEffect } from 'react';
import { Tabs, Select, Spin,Empty } from 'antd';
import PageContainer from '@/components/page-container';
import { history, useLocation } from 'umi';
import DetailContext from './context'
import ContentDetail from './content-detail';
import DevDetail from './first-detail'
import { useGetDdlDesignFlow } from './hook'
import { parse, stringify } from 'query-string';
import './index.less'
export default function DDLDetail() {
  const [tabKey, setTabKey] = useState<any>('');
  let location = useLocation();
  const query = parse(location.search);
  const initInfo: any = location.state || {};
  const parentId = Number(query?.parentId)
  const [label, setLabel] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(false)
  //activeKey parentId curId entry=DDL
  useEffect(()=>{
   
    if(parentId&&query?.entry==="DDL"){
      getDdlDesignFlow(parentId)
    }
  },[])
 
  useEffect(() => {
    if (initInfo?.record?.id) {
      getDdlDesignFlow()
    }

  }, [initInfo?.record?.id])
  const getDdlDesignFlow = (id?:number) => {
    setLoading(true)
    let curId=id?id:initInfo?.record?.id
    useGetDdlDesignFlow(curId).then((res) => {
      let envs=res?.env;
      setLabel(envs)
      if(envs?.length>0){
      
        if(query?.activeKey){
          const index= envs?.findIndex((v:any) => v.value === query?.activeKey)
          if(index!==-1){
            setTabKey(query?.activeKey)
          }else{
            return
          }

          
        }else{
          setTabKey(envs[0]?.value)

        }

       

      }else{
        setTabKey("dev")
      }
    }).finally(() => {
      setLoading(false)
    })
  }
  const changeTabKey=(next:string)=>{
    setTabKey(next)
  }

  return (
    <PageContainer className="ddl-detail" style={{  display: "flex",
    flexDirection: "column",
     padding: "0px 12px",
     height: "100%"}}>
      <Spin spinning={loading}>
        <Tabs
          activeKey={tabKey}
          type="card"

          onChange={(val) => {
            setTabKey(val);
          }}
        >
          {label?.length > 0 ? label?.map((ele: any,index:number) => {
            return (
              <>
                <Tabs.TabPane tab={ele?.label} key={ele?.value} >
                  {ele?.id===1?<DetailContext.Provider value={{ tabKey:ele?.value,changeTabKey,parentWfId:initInfo?.record?.id||query?.parentId }}>
                     <DevDetail />

                 </DetailContext.Provider>:
                 <DetailContext.Provider value={{tabKey:ele?.value,changeTabKey,parentWfId:initInfo?.record?.id|| query?.parentId}}> 
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