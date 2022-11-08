import React, { useMemo, useState,useEffect,useCallback } from 'react';
import PageContainer from '@/components/page-container';
import { Table, Space, Form,Select,Input } from 'antd';
import { FilterCard,ContentCard } from '@/components/vc-page-content';
import {START_TIME_ENUMS} from './schema';
import LightDragable from "@/components/light-dragable";
import ListDetail from './components/list-detail';
import {QuestionCircleOutlined} from '@ant-design/icons';
import {queryAppList,queryEnvList,queryNodeList} from './hook';
import DetailContext from './context';
import './index.less'
export default function TrafficDetail() {
    const now = new Date().getTime();
    const [formInstance] = Form.useForm();
    const [appOptions, setAppOptions] = useState([]);
    const [envOptions, setEnvOptions] = useState([]);
    const [appLoading,setAppLoading]=useState<boolean>(false)
    const [envLoading,setEnvLoading]=useState<boolean>(false)
    const [nodeDataSource, setNodeDataSource] = useState<any>([]);
    const [loading,setLoading]=useState<boolean>(false)
    // pod ip
    const [curtIP, setCurtIp] = useState<string>('');
    const [hostName, setHostName] = useState<string>('');
    // 请求开始时间，由当前时间往前
  const [startTime, setStartTime] = useState<number>(30 * 60 * 1000);
    useEffect(()=>{
        queryApps()
    },[])
    // 查询应用列表
  const queryApps = () => {
    setAppLoading(true)
    queryAppList().then((resp) => {
        setAppOptions(resp);
        formInstance.setFieldsValue({appCode:"dubbo-consumer"});
        queryEnvs("dubbo-consumer")
    }).finally(()=>{
        setAppLoading(false)
    })
  }
 const queryEnvs = (appCode?:any) => {
    setEnvLoading(true)
    queryEnvList({
        appCode
      }).then((resp) => {
        setEnvOptions(resp)
        formInstance.setFieldsValue({envCode:resp[0]?.value});
      }).finally(()=>{
        setEnvLoading(false)
      })
 }
 // 过滤操作
 const handleFilter = useCallback(
    (vals:any) => {
     console.log("---vals---",vals)
     if(vals?.appCode){
        queryEnvs(vals?.appCode)

     }
     if(vals?.envCode){
        getNodeDataSource()
     }
    },
    [],
  );
  // 查询节点使用率
  
  const getNodeDataSource=(start?:number)=>{
      setLoading(true)
      let curStart=start?start:startTime
      queryNodeList({
        start: Number((now - curStart) / 1000),
        end: Number(now / 1000),
        envCode:formInstance?.getFieldValue("envCode"),
        appCode:formInstance?.getFieldValue("appCode"),
    }).then((res:any)=>{
        if (res[0]) {
        
            setCurtIp(res[0].hostIP);
            setHostName(res[0]?.hostName);
          }
        setNodeDataSource(res)
    }).finally(()=>{
        setLoading(false)
    })
  }
  
    const leftContent = useMemo(() => {
        return (
          <>
            <div className="left-content-title">
              
                    <span>
                    <QuestionCircleOutlined  style={{color:"#1E90FF",fontSize:16}}/>实例
                    </span>
                    <span>
                        请求数/RT/失败数
                    </span>
                
            </div>
            <div className="left-content-detail">
                {nodeDataSource?.map((element:any)=>{
                    return(
                        <ul>
                            <li><span>{element?.hostIP}</span><span></span></li>
                        </ul>
                    )

                })}

            
            </div>
          </>
        )
      }, [nodeDataSource])
      const rightContent = useMemo(() => {
        return (
          <>
          <ListDetail />
           
          </>
        )
      }, [])


  
  
  
    return (
      <PageContainer className="traffic-detail-page">
          <FilterCard className="traffic-detail-page-header">
              <div className="traffic-detail-filter">
              <Form form={formInstance} layout="inline" className="monitor-filter-form" onValuesChange={handleFilter}>
                  <Form.Item label="应用Code" name="appCode">
                       <Select showSearch options={appOptions} loading={appLoading}  style={{ width: 200 }} />
                  </Form.Item>
                  <Form.Item label="环境Code" name="envCode">
                      <Select showSearch options={envOptions}  loading={envLoading} style={{ width: 200 }}/>
                  </Form.Item>
               </Form>
                 
                  <span>选择时间：<Select 
                  style={{ width: 150 }}
                  value={startTime}
                  onChange={(value) => {         
                    setStartTime(value);
                    getNodeDataSource(value)
                }}
                  >  <Select.OptGroup label="Relative time ranges"></Select.OptGroup>
                {START_TIME_ENUMS.map((time) => (
                  <Select.Option key={time.value} value={time.value}>
                    {time.label}
                  </Select.Option>
                ))}
              </Select></span>
              </div>
  
          </FilterCard>
          <DetailContext.Provider value={{
              envCode:formInstance?.getFieldValue("envCode"),
              appCode:formInstance?.getFieldValue("appCode"),
              startTime: Number((now - startTime) / 1000),
              endTime: Number(now / 1000),
              hostIP:curtIP,
              hostName:hostName
                }}>
          <ContentCard className="traffic-detail-page-content">
          <LightDragable
              showIcon={true}
              leftContent={leftContent}
              rightContent={rightContent}
              initWidth={200}
              least={20}
              isSonPage={true}
    />
             
  
  
          </ContentCard>
          </DetailContext.Provider>
       
          
     
  
      </PageContainer>
    );
  }
  