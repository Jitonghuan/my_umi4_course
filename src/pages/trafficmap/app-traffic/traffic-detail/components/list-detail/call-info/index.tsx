
import React, { useState, useCallback, useEffect, useRef,useMemo,useContext } from 'react';
import { Card, Select, Form, Tooltip, Tabs, Button, Row, Col ,Table,Input} from 'antd';
import moment from 'moment'
import {createStatisticsTableColumns,createQueryTableColumns} from './schema'
import {getCountDetail,getTrace} from './hook'
import DetailContext from '../../../context';
import {history} from 'umi'


import './index.less'
export  default function InstanceMonitor(){
  const {appCode,envCode,startTime,appId,deployName,count,isClick} =useContext(DetailContext);
  const [statisticsData,setStatisticsData]=useState<any>([])
  const [statisticsLoading,setStatisticsLoading]=useState<boolean>(false)
  const [traceLoading,setTraceLoading]=useState<boolean>(false)
  const [traceData,setTraceData]=useState<any>([])
  const [pageSize, setPageSize] = useState<number>(20);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [nowSearchEndpoint,setNowSearchEndpoint]=useState<string>("")
  useEffect(()=>{
    if(!envCode||!startTime||!appId||!deployName)return
    if(isClick&&isClick===appCode){
      getCountDetailTable(true)
    }else{
      getCountDetailTable(false)
    }
  
   
  },[envCode,startTime,deployName,appId,count,isClick])
  useEffect(()=>{
    getTraceTable()
  },[startTime,appId,count])
  const getCountDetailTable=(isTotal?:boolean)=>{
    setStatisticsLoading(true)
    const now = new Date().getTime();
    //@ts-ignore
    getCountDetail({envCode,
      deployName,
      appId,
      isTotal,
      //isTotal:true,
       //@ts-ignore
      start:moment(new Date(Number(now- startTime ))).format('YYYY-MM-DD HH:mm:ss'),
       //@ts-ignore
      end:moment(new Date(Number(now ))).format('YYYY-MM-DD HH:mm:ss'),}).then((resp)=>{
        setStatisticsData(resp||[])
    }).finally(()=>{
      setStatisticsLoading(false)
    })
  }

  const getTraceTable=(info?:{endpoint?:string,pageIndex?:number,pageSize?:number})=>{
    setTraceLoading(true)
    const now = new Date().getTime();
    //@ts-ignore
    getTrace({envCode,
      endpoint:info?.endpoint,
      pageIndex:info?.pageIndex,
      pageSize:info?.pageSize,
      appId,
       //@ts-ignore
      start:moment(new Date(Number(now- startTime ))).format('YYYY-MM-DD HH:mm:ss'),
       //@ts-ignore
      end:moment(new Date(Number(now ))).format('YYYY-MM-DD HH:mm:ss'),}).then((resp)=>{
      setTraceData(resp?.dataSource)
      setTotal(resp?.pageInfo?.total);
      setPageIndex(resp?.pageInfo?.pageIndex);
      setPageSize(resp?.pageInfo?.pageSize)
    }).finally(()=>{
      setTraceLoading(false)
    })
  }
    const statisticsColumns = useMemo(() => {
      console.log("startTime",startTime)
        return createStatisticsTableColumns({

          onView: (record, index) => {
            const now = new Date().getTime();
            history.push({
              pathname: "/matrix/trafficmap/tracking"

            }, {
              entry: "logSearch",
              envCode: envCode,
              //traceId: record?.,
              appId:appId,
              startTime: Number((now - startTime) / 1000),
              endTime: Number(now / 1000),
            })
          
          
          },
        
        }) as any;
      }, [startTime,envCode,appId]);
      const queryColumns = useMemo(() => {
        const now = new Date().getTime();
        return createQueryTableColumns({
          onView: (record, index) => {
            history.push({
              pathname: '/matrix/logger/search',
              search:`envCode=${envCode}&startTime=${moment(now- startTime).format('YYYY-MM-DD HH:mm:ss')}&endTime=${moment(now).format('YYYY-MM-DD HH:mm:ss')}&traceId=${record?.traceIds[0]}`
          })
        
        }
      }) as any;
      }, [startTime,envCode]);
      const pageSizeClick = (pagination: any) => {
        setPageIndex(pagination.current);
        let obj = {
          pageIndex: pagination.current,
          pageSize: pagination.pageSize,
        };
       
        getTraceTable({ ...obj, endpoint:nowSearchEndpoint})
    
      };
    
    return(
        <>
         <Card className="call-info-body">
          <h3 className="call-info-tabs-content-title">
            调用统计
          </h3>
          <Table bordered columns={statisticsColumns} loading={statisticsLoading} scroll={{x:'100%'}} dataSource={statisticsData}/>
          <div className="table-caption">
              <div className="caption-left">
              <h3 className="call-info-tabs-content-title">
             调用查询
             </h3>
              </div>
           
              <div className="caption-right">
                查询：<Input style={{width:220}} placeholder="请输入内容查询" onPressEnter={(e)=>{
                 
                  getTraceTable({
                    endpoint:e.target.value
                  })
                  setNowSearchEndpoint(e.target.value)
                }} />
              </div>
           </div>

          <Table 
          bordered 
          columns={queryColumns} 
          loading={traceLoading} 
          dataSource={traceData} 
          scroll={{x:'100%'}}
          pagination={{
            current: pageIndex,
            total,
            pageSize,
            showSizeChanger: true,
            onShowSizeChange: (_, size) => {
              setPageSize(size);
              setPageIndex(1); //
            },
            showTotal: () => `总共 ${total} 条数据`,
          }}
          onChange={pageSizeClick}

          />
          </Card>
        </>
    )
}