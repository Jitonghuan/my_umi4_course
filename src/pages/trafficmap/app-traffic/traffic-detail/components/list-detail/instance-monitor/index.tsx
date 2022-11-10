
import React, { useState, useCallback, useEffect, useRef,useContext } from 'react';
import { findDOMNode } from 'react-dom';
import { Card, Select, Form, Tooltip, Tabs, Button, Row, Col,Table } from 'antd';
import { RedoOutlined, SyncOutlined } from '@ant-design/icons';
import HulkTable, { usePaginated, ColumnProps } from '@cffe/vc-hulk-table';
import VCCardLayout from '@cffe/vc-b-card-layout';
import {QuestionCircleOutlined} from '@ant-design/icons'
import {tableSchema} from './schema';
import {queryNodeList} from '../hook';
import { getRequest } from '@/utils/request';
import DetailContext from '../../../context';
import CpuUsage from './dashboards/cpu';
import MemroyUsage from './dashboards/memory';
import FsWritesChart from './dashboards/fs';
import NetWorkIOChart from './dashboards/network';
import { useQueryPodCpu, usequeryPodMem, useQueryFs, useQueryNetwork ,queryItems} from './dashboards/hook';

import './index.less'
export default function InstanceMonitor(){
 
  const [nodeDataSource, setNodeDataSource] = useState<any>([]);
  const [loading,setLoading]=useState<boolean>(false)
  const {appCode,envCode,startTime,endTime} =useContext(DetailContext);
  const [podCpuData, podCpuLoading, queryPodCpu] = useQueryPodCpu();
  const [podMemData, podMemLoading, queryPodMem] = usequeryPodMem();
  const [fsData, fsLoading, queryFs] = useQueryFs();
  const [networkIOData, networkIOLoading, queryNetworkIO] = useQueryNetwork();
   // pod ip
   const [curtIP, setCurtIp] = useState<string>('');
   const [hostName, setHostName] = useState<string>('');
   useEffect(()=>{
    console.log("----appCode---",envCode,appCode,startTime,endTime)
   },[])
  
  //  useEffect(()=>{
  //      if(appCode&&envCode&&startTime&&endTime){
  //       getNodeDataSource()
  //      }
  //      console.log("----appCode---",envCode,appCode,startTime,endTime)

  //  },[appCode,envCode,startTime,endTime])
   const getChartsDataSource=(params:queryItems)=>{
    queryPodCpu(params)
    queryPodMem(params)
    queryFs(params)
    queryNetworkIO(params)

   }
  
  const getNodeDataSource=useCallback(()=>{
    setLoading(true)
    const now = new Date().getTime();
    
    queryNodeList({
        //@ts-ignore
      start: Number((now - startTime) / 1000),
      end: Number(now / 1000),
      envCode:envCode||"",
      appCode:appCode||'',
  }).then((res:any)=>{
      if (res[0]) {
          setCurtIp(res[0].hostIP);
          setHostName(res[0]?.hostName);
          getChartsDataSource({
            hostName: res[0]?.hostName,
            envCode:envCode||"" ,
            start: startTime,
            end: endTime,
            appCode:appCode||'',
            ip: res[0].hostIP,
          })
        }
      setNodeDataSource(res)
  }).finally(()=>{
      setLoading(false)
  })
},[startTime,envCode,appCode])
    return(
        <>
          <Card className="monitor-app-body">
          <h3 className="monitor-tabs-content-title">
            资源使用
            
        
          </h3>
          <Table rowKey="ip" bordered dataSource={nodeDataSource} loading={loading}  scroll={{ x: '100%' }}  columns={tableSchema as ColumnProps[]}  pagination={false}  onRow={(record) => {
              return {
                onClick: () => {
                  const now = new Date().getTime();
                  getChartsDataSource({
                    hostName: record?.hostName,
                    envCode:envCode||"" ,
                    start: startTime,
                   end: endTime,
                    appCode:appCode||'',
                    ip: record.hostIP,
                  })
                },
              };
            }} />

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