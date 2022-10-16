import React, { useState,useEffect,useMemo,useRef,} from 'react';
import {  Tabs,Form,Space,Select,message,Collapse,Spin,Input } from 'antd';
import {CaretRightOutlined,InsertRowAboveOutlined,ZoomInOutlined} from '@ant-design/icons';
import LightDragable from "@/components/light-dragable";
import QueryResult from "./components/query-result";
import SqlConsole from "./components/sql-console";
import {useEnvList,querySqlResultInfo,useInstanceList,useQueryDatabasesOptions,useQueryTableFieldsOptions,useQueryTablesOptions} from '../common-hook'

import './index.less';
const { TabPane } = Tabs;
const { Panel } = Collapse;
export default function ResizeLayout() {
  const sqlConsoleRef = useRef<any>(null);
  const queryResultRef = useRef<any>(null);
  const formRef=useRef<any>(null)
  const [form]=Form.useForm();
  const addQueryResult = () => queryResultRef?.current?.addQueryResult();
  const addSqlConsole = () => sqlConsoleRef?.current?.addSqlConsole;
  const queryResultItems=queryResultRef?.current?.queryResultItems;
  const sqlConsoleItems=sqlConsoleRef?.current?.sqlConsoleItems;
  const queryResultActiveKey=queryResultRef?.current?.queryResultActiveKey;
  const sqlConsoleActiveKey=sqlConsoleRef?.current?.sqlConsoleActiveKey;
  const [envOptionLoading,  envOptions, queryEnvList]=useEnvList();
  const [instanceLoading, instanceOptions, getInstanceList]=useInstanceList();
  const [databasesOptionsLoading,databasesOptions,queryDatabases,setSource]=useQueryDatabasesOptions()
  const [tablesOptionsLoading,tablesOptions, queryTables,setTablesSource]=useQueryTablesOptions();
  const [fieldsLoading, tableFields,tableFieldsOptions, queryTableFields,setOptions]=useQueryTableFieldsOptions();
  const [initSqlValue,setInitSqlValue]=useState<string>("")
  const [implementDisabled,setImplementDisabled]=useState<boolean>(true);
  const [firstInitSqlValue,setFirstInitSqlValue]=useState<string>("")
  const [sqlLoading,setSqlLoading]=useState<boolean>(false);
  const [sqlResult,setSqlResult]=useState<any>("");
  const [addCount,setAddCount]=useState<number>(0);
  const [tableCode,setTableCode]=useState<string>("");
  const [originData,setOriginData]=useState<any>([]);
  const [filterFlag,setFilterFlag]=useState('');
  //sql console 页面的新增按钮方法
  const onAdd=()=>{
    const values=form?.getFieldsValue();
    let initsql="select * from user limit 10"
    if(tableCode){
      initsql= `select * from ${tableCode} limit 10`
      setImplementDisabled(false)
    }else if(!tableCode){
      setImplementDisabled(true)
    }
    addSqlConsole
    setInitSqlValue(initsql)
    setAddCount(count=>count+1)
  }
 //查询sql结果
  const querySqlResult=(params:{sqlContent:string,sqlType:string})=>{
    const values=form?.getFieldsValue();
    if(!values?.instanceId||!values?.dbCode||!tableCode||!params?.sqlContent){
      message.warning("请先进行信息填写并且输入sql语句再查询！")
      return
    }
    setSqlLoading(true)
    console.log("----tableCode",tableCode)
    querySqlResultInfo({...params,... values,tableCode}).then((res)=>{
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
    return()=>{
      setFilterFlag('')
    }
  },[])
  const onFilterChange = (e:any) => {
    setFilterFlag('filter')
    let data=tablesOptions?.map((item:any)=>({
      ...item

    }))
    setOriginData(data)

    const newKeys = tablesOptions?.map((item:any) => {
        if (item.value.indexOf(e) > -1) {
          return ({
            ...item
          });
        }
        return null;
      }).filter((item:any, i:any, self:any) => item && self.indexOf(item) === i);
   
  

    
    setTablesSource(newKeys)
    
  };

  const tabelMap=()=>{
    return(
      <Collapse 
      accordion
      bordered={false} 
      // defaultActiveKey={-1}
      expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />} 
      className="site-collapse-custom-collapse"
      onChange={(value)=>{
        if(value){
          setTableCode(value)
          const values=form?.getFieldsValue();
          setOptions([])
          queryTableFields({...values,tableCode:value})
          setFirstInitSqlValue(`select * from ${value} limit 10`)
          // setInitSqlValue(`select * from ${table} limit 10`)
          if(!values?.instanceId||!values?.dbCode||!value){
            setImplementDisabled(true)
          }else if(values?.instanceId&&values?.dbCode&&value){
            setImplementDisabled(false)
          }
        } 
      }}
      >
     {tablesOptions?.map((item:any)=>{
        return(
          <Panel 
            header={item?.value} 
            key={item?.value} 
            className="site-collapse-custom-panel"
            >
               <Spin spinning={fieldsLoading}>
             {tableFieldsOptions?.length>0&&<p className="site-collapse-custom-panel-content"> {tableFilesMap()}</p>}  
               </Spin>
          
          </Panel>
         
        )
      })}
       </Collapse>

     
    )
  }


  //表字段渲染
  const tableFilesMap=()=>{
   return( tableFieldsOptions?.map((item:string)=>{
      return(
       
            <li className="schema-li-map" style={{listStyle:"none"}}><Space>
           <InsertRowAboveOutlined onDoubleClick={
            ()=> {
          //  const table=form?.getFieldValue("tableCode")
          let initsql= `select ${item||"*"} from ${tableCode} limit 10`
           addSqlConsole
           setInitSqlValue(initsql)
        }
      }  style={{color:"#6495ED",fontSize:16}}/><span>{item}</span></Space></li>

      
      
      )

    })
   )
  }
  const copyAdd=(sqlContent:string)=>{
    let initsql= sqlContent||"select * from user limit 10"
    addSqlConsole
    setInitSqlValue(initsql)
    setImplementDisabled(false)
    const dbCode=form?.getFieldsValue()?.dbCode
    queryTables({dbCode,instanceId:form?.getFieldsValue()?.instanceId})
    
  }
  const reset=()=>{
    //一进页面就点重置
    if(tablesOptions.length>0&&filterFlag!=="filter"){
      setTablesSource(tablesOptions)
    }else{
      //正常筛选数据
    setTablesSource(originData)
      
    }
    
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
                searchFileds:""
                // tableCode:""
              })
              setTableCode("")
              setImplementDisabled(false)
              setTablesSource([])
              setOptions([])
            }} />
          </Form.Item>
          <Form.Item name="instanceId">
          <Select  placeholder="选择实例" options={instanceOptions}  showSearch loading={instanceLoading} onChange={(instanceId)=>{
            form?.setFieldsValue({
              dbCode:"",
              searchFileds:""
              // tableCode:""
            })
            setTableCode("")
            setTablesSource([])
            queryDatabases({instanceId})
            setOptions([])
            setImplementDisabled(false)
            
            }}/>
          </Form.Item>
          <Form.Item name="dbCode">
          <Select  placeholder="选择库" options={databasesOptions}  showSearch loading={databasesOptionsLoading} onChange={(dbCode)=>{
            queryTables({dbCode,instanceId:form?.getFieldsValue()?.instanceId})
            form?.setFieldsValue({
             
              searchFileds:""
            })
            setTableCode("")
            setOptions([])
            setTablesSource([])
            setImplementDisabled(false)
            }}/>
          </Form.Item>
          <Form.Item name="searchFileds" style={{display:"flex",alignItems:"center"}}>
            <Input.Search placeholder="请输入表名进行搜索" style={{width:'86%'}} onSearch={onFilterChange} ></Input.Search>
           &nbsp; <span className="rest-btn" onClick={reset}>重置</span>
          </Form.Item>
          <Form.Item name="tableCode">
            <Spin spinning={tablesOptionsLoading}>
            {tabelMap()}
              
            </Spin>
           
          {/* <Select  placeholder="选择表" options={tablesOptions} allowClear showSearch loading={tablesOptionsLoading} onChange={(table)=>{
            const values=form?.getFieldsValue();
            setOptions([])
            queryTableFields({...values})
            setFirstInitSqlValue(`select * from ${table} limit 10`)
            // setInitSqlValue(`select * from ${table} limit 10`)
            if(!values?.instanceId||!values?.dbCode||!values?.tableCode){
              setImplementDisabled(true)
            }else if(values?.instanceId&&values?.dbCode&&values?.tableCode){
              setImplementDisabled(false)
            }
            
            } } /> */}
          </Form.Item>
        </Form>
        {/* ----表字段展示----- */}
      
       

      </div>
      </>
    )
  },[queryResultItems,implementDisabled,sqlConsoleItems,fieldsLoading,tablesOptionsLoading,instanceLoading,databasesOptionsLoading,envOptionLoading,queryResultActiveKey,sqlConsoleActiveKey,envOptions,instanceOptions,databasesOptions,tablesOptions,tableFieldsOptions,initSqlValue,firstInitSqlValue,sqlLoading])
    
    const rightContent=useMemo(()=>{
      return(
        <>
          <div className="container-top">
          
          <SqlConsole 
          ref={sqlConsoleRef} 
          tableFields={tableFields} 
          querySqlResult={(params:{sqlContent:string,sqlType:string})=>querySqlResult(params)} 
          sqlLoading={sqlLoading} 
          firstInitSqlValue={firstInitSqlValue} 
          initSqlValue={initSqlValue}
          onAdd={onAdd}
          addCount={addCount}
          implementDisabled={implementDisabled} />
          
          </div>
          <div className="container-bottom">
            
            <QueryResult 
            ref={queryResultRef} 
            sqlResult={sqlResult} 
            sqlLoading={sqlLoading} 
            formRef={formRef} 
            queryTableFields={queryTableFields}
            copyAdd={(sqlContent:string)=>copyAdd(sqlContent)}
             />
         
            
          </div>

        </>
      )
    },[queryResultItems,sqlConsoleItems,implementDisabled,queryResultActiveKey,sqlConsoleActiveKey,tableFields,sqlResult,sqlLoading,initSqlValue,firstInitSqlValue,implementDisabled,addCount]);
   
    return (
      // <ContentCard>
        <LightDragable
        leftContent={leftContent}
        rightContent={rightContent}
        showIcon={false}
        initWidth={150}
        />
    //  </ContentCard>
     

    );
  }
  