import React, { useState,useEffect,useMemo,useRef,useCallback} from 'react';
import {  Tabs,Form,Select,message,DatePicker,Input,Divider } from 'antd';
import {InfoCircleOutlined,} from '@ant-design/icons';
import PageContainer from '@/components/page-container';
import LightDragable from "@/components/light-dragable";
import {useEnvList,useInstanceList,useQueryDatabasesOptions,useQueryTableFieldsOptions,useQueryTablesOptions} from '../../../common-hook'
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

const { TabPane } = Tabs;
interface querySqlItems{
  sqlContent?:string;
  dbCode?:string;
  tableCode?:string;
  title?:string;
  // sqlWfType?:string;
  envCode?:string;
  instanceId?:number;
  runStartTime?:string;
  runEndTime?:string;
  runMode?:string;
 

}
export default function ResizeLayout() {

  const [sqlLoading,setSqlLoading]=useState<boolean>(false);
  const [form]=Form.useForm();
  const [envOptionLoading,  envOptions, queryEnvList]=useEnvList();
  const formRef=useRef<any>(null)
  const [instanceLoading, instanceOptions, getInstanceList]=useInstanceList();
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
  // getInstanceList()
  return()=>{
    setEndTime("")
  }
  
},[])

  const createSqlApply=useCallback(async(params:querySqlItems)=>{
    const createItems=form?.getFieldsValue()
    if(!end||!start||!createItems?.title||!createItems?.instanceId||!createItems?.dbCode||!createItems?.tableCode||!params?.sqlContent){
      message.warning("请先进行信息填写且输入sql语句再提交变更！")
      return

    }
    setSqlLoading(true)
   await createSql({
      ...params,
      ...createItems,
      runEndTime:end,
      runStartTime:start,
    }).then((res)=>{
      // if(res?.code===1000){
      //   message.success("提交成功！")
      // }
      if(res?.success){
       message.success("提交成功！")
       history.back()
      }else{
        return
      }

    }).finally(()=>{
      setSqlLoading(false)
    })
  },[start,end])
  
  const leftContent=useMemo(()=>{
    return(
      <div className="change-apply-form">
         <Form layout="vertical" form={form} ref={formRef} >
            <Form.Item name="title" label="标题：" rules={[{ required: true, message: '请填写' }]}>
                <Input   placeholder="标题" />
              </Form.Item>
              {/* <Form.Item name="sqlWfType">
                <Select  placeholder="普通变更" options={sqlWfTypeOptions}/>
              </Form.Item> */}
              <Form.Item  name="envCode" label="环境：" rules={[{ required: true, message: '请填写' }]}>
              <Select  placeholder="选择环境" allowClear showSearch loading={envOptionLoading} options={envOptions} onChange={(value)=>{
                getInstanceList(value)
                form?.setFieldsValue({
                  instanceId:"",
                  dbCode:"",
                  tableCode:""
                })
                }}/>
              </Form.Item>
              <Form.Item name="instanceId" label="实例：" rules={[{ required: true, message: '请填写' }]}>
              <Select  placeholder="选择实例" options={instanceOptions} allowClear showSearch loading={instanceLoading} onChange={(instanceId)=>{
            queryDatabases({instanceId})
            form?.setFieldsValue({
              dbCode:"",
              tableCode:""
            })
            
            
            }} />
              </Form.Item>
              <Form.Item name="dbCode" label="库：" rules={[{ required: true, message: '请填写' }]}>
              <Select  placeholder="选择库" options={databasesOptions} allowClear showSearch loading={databasesOptionsLoading} onChange={(dbCode)=>{queryTables({dbCode,instanceId:form?.getFieldsValue()?.instanceId})
             form?.setFieldsValue({
              tableCode:""
            })}}/>
              </Form.Item>
              <Form.Item name="tableCode" label="表：" rules={[{ required: true, message: '请填写' }]}>
              <Select  placeholder="选择表"  options={tablesOptions} allowClear showSearch loading={tablesOptionsLoading} onChange={()=>{
            const values=form?.getFieldsValue();
            queryTableFields({...values})
            
            } }/>
              </Form.Item>
              <Form.Item name="remark" label="理由：" rules={[{ required: true, message: '请填写' }]}>
              <Input  placeholder="上线理由"/>
              </Form.Item>
              {/* <Form.Item name="runMode">
              <Select  placeholder="执行方式" options={runModeOptions}/>
              </Form.Item> */}
              <Form.Item name="time" label="时间：" rules={[{ required: true, message: '请填写' }]}>
              <RangePicker    onChange={(v: any, b: any) => selectTime(v, b)}
               format="YYYY-MM-DD HH:mm:ss" showTime />
              </Form.Item>
              {/* <Form.Item name="dbCode">
              <Select  placeholder="关联发布计划"/>
              </Form.Item> */}
           </Form>
           <Divider/>
           <div className="info-alert">
           <p><InfoCircleOutlined style={{color:"#6495ED",fontSize:24}} />&nbsp;<span style={{color:"#6495ED",fontSize:20}}><b>说明</b></span></p>
           <p>  
                1.多条SQL, 请用英文分号隔开。
               </p>
               <p>2.请不要编写对数据库不友好的SQL，以免</p>
                <p> 影响线上业务运行。</p>
               <p>3. 表结构变更和数据订尽量分别提工单。</p>
               {/* <p>4. <b>离线变更</b>指的是发布sql到不同外网的环境。</p>
               <p>5. <b>普通变更</b>指的是发布sql到当前环境</p> */}



           </div>
           {/* <Alert 
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
               <p>5. <b>普通变更</b>指的是发布sql到当前环境</p>


             </div>}

           /> */}
        </div>
      
    )
  },[formRef,databasesOptions,tablesOptions,instanceOptions,envOptions,envOptionLoading,tablesOptionsLoading,databasesOptionsLoading,instanceLoading,startTime,endTime])
  
    const rightContent=useMemo(()=>{
      return(
        <>
        <RightContent tableFields={tableFields} createItems={form?.getFieldsValue()} createSql={(params:{sqlContent:string})=>createSqlApply(params)}/>
        </>
      )
    },[tableFields,formRef,form?.getFieldsValue()]);
   
    return (
      <PageContainer>
        <LightDragable
        leftContent={leftContent}
        rightContent={rightContent}
        showIcon={false}
        // initWidth={400}
        dataChangeinitWidth={330}
        />
       </PageContainer>
     

    );
  }
  