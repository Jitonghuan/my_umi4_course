import React, { useState,useEffect,useMemo,useRef,useCallback} from 'react';
import {  Tabs,Form,Select,message,DatePicker,Input,Divider,Space } from 'antd';
import {InfoCircleOutlined,} from '@ant-design/icons';
import PageContainer from '@/components/page-container';
import LightDragable from "@/components/light-dragable";
import {ScheduleOutlined,} from '@ant-design/icons';
import type { DatePickerProps, RangePickerProps } from 'antd/es/date-picker';
import {START_TIME_ENUMS} from "./schema"
import {useEnvList,useInstanceList,useQueryDatabasesOptions,useQueryTableFieldsOptions,useQueryTablesOptions} from '../../../common-hook'
import RightContent from "./_components/right-content"
import {createSql} from './hook';
import {history} from 'umi';
import './index.less'
import moment from "moment";
const { RangePicker } = DatePicker;
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
  const [type,setType]=useState<string>("time-interval");
  const [startTime,setStartTime]=useState<string|null>(null)
  const [endTime,setEndTime]=useState<string|null>(null)
  const [sqlLoading,setSqlLoading]=useState<boolean>(false);
  const [form]=Form.useForm();
  const [envOptionLoading,  envOptions, queryEnvList]=useEnvList();
  const formRef=useRef<any>(null)
  const [instanceLoading, instanceOptions, getInstanceList]=useInstanceList();
  const [databasesOptionsLoading,databasesOptions,queryDatabases,setSource]=useQueryDatabasesOptions()
  const [tablesOptionsLoading,tablesOptions, queryTables,setTablesSource]=useQueryTablesOptions();
  const [loading, tableFields,tableFieldsOptions, queryTableFields]=useQueryTableFieldsOptions();
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

const selectTimeInterval=useCallback((timeValue:number)=>{
      
  const now = new Date().getTime();
  let end = Number((now + timeValue) / 1000).toString();
  let start = Number(now / 1000).toString();
  setStartTime(start)
  setEndTime(end)
},[])
useEffect(()=>{
  queryEnvList()
  // getInstanceList()
  return()=>{
    setEndTime("")
  }
  
},[])
const onClear=()=>{
  setStartTime(null)
  setEndTime(null)
}
const range = (start: number, end: number) => {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};

const disabledDate: RangePickerProps['disabledDate'] = (current: any) => {
  // Can not select days before today and today
  // return current && current < moment().endOf('day');
  //当前时间小于开始时间，当前时间大于结束时间
  return current && current < moment().endOf('day');
};

const disabledDateTime = (current: any) => {
  const now = new Date().getTime();
  console.log('----now-----',now)
  const startHours = Number(moment(now).hours());
  const endHours = Number(moment(now).hours());
  const startMinutes = Number(moment(now).minutes());
  const endMinutes = Number(moment(now).minutes());
  const startSeconds = Number(moment(now).seconds());
  const endSeconds = Number(moment(now).seconds());
  if (current) {
    const startDate = moment(now).endOf("days").date();
    const endDate = moment(now).endOf("days").date();
    if (current.date() === startDate) {
      return {
        disabledHours: () => range(0, startHours),
        disabledMinutes: () => range(0, startMinutes),
        disabledSeconds: () => range(0, startSeconds),
      }
    }

    if (current.date() === endDate) {
      return {
        disabledHours: () => range(0, endHours),
        disabledMinutes: () => range(0, endMinutes),
        disabledSeconds: () => range(0, endSeconds),
      }
    }
  }
};

  const createSqlApply=useCallback(async(params:querySqlItems)=>{
    const createItems=form?.getFieldsValue()
    if(!end||!start||!createItems?.title||!createItems?.instanceId||!createItems?.dbCode||!params?.sqlContent){
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
       history.push({
         pathname:"/matrix/DBMS/data-change"
       })
     
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
         <Form layout="vertical" form={form} ref={formRef}  >
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
              <Form.Item name="tableCode" label="表：" >
              <Select  placeholder="选择表"  options={tablesOptions} allowClear showSearch loading={tablesOptionsLoading} onChange={()=>{
            const values=form?.getFieldsValue();
            queryTableFields({...values})
            
            } }/>
              </Form.Item>
              <Form.Item name="remark" label="理由：" >
              <Input  placeholder="上线理由"/>
              </Form.Item>
              {/* <Form.Item name="runMode">
              <Select  placeholder="执行方式" options={runModeOptions}/>
              </Form.Item> */}
              <Form.Item name="time" label="执行时间：" rules={[{ required: true, message: '请填写' }]}>
              {/* <Space style={{height:20}}>
            {type==="time-interval"?( <Form.Item name="versionRangeOne" rules={[{ required: true, message: '请选择' }]} >
             <Select options={START_TIME_ENUMS} allowClear showSearch onChange={selectTimeInterval} onClear={onClear}  style={{width:220}}/>
           </Form.Item>):
          
         type==="time-interval"?(
           <Form.Item>
           <ScheduleOutlined style={{ marginLeft: '5px',fontSize:18 }}  onClick={()=>{
             debugger 
             setEndTime(null)
             setStartTime(null)
             form.setFieldsValue({
              validTimeRange:null,
              versionRangeOne:null
             })
             setType("time-ranger")
            
             }} />
           </Form.Item>

         ):(
          <Form.Item>
          <ScheduleOutlined style={{ marginLeft: '5px',fontSize:18 }}  onClick={()=>{setType("time-interval")
        
        setEndTime(null)
        setStartTime(null)
        form.setFieldsValue({
         validTimeRange:null,
         versionRangeOne:null
        })}} />
          </Form.Item>
         )}
          
           
          </Space> */}
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
           <p> 1.多条SQL, 请用英文分号隔开。</p>
           <p style={{whiteSpace:"break-spaces"}}>2.请不要编写对数据库不友好的SQL，以免影响线上业务运行。</p>
           <p>3. 表结构变更和数据订尽量分别提工单。</p>
               {/* <p>4. <b>离线变更</b>指的是发布sql到不同外网的环境。</p>
               <p>5. <b>普通变更</b>指的是发布sql到当前环境</p> */}
           </div>
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
  