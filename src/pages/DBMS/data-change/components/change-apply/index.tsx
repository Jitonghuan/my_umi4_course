import React, { useState,useEffect,Component,useMemo,useRef,useCallback} from 'react';
import {  Tabs,Form,Space,Button,Select,message,DatePicker,Input,Alert,Divider } from 'antd';
import {RightCircleFilled,InsertRowAboveOutlined,ZoomInOutlined} from '@ant-design/icons';
import PageContainer from '@/components/page-container';
import LightDragable from "@/components/light-dragable";
import {useEnvList,querySqlResultInfo,useQueryLogsList,useInstanceList,useQueryDatabasesOptions,useQueryTableFieldsOptions,useQueryTablesOptions} from '../../../common-hook'
import ChangeForm from "./_components/change-form";
import RightContent from "./_components/right-content"
import {createSql} from './hook';
import './index.less'
import moment from "moment";
const { RangePicker } = DatePicker;

const sqlWfTypeOptions=[
  {
    label:"普通变更",
    value:"normal"
  },
  {
    label:"离线变更",
    value:"offline"
  }
]
const runModeOptions=[
  {
    label:"立即执行",
    value:1
  },
  {
    label:"定时执行",
    value:2
  }
]
// import './index.less';
const { TabPane } = Tabs;
interface querySqlItems{
  sqlContent?:string;
  dbCode?:string;
  tableCode?:string;
  title?:string;
  sqlWfType?:string;
  envCode?:string;
  instanceId?:number;
  runStartTime?:string;
  runEndTime?:string;
  runMode?:string;
 

}
export default function ResizeLayout() {

  const [sqlLoading,setSqlLoading]=useState<boolean>(false);
  const [form]=Form.useForm();
  // const changeFormRef = useRef<any>(null);
  // const createItems=changeFormRef?.current?.createItems;
  // const onFinish = () => changeFormRef?.current?.onFinish();
  const [envOptionLoading,  envOptions, queryEnvList]=useEnvList();
  const formRef=useRef<any>(null)
  const [instanceLoading, instanceOptions, getInstanceList]=useInstanceList();
  const [dataParams,setDataParams]=useState<any>({});
  const [databasesOptionsLoading,databasesOptions,queryDatabases,setSource]=useQueryDatabasesOptions()
  const [tablesOptionsLoading,tablesOptions, queryTables,setTablesSource]=useQueryTablesOptions();
  const [loading, tableFields,tableFieldsOptions, queryTableFields]=useQueryTableFieldsOptions();
  const [startTime,setStartTime]=useState<string>('')
  const [endTime,setEndTime]=useState<string>('')
  const [start,setStart]=useState<string>("")
  const [end,setEnd]=useState<string>("")
   //选择时间间隔
 const selectTime =useCallback((time: any, timeString: any) => {
  
  let start = moment(timeString[0]).unix().toString();
  let end = moment(timeString[1]).unix().toString();
  setStart(timeString[0])
  setEnd(timeString[1])
  if (start !== 'NaN' && end !== 'NaN') {
    setStartTime(start);
    setEndTime(end);
   
  } 
},[]);
useEffect(()=>{
  queryEnvList()
  getInstanceList()
  // queryLogsList()
  return()=>{
    setEndTime("")
  }
  
},[])

 
 
  const createSqlApply=useCallback(async(params:querySqlItems)=>{
    setSqlLoading(true)
    const createItems=form?.getFieldsValue()
   console.log("startTime",startTime)
  
   await createSql({
      ...params,
      ...createItems,
      runEndTime:end,
      runStartTime:start,
    }).then((res)=>{
      if(res?.success){
       message.success("提交成功！")
      }else{
        return
      }

    }).finally(()=>{
      setSqlLoading(false)
    })
  },[start,end])
  
  const leftContent=useMemo(()=>{
    return(
    
      <>
         <Form layout="vertical" form={form} ref={formRef} >
            <Form.Item name="title">
                <Input   placeholder="标题" />
    
              </Form.Item>
              <Form.Item name="sqlWfType">
                <Select  placeholder="在线变更" options={sqlWfTypeOptions}/>
    
              </Form.Item>

              <Form.Item  name="envCode">
              <Select  placeholder="选择环境" allowClear showSearch loading={envOptionLoading} options={envOptions}/>
              </Form.Item>

            
              <Form.Item name="instanceId">
              <Select  placeholder="选择实例" options={instanceOptions} allowClear showSearch loading={instanceLoading} onChange={(instanceId)=>{
            queryDatabases({instanceId})
            
            }} />
              </Form.Item>
              <Form.Item name="dbCode">
              <Select  placeholder="选择库" options={databasesOptions} allowClear showSearch loading={databasesOptionsLoading} onChange={(dbCode)=>{queryTables({dbCode,instanceId:form?.getFieldsValue()?.instanceId})}}/>
              </Form.Item>
              <Form.Item name="tableCode">
              <Select  placeholder="选择表"  options={tablesOptions} allowClear showSearch loading={tablesOptionsLoading} onChange={()=>{
            const values=form?.getFieldsValue();
            queryTableFields({...values})
            
            } }/>
              </Form.Item>
              <Form.Item name="remark">
              <Input  placeholder="上线理由"/>
              </Form.Item>
              {/* <Form.Item name="runMode">
              <Select  placeholder="执行方式" options={runModeOptions}/>
              </Form.Item> */}
              <Form.Item name="time">
              <RangePicker    onChange={(v: any, b: any) => selectTime(v, b)}
           format="YYYY-MM-DD HH:mm:ss" showTime />
              </Form.Item>
              {/* <Form.Item name="dbCode">
              <Select  placeholder="关联发布计划"/>
              </Form.Item> */}
           </Form>
           <Divider/>
           <Alert 
             message="说明" 
             type="info" 
             showIcon 
             description={
             <div className="info-alert">
               <p>  
                1.多条SQL, 请用英文分号隔开。
               </p>
               <p>2.请不要编写对数据库不友好的SQL，以免影响线上业务运行。</p>
               <p>3. 表结构变更和数据订尽量分别提工单。</p>
               <p>4. <b>离线变更</b>指的是发布sql到不同外网的环境。</p>
               <p>5. <b>在线变更</b>指的是发布sql到当前环境</p>


             </div>}

           />
        </>
      
    )
  },[formRef,databasesOptions,tablesOptions,instanceOptions,sqlWfTypeOptions,envOptions,envOptionLoading,tablesOptionsLoading,databasesOptionsLoading,instanceLoading,startTime,endTime])
  
    const rightContent=useMemo(()=>{
      return(
        <>
        <RightContent tableFields={tableFields} createItems={form?.getFieldsValue()} createSql={(params:{sqlContent:string})=>createSqlApply(params)}/>
        </>
      )
    },[tableFields,formRef,form?.getFieldsValue()]);
   
    return (
      // <PageContainer>
        <LightDragable
        leftContent={leftContent}
        rightContent={rightContent}
        showIcon={false}
        initWidth={150}
        />
      //  </PageContainer>
     

    );
  }
  