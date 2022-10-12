import React, { useState,useEffect,Component,useMemo,useRef,} from 'react';
import {  Tabs,Form,Space,Button,Select,message } from 'antd';
import {RightCircleFilled,InsertRowAboveOutlined,ZoomInOutlined} from '@ant-design/icons';
import PageContainer from '@/components/page-container';
import LightDragable from "@/components/light-dragable";
import QueryResult from "./components/query-result";
import SqlConsole from "./components/sql-console";
import {useEnvList,querySqlResultInfo,useQueryLogsList,useInstanceList,useQueryDatabasesOptions,useQueryTableFieldsOptions,useQueryTablesOptions} from '../common-hook'

import './index.less';
const { TabPane } = Tabs;
export default function ResizeLayout() {
  const sqlConsoleRef = useRef<any>(null);
  const queryResultRef = useRef<any>(null);
  const [form]=Form.useForm();
  const addQueryResult = () => queryResultRef?.current?.addQueryResult();
  const addSqlConsole = () => sqlConsoleRef?.current?.addSqlConsole();
  const queryResultItems=queryResultRef?.current?.queryResultItems;
  const sqlConsoleItems=sqlConsoleRef?.current?.sqlConsoleItems;
  const queryResultActiveKey=queryResultRef?.current?.queryResultActiveKey;
  const sqlConsoleActiveKey=sqlConsoleRef?.current?.sqlConsoleActiveKey;
  const [envOptionLoading,  envOptions, queryEnvList]=useEnvList();
  const [instanceLoading, instanceOptions, getInstanceList]=useInstanceList();
  const [databasesOptionsLoading,databasesOptions,queryDatabases,setSource]=useQueryDatabasesOptions()
  const [tablesOptionsLoading,tablesOptions, queryTables,setTablesSource]=useQueryTablesOptions();
  const [loading, tableFields,tableFieldsOptions, queryTableFields]=useQueryTableFieldsOptions();
 

  const [sqlLoading,setSqlLoading]=useState<boolean>(false);
  const [sqlResult,setSqlResult]=useState<any>("")

 

  const querySqlResult=(params:{sqlContent:string,sqlType:string})=>{
    setSqlLoading(true)
    const values=form?.getFieldsValue();
    querySqlResultInfo({...params,... values}).then((res)=>{
      if(res?.success){
       
        const dataSource =   res?.data?.result|| "";
        setSqlResult(dataSource)

        addQueryResult()

      }else{
        return
      }

    }).finally(()=>{
      setSqlLoading(false)
    })
  }

  useEffect(()=>{
    queryEnvList()
    getInstanceList()
    // queryLogsList()
    
  },[])

  const tableMap=()=>{
   return( tableFieldsOptions?.map((item:string)=>{
      return(
        <li className="schema-li-map" style={{listStyle:"none"}}><Space><ZoomInOutlined   style={{color:'#3591ff'}} /><InsertRowAboveOutlined onDoubleClick={
          addSqlConsole()
           }  style={{color:"#6495ED",fontSize:16}}/><span>{item}</span></Space></li>
      )

    })
   )
  }
  const leftContent=useMemo(()=>{
    return(
      <>
      <div className="left-content-title">选择查询对象</div>
      <div className="left-content-form">
        <Form layout="vertical" form={form}>
          <Form.Item name="envCode">
           
            <Select  placeholder="选择环境" allowClear showSearch loading={envOptionLoading} options={envOptions}/>
          </Form.Item>
          <Form.Item name="instanceId">
          <Select  placeholder="选择实例" options={instanceOptions} allowClear showSearch loading={instanceLoading} onChange={(instanceId)=>{
            queryDatabases(instanceId)
            
            }}/>
          </Form.Item>
          <Form.Item name="dbCode">
          <Select  placeholder="选择库" options={databasesOptions} allowClear showSearch loading={databasesOptionsLoading} onChange={(dbCode)=>{queryTables({dbCode})}}/>
          </Form.Item>
          <Form.Item name="tableCode">
          <Select  placeholder="选择表" options={tablesOptions} allowClear showSearch loading={tablesOptionsLoading} onChange={()=>{
            const values=form?.getFieldsValue();
            queryTableFields({...values})
            
            } } />
          </Form.Item>
        </Form>
        {/* ----表字段展示----- */}
      
        {tableMap()}

      </div>
      </>
    )
  },[queryResultItems,sqlConsoleItems,queryResultActiveKey,sqlConsoleActiveKey,envOptions,instanceOptions,databasesOptions,tablesOptions,tableFieldsOptions])
    
    const rightContent=useMemo(()=>{
      return(
        <>
          <div className="container-top">
          <SqlConsole ref={sqlConsoleRef} tableFields={tableFields}  querySqlResult={(params:{sqlContent:string,sqlType:string})=>querySqlResult(params)} sqlLoading={sqlLoading} />
          
          </div>
          <div className="container-bottom">
            
            <QueryResult ref={queryResultRef} sqlResult={sqlResult} sqlLoading={sqlLoading} />
         
            
          </div>

        </>
      )
    },[queryResultItems,sqlConsoleItems,queryResultActiveKey,sqlConsoleActiveKey,tableFields,sqlResult,sqlLoading,]);
   
    return (
      // <PageContainer>
        <LightDragable
        leftContent={leftContent}
        rightContent={rightContent}
        showIcon={false}
        initWidth={150}
        />
      // </PageContainer>
     

    );
  }
  