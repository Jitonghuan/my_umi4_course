
import React, { useState,useEffect,forwardRef,Component,useMemo,useRef,useImperativeHandle} from 'react';
import {  Tabs,Form,Space,Button,Select,message,Table, } from 'antd';
import {createTableColumns} from './schema';
import MonacoSqlEditor from '@/components/monaco-sql-editor';
import {checkSql} from '../../hook'
import './index.less'
interface Iprops{
  tableFields:any;
  createItems:any;
  createSql:(params:{sqlContent:string})=>any
}
export default function RightContent(props:Iprops){
  const {tableFields,createSql,createItems} =props;
  const [loading,setLoading]=useState<boolean>(false);
  const [executeResultData,setExecuteResultData]=useState<any>([])


  // const executeResult=JSON.parse(res?.executeResult||"{}")
  const getInfo=(sqlContent:string)=>{
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
    // const columns = useMemo(() => {
    //     return createTableColumns() as any;
    //   }, []);
    return(<div className="data-change-right-content">
      <div className="container-top">
        <MonacoSqlEditor
        isSqlCheckBtn={true}
        isSubChangeBtn={true}
        tableFields={tableFields} 
        subSqlChange={(params:{sqlContent:string})=>createSql(params)}
        sqlCheck={(sqlContent:string)=>getInfo(sqlContent)}

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
            <Table.Column title={item} dataIndex={item}   key={item}  />
          )
        })

      )}
    </Table>
        
        </Tabs.TabPane>
      
      </Tabs>

     

      </div>


    </div>)
}