
import React, { useState, useCallback, useEffect, useRef,useContext } from 'react';
import { Card, Row, Col,Table } from 'antd';
import { RedoOutlined, SyncOutlined } from '@ant-design/icons';
import HulkTable, { usePaginated, ColumnProps } from '@cffe/vc-hulk-table';
import {QuestionCircleOutlined} from '@ant-design/icons'
import {tableSchema} from './schema';
import {queryNodeList} from '../hook';
import DetailContext from '../../../context';
import CpuUsage from './dashboards/cpu';
import MemroyUsage from './dashboards/memory';
import FsWritesChart from './dashboards/fs';
import NetWorkIOChart from './dashboards/network';
import { useQueryPodCpu, usequeryPodMem, useQueryFs, useQueryNetwork ,queryItems} from './dashboards/hook';
import './index.less'

export default function InstanceMonitor(){
 
  const [nodeDataSource, setNodeDataSource] = useState<any>([]);
  const {appCode,envCode,startTime,endTime,currentTableData,hostIP,hostName} =useContext(DetailContext);
  const [podCpuData, podCpuLoading, queryPodCpu] = useQueryPodCpu();
  const [podMemData, podMemLoading, queryPodMem] = usequeryPodMem();
  const [fsData, fsLoading, queryFs] = useQueryFs();
  const [networkIOData, networkIOLoading, queryNetworkIO] = useQueryNetwork();
 
 
   useEffect(()=>{
       if(appCode&&envCode&&startTime&&hostIP&&hostName){
        const now = new Date().getTime();
          getChartsDataSource({
            hostName: hostName,
            envCode: envCode,
            start: Number((now - startTime) / 1000),
            end: Number(now / 1000),
            appCode: appCode,
            ip: hostIP,
          })
        
       }
   },[envCode,appCode,hostIP,hostName,startTime])
   useEffect(()=>{
     if(Object.keys(currentTableData||{})?.length>0){
      getNodeDataSource()
     }else{
      setNodeDataSource([])
     }
    
   },[currentTableData])

   const getChartsDataSource=(params:queryItems)=>{
    queryPodCpu(params)
    queryPodMem(params)
    queryFs(params)
    queryNetworkIO(params)

   }

   
  
  const getNodeDataSource=useCallback(()=>{
    let data=[]
    
      data.push({
        resourceName:"资源配额",
        cpu:currentTableData?.cpuLimit,
        wss:getDiviNumber(getMultiNumber(currentTableData?.memLimit,currentTableData?.WSS)||"",currentTableData?.WSS),
        rss:getDiviNumber(getMultiNumber(currentTableData?.memLimit,currentTableData?.RSS)||"",currentTableData?.RSS),
        disk:currentTableData?.diskLimit||"--"

        
      },
      {
        resourceName:"已使用量",
        cpu:parseInt(getMultiNumber(currentTableData?.cpuLimit,(Number(currentTableData?.cpu)*0.01).toString())) ,
        wss:getMultiNumber(currentTableData?.memLimit,(Number(currentTableData?.WSS)*0.01).toString()),
        rss:getMultiNumber(currentTableData?.memLimit,(Number(currentTableData?.RSS)*0.01).toString()),
        disk:`${parseInt(currentTableData?.disk)}MB`

      },
      {
        resourceName:"使用百分比",
        cpu:`${currentTableData?.cpu}%`,
        wss:`${currentTableData?.WSS}% `,
        rss:`${currentTableData?.RSS}%`,
        disk:`${getDiviNumber(currentTableData?.disk,currentTableData?.diskLimit)}`
      }
      )

      setNodeDataSource(data)
},[currentTableData])
const getDiviNumber=(first:string,second:string)=>{
  if(!first||!second){
     return "--"
  }
  let number=""
  number=  (Number(first)/Number(second)).toFixed(2)
  return number

}
const getMultiNumber=(first:string,second:string)=>{
  if(!first||!second){
     return "--"
  }
  let number=""
  number=  (Number(first)*Number(second)).toFixed(2)
  return number

}

    return(
        <>
          <Card className="monitor-app-body">
          <h3 className="monitor-tabs-content-title">
            资源使用
            
        
          </h3>
          <Table rowKey="ip" bordered dataSource={nodeDataSource}  scroll={{ x: '100%' }}  columns={tableSchema as ColumnProps[]}  pagination={false}  />

           <h3 className="monitor-tabs-content-title">
            监控图表&nbsp;<QuestionCircleOutlined style={{fontSize:18,color:"#1E90FF"}} />
          </h3>
          <Row gutter={[16, 24]}>
                  <Col span={12}>
                    <div className="base-monitor-charts">
                      <MemroyUsage data={podMemData} loading={false} />
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="base-monitor-charts">
                      <CpuUsage data={podCpuData} loading={false} />
                    </div>
                  </Col>
                </Row>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <div className="base-monitor-charts">
                      <NetWorkIOChart data={networkIOData} loading={false} />
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="base-monitor-charts">
                      <FsWritesChart data={fsData} loading={false} />
                    </div>
                  </Col>
                </Row>

          
          </Card>
        </>
    )
}