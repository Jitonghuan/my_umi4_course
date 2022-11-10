import React, { useMemo, useState,useEffect,useCallback } from 'react';
import PageContainer from '@/components/page-container';
import { Table, Space, Form,Select,Input,Button,Spin,Empty } from 'antd';
import { FilterCard,ContentCard } from '@/components/vc-page-content';
import {START_TIME_ENUMS} from './schema';
import { history, useLocation} from 'umi';
import moment from 'moment';
import { RedoOutlined, SyncOutlined } from '@ant-design/icons';
import LightDragable from "@/components/light-dragable";
import ListDetail from './components/list-detail';
import {QuestionCircleOutlined} from '@ant-design/icons';
import {queryAppList,queryEnvList,queryInstanceList,getCountOverview} from './hook';
import DetailContext from './context';
import './index.less'
export default function TrafficDetail() {
    const now = new Date().getTime();
    let location = useLocation();
    const curRecord: any = location.state || {};
    const [formInstance] = Form.useForm();
    const [appOptions, setAppOptions] = useState([]);
    const [envOptions, setEnvOptions] = useState([]);
    const [appLoading,setAppLoading]=useState<boolean>(false)
    const [envLoading,setEnvLoading]=useState<boolean>(false)
    const [instanceDataSource, setInstanceDataSource] = useState<any>([]);
    const [loading,setLoading]=useState<boolean>(false)
    const [curAppID,setCurAppID]=useState<string>(curRecord?.appId)
    const [isHovering, setIsHovering] = useState(false);
    // pod ip
    const [curtIP, setCurtIp] = useState<string>('');
    const [hostName, setHostName] = useState<string>('');
    // 请求开始时间，由当前时间往前
  const [startTime, setStartTime] = useState<number>(5 * 60 * 1000);
  const queryCountOverview=(params:{
    instanceIDs:any,
    start:string,
    end:string
  })=>{
    getCountOverview({
      instanceIDs:params?.instanceIDs,
      start:params?.start,
      end:params?.end,
      envCode:curRecord?.envCode,
      appID:curRecord?.appId
  }).then((res:any)=>{
    


  })

  }
  useEffect(()=>{
    // if(!curRecord?.appID) return
    if(curRecord?.appCode&&curRecord?.envCode){
      formInstance.setFieldsValue({
        appCode:curRecord?.appCode,
        envCode:curRecord?.envCode,
      });
      setCurAppID(curRecord?.appId)
      queryApps({
        envCode:curRecord?.envCode,
        startTime:startTime
      })
      // if(curRecord?.appId!==""){
        getInstanceData({appID:curRecord?.appId})
      // }

    }
  },[])
    useEffect(()=>{
      queryEnvs()
    },[])
   
    // 查询应用列表
  const queryApps = (params:{
    envCode:string;
    startTime:number
  }) => {
    setAppLoading(true)
    const now = new Date().getTime();
    queryAppList({
      envCode:params?.envCode,
      start:Number((now - params?.startTime) / 1000)+"",
      end:Number((now) / 1000)+"",
    }).then((resp) => {
        setAppOptions(resp);
    }).finally(()=>{
        setAppLoading(false)
    })
  }
 const queryEnvs = () => {
    setEnvLoading(true)
    queryEnvList().then((resp) => {
        setEnvOptions(resp)
      }).finally(()=>{
        setEnvLoading(false)
      })
 }
 
  // 查询节点使用率
  
  const getInstanceData=(params?:{start?:number,appID?:string})=>{
      setLoading(true)
      let curStart=params?.start?params?.start:startTime
      let appID=params?.appID?params?.appID:curAppID
      
      const now = new Date().getTime();
      console.log("--now--",now)
      queryInstanceList({
        start:moment(new Date(Number((now - curStart) ))).format('YYYY-MM-DD HH:mm:ss'),
        end: moment(new Date(Number((now) ))).format('YYYY-MM-DD HH:mm:ss'),
        envCode:formInstance?.getFieldValue("envCode"),
        appID:appID,
    }).then((res:any)=>{
        if (res?.data?.length>0) {
          let data=res?.data
          let instanceIDs=data?.map((ele:any)=>ele.key)
          queryCountOverview({
            instanceIDs:instanceIDs,
            start:moment(new Date(Number((now - curStart) ))).format('YYYY-MM-DD HH:mm:ss'),
            end: moment(new Date(Number((now) ))).format('YYYY-MM-DD HH:mm:ss'),
          })

        
          
          }
       
    }).finally(()=>{
        setLoading(false)
    })
  }
  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };
  
    const leftContent = useMemo(() => {
        return (
          <>
            <div className="left-content-title">
              
                    <span>
                    <QuestionCircleOutlined  style={{color:"#1E90FF",fontSize:16}}/>实例
                    </span>
                    <div>
                        <div 
                        className="title-hover"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}>
                          
                          <span >请求数</span></div>/
                        <div  className="title-hover" ><span >RT</span></div>/
                       <div className="title-hover"><span   >失败数</span></div> 
                    </div>
                
            </div>
            <div className="left-content-detail">
              <Spin spinning={loading}>
                {instanceDataSource?.length<1&&<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={"暂无数据"} />}
              {instanceDataSource?.length>0&&instanceDataSource?.map((element:any)=>{
                    return(
                        <ul>
                            <li>
                              <span>{element?.hostIP}</span>
                              <span></span></li>
                        </ul>
                    )

                })}

              </Spin>
               

            
            </div>
          </>
        )
      }, [instanceDataSource,loading,isHovering])
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
              <Form form={formInstance} layout="inline" className="monitor-filter-form" >
              
                  <Form.Item label="选择环境" name="envCode">
                      <Select showSearch options={envOptions} onChange={(envCode)=>{
                         queryApps({
                          envCode,
                          startTime:startTime
                        })
                        getInstanceData()
                  
                      }}  loading={envLoading} style={{ width: 200 }}/>
                  </Form.Item>
                  <Form.Item label="选择应用" name="appCode">
                       <Select showSearch options={appOptions} onChange={(appCode,option:any)=>{
                         setCurAppID(option?.appId)
                         getInstanceData({appID:option?.appId})

                       }}   loading={appLoading}  style={{ width: 200 }} />
                  </Form.Item>
               </Form>
                 
                  <span>选择时间：<Select 
                  style={{ width: 150 }}
                  value={startTime}
                  onChange={(value) => {         
                    setStartTime(value);
                    getInstanceData({start: value})
                    queryApps({
                      envCode:curRecord?.envCode,
                      startTime:value
                    })
                }}
                  >  <Select.OptGroup label="Relative time ranges"></Select.OptGroup>
                {START_TIME_ENUMS.map((time) => (
                  <Select.Option key={time.value} value={time.value}>
                    {time.label}
                  </Select.Option>
                ))}
              </Select>
              <Button icon={<RedoOutlined/>}  onClick={() => {
              getInstanceData()
              }}>刷新</Button>
             
            </span>
            
              </div>
  
          </FilterCard>
          <DetailContext.Provider value={{
              envCode:formInstance?.getFieldValue("envCode"),
              appID:curAppID,
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
  