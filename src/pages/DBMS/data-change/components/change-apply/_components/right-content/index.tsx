
import React, { useState} from 'react';
import {  Tabs,message,Table, } from 'antd';
import MonacoSqlEditor from '@/components/monaco-sql-editor';
import {checkSql} from '../../hook'
interface Iprops{
  tableFields:any;
  createItems:any;
  createSql:(params:{sqlContent:string})=>any
  sqlLoading:boolean
}
export default function RightContent(props:Iprops){
  const {tableFields,createSql,createItems,sqlLoading} =props;
  const [loading,setLoading]=useState<boolean>(false);
  const [executeResultData,setExecuteResultData]=useState<any>([])
  const getInfo=(sqlContent:string)=>{
    if(!createItems?.instanceId||!createItems?.dbCode||!sqlContent){
      message.warning("请先进行信息填写且输入sql语句再进行sql检测！")
      return
    }
    setLoading(true)
    checkSql({...createItems,sqlContent}).then((res)=>{
    if(res?.code===1000){
      let executeResult:any=[]
      try {
       executeResult=JSON.parse(res?.data?.result||"{}")
      } catch (error) {
        console.log(error)
      }
      setExecuteResultData(executeResult)
    }else{
      setExecuteResultData([])
    }
      }).finally(()=>{
      setLoading(false)
    })
  }
    
    return(<div className="data-change-right-content">
      <div className="container-top">
        <MonacoSqlEditor
        isSqlCheckBtn={true}
        isSqlBueatifyBtn={true} 
        isSubChangeBtn={true}
        tableFields={tableFields} 
        initValue={""}
        subSqlChange={(params:{sqlContent:string})=>createSql(params)}
        sqlCheck={(sqlContent:string)=>getInfo(sqlContent)}
        isGoback={true}
        sqlLoading={sqlLoading}
        />
      </div>
      <div className="container-bottom">
      <Tabs
        activeKey="check-result"
        type="card"
      >
        <Tabs.TabPane tab="检测结果" key="check-result">
        <Table   scroll={{ x: '100%' }} dataSource={executeResultData} loading={loading} >
      {executeResultData?.length>0&&(
        Object.keys(executeResultData[0])?.map((item:any)=>{
          return(
            <Table.Column title={item}  dataIndex={item}   key={item}  />
          )
        })

      )}
    </Table>
  </Tabs.TabPane>    
 </Tabs>
</div>
</div>)
}