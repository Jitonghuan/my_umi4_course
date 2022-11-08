import React, { useState,useEffect} from 'react';
import ShuttleFrame from '@/components/shuttle-frame';
import {START_TIME_ENUMS} from '../../schema';
import {ScheduleOutlined,} from '@ant-design/icons';
import {Form, Select, Space,DatePicker,InputNumber} from 'antd';
import {useQueryTablesOptions} from '../../../../../common-hook'
import moment from "moment";
import '../../index.less'
const { RangePicker } = DatePicker;
export interface IProps {
  databasesOptions:any[];
  databasesOptionsLoading:boolean;
  submit: (params:any) => any;
  flag:string
  instanceId:number
  count:number
  createFormRef:any

}
export default  function LibraryForm (props:IProps,ref:any){
    const {databasesOptions,databasesOptionsLoading,submit,flag,instanceId,count,createFormRef}=props
    const [type,setType]=useState<string>("time-interval")
    const [targetSource,setTargetSource]=useState<any>([]);
    const [tablesOptionsLoading,tablesOptions, queryTables,setTablesSource]=useQueryTablesOptions();
    const [startTime,setStartTime]=useState<string|null>(null)
    const [endTime,setEndTime]=useState<string|null>('')
 useEffect(()=>{
  if(flag==="submit"){

    submit({
      tableList:targetSource,
        validStartTime:startTime,
        validEndTime:endTime
    })
   

  }
 return()=>{
  
 }
},[flag,count])
   const selectTimeInterval=(timeValue:number)=>{
    const now = new Date().getTime();
    let end = Number((now + timeValue) / 1000).toString();
    let start = Number(now / 1000).toString();
    setStartTime(start)
    setEndTime(end)
  }
   //选择时间间隔
const selectTime = (time: any, timeString: string) => {
let start = moment(timeString[0]).unix().toString();
let end = moment(timeString[1]).unix().toString();
if (start !== 'NaN' && end !== 'NaN') {
  setStartTime(start);
  setEndTime(end);
 
} 
};
const onClear=()=>{
  setStartTime(null)
  setEndTime(null)
}

    return <>
    {/* <Form labelCol={{ flex: '110px' }}> */}
    <Form.Item label="目标库" name="dbList" rules={[{ required: true, message: '请选择' }]}>
          <Select options={databasesOptions} loading={databasesOptionsLoading} onChange={(dbCode)=>{
            queryTables({dbCode,instanceId}
             
            )
            setTablesSource([])
            }} allowClear showSearch  style={{width:220}}/>
          
        </Form.Item>
     <Form.Item label="目标表" className="nesting-form-item" rules={[{ required: true, message: '请选择' }]}>
        <ShuttleFrame  
           showSearch 
           title={["可选项","已选择"]}
           canAddSource={tablesOptions}
           alreadyAddTargets={[]}
           onOk={(targetSource:any)=>{setTargetSource(targetSource)}}
           limit={20}
         />
          
        </Form.Item>
        <Form.Item label="有效期" className="nesting-form-item"  rules={[{ required: true, message: '请选择' }]}>
          <Space style={{height:20}}>
            {type==="time-interval"?( <Form.Item name="versionRangeOne"  >
             <Select options={START_TIME_ENUMS} onClear={onClear} allowClear showSearch onChange={selectTimeInterval} style={{width:220}}/>
           </Form.Item>):
           ( <Form.Item name="versionRangeOne"  >
           <RangePicker  style={{ marginLeft: '5px', width: 260 }} onChange={(v: any, b: any) => selectTime(v, b)} format="YYYY-MM-DD HH:mm:ss" showTime />
         </Form.Item>)}
         {type==="time-interval"?(
           <Form.Item>
           <ScheduleOutlined style={{ marginLeft: '5px',fontSize:18 }}  onClick={()=>{
             setType("time-ranger")
          
             setEndTime(null)
             setStartTime(null)
             createFormRef.current.setFieldsValue({
              validTimeRange:null,
              versionRangeOne:null
             })
             }} />&nbsp;<span style={{color:'gray'}}>自定义选择时间范围</span>
           </Form.Item>

         ):(
          <Form.Item>
          <ScheduleOutlined style={{ marginLeft: '5px',fontSize:18 }}  onClick={()=>{setType("time-interval")

setEndTime(null)
setStartTime(null)
createFormRef.current.setFieldsValue({
 validTimeRange:null,
 versionRangeOne:null
})
        }} />&nbsp;<span style={{color:'gray'}}>切换时间段选择</span>
          </Form.Item>
         )}
          
           
          </Space>
        </Form.Item>
       
        <Form.Item label="授权行数" name="limitNum" rules={[{ required: true, message: '请输入' }]}>
          <InputNumber placeholder="请输入" min={1}  style={{width:220}}/>
          
        </Form.Item>
    {/* </Form> */}
    
    </>
}