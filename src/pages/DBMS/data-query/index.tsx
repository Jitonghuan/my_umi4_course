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
  const formRef=useRef<any>(null)
  const [form]=Form.useForm();
  const addQueryResult = () => queryResultRef?.current?.addQueryResult();
  const addSqlConsole = () => sqlConsoleRef?.current?.addSqlConsole;
  const queryResultItems=queryResultRef?.current?.queryResultItems;
  //curCopyRecord
  const curCopyRecord=queryResultRef?.current?.curCopyRecord;
  const sqlConsoleItems=sqlConsoleRef?.current?.sqlConsoleItems;
  const queryResultActiveKey=queryResultRef?.current?.queryResultActiveKey;
  const sqlConsoleActiveKey=sqlConsoleRef?.current?.sqlConsoleActiveKey;
  const [envOptionLoading,  envOptions, queryEnvList]=useEnvList();
  const [instanceLoading, instanceOptions, getInstanceList]=useInstanceList();
  const [databasesOptionsLoading,databasesOptions,queryDatabases,setSource]=useQueryDatabasesOptions()
  const [tablesOptionsLoading,tablesOptions, queryTables,setTablesSource]=useQueryTablesOptions();
  const [loading, tableFields,tableFieldsOptions, queryTableFields,setOptions]=useQueryTableFieldsOptions();
  const [initSqlValue,setInitSqlValue]=useState<string>("")
  // const initSqlValue = useRef<any>(null);
  const [firstInitSqlValue,setFirstInitSqlValue]=useState<string>("")
  // const sqlValue= useRef<any>(null);
 

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
        <li className="schema-li-map" style={{listStyle:"none"}}><Space><ZoomInOutlined   style={{color:'#3591ff'}} />
        <InsertRowAboveOutlined onDoubleClick={
         ()=> {
           const table=form?.getFieldValue("tableCode")
          //initValue
          // initSqlValue.current=`select ${item||"*"} from ${table} limit 10`
          let initsql= `select ${item||"*"} from ${table} limit 10`
           addSqlConsole
           setInitSqlValue(initsql)
           
        }
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
        <Form layout="vertical" form={form} ref={formRef}>
          <Form.Item name="envCode">
           
            <Select  placeholder="选择环境" allowClear showSearch loading={envOptionLoading} options={envOptions}onChange={()=>{
               form?.setFieldsValue({
                instanceId:"",
                dbCode:"",
                tableCode:""
              })
              setOptions([])
            }} />
          </Form.Item>
          <Form.Item name="instanceId">
          <Select  placeholder="选择实例" options={instanceOptions} allowClear showSearch loading={instanceLoading} onChange={(instanceId)=>{
            form?.setFieldsValue({
              dbCode:"",
              tableCode:""
            })
            queryDatabases({instanceId})
            setOptions([])
            
            }}/>
          </Form.Item>
          <Form.Item name="dbCode">
          <Select  placeholder="选择库" options={databasesOptions} allowClear showSearch loading={databasesOptionsLoading} onChange={(dbCode)=>{
            queryTables({dbCode,instanceId:form?.getFieldsValue()?.instanceId})
            form?.setFieldsValue({
             
              tableCode:""
            })
            setOptions([])
            }}/>
          </Form.Item>
          <Form.Item name="tableCode">
          <Select  placeholder="选择表" options={tablesOptions} allowClear showSearch loading={tablesOptionsLoading} onChange={(table)=>{
            const values=form?.getFieldsValue();
            setOptions([])
            queryTableFields({...values})
            setFirstInitSqlValue(`select * from ${table} limit 10`)
            setInitSqlValue(`select * from ${table} limit 10`)
            
            } } />
          </Form.Item>
        </Form>
        {/* ----表字段展示----- */}
      
        {tableMap()}

      </div>
      </>
    )
  },[queryResultItems,sqlConsoleItems,queryResultActiveKey,sqlConsoleActiveKey,envOptions,instanceOptions,databasesOptions,tablesOptions,tableFieldsOptions,initSqlValue,firstInitSqlValue,sqlLoading])
    
    const rightContent=useMemo(()=>{
      return(
        <>
          <div className="container-top">
            {console.log("初始值",initSqlValue)}
          <SqlConsole ref={sqlConsoleRef} tableFields={tableFields}  querySqlResult={(params:{sqlContent:string,sqlType:string})=>querySqlResult(params)} sqlLoading={sqlLoading} firstInitSqlValue={firstInitSqlValue} initSqlValue={initSqlValue} />
          
          </div>
          <div className="container-bottom">
            
            <QueryResult ref={queryResultRef} sqlResult={sqlResult} sqlLoading={sqlLoading} formRef={formRef} queryTableFields={queryTableFields} />
         
            
          </div>

        </>
      )
    },[queryResultItems,sqlConsoleItems,queryResultActiveKey,sqlConsoleActiveKey,tableFields,sqlResult,sqlLoading,initSqlValue,firstInitSqlValue]);
   
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
  