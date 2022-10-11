import React, { useState,useCallback,useEffect} from 'react';
import ShuttleFrame from '@/components/shuttle-frame';
import {checkOptions,START_TIME_ENUMS} from '../../schema';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import {ScheduleOutlined,} from '@ant-design/icons';
import {Form,Select,Steps, Space,Checkbox,DatePicker} from 'antd';
import moment from "moment";
const { RangePicker } = DatePicker;
const CheckboxGroup = Checkbox.Group;
export interface IProps {
  databasesOptions:any[];
  submit: (params:any) => any;
  flag:string
  
 
 
}
export default function LibraryForm (props:IProps,){
  const {databasesOptions,submit,flag}=props;
  const [targetSource,setTargetSource]=useState<any>([]);
  const [type,setType]=useState<string>("time-interval");
  const [startTime,setStartTime]=useState<string>('')
  const [endTime,setEndTime]=useState<string>('')
  const now = new Date().getTime();
  
useEffect(()=>{
  if(flag==="submit"){

    submit({
      dbList:targetSource,
      validStartTime:startTime,
      validEndTime:endTime
    })
   

  }
 return()=>{
  
 }
},[flag])


 //选择时间间隔
 const selectTime =useCallback((time: any, timeString: string) => {
  let start = moment(timeString[0]).unix().toString();
  let end = moment(timeString[1]).unix().toString();
  if (start !== 'NaN' && end !== 'NaN') {
    setStartTime(start);
    setEndTime(end);
   
  } 
},[]);


    const onChange = (list: CheckboxValueType[]) => {
  
    };
   
    const selectTimeInterval=useCallback((timeValue:number)=>{
      let start = Number((now - timeValue) / 1000).toString();
      let end = Number(now / 1000).toString();
      setStartTime(start)
      setEndTime(end)
    },[])
    return <>
    {/* <Form labelCol={{ flex: '110px' }}> */}
     <Form.Item label="目标库"  >
        <ShuttleFrame  
           showSearch 
           title={["可选项","已选择"]}
           canAddSource={databasesOptions}
           alreadyAddTargets={[]}
           onOk={(targetSource:any)=>{ setTargetSource(targetSource);console.info("targetSource",targetSource)}}
         />
          
        </Form.Item>
        <Form.Item label="有效期" >
          <Space style={{height:20}}>
            {type==="time-interval"?( <Form.Item name="versionRangeOne" rules={[{ required: true, message: '请选择' }]} >
             <Select options={START_TIME_ENUMS} allowClear showSearch onChange={selectTimeInterval}  style={{width:220}}/>
           </Form.Item>):
           ( <Form.Item name="validTimeRange" rules={[{ required: true, message: '请选择' }]} >
           <RangePicker    onChange={(v: any, b: any) => selectTime(v, b)}
           style={{ marginLeft: '5px', width: 260 }}  format="YYYY-MM-DD HH:mm:ss" showTime />
         </Form.Item>)}
         {type==="time-interval"?(
           <Form.Item>
           <ScheduleOutlined style={{ marginLeft: '5px',fontSize:18 }}  onClick={()=>{setType("time-ranger")}} />&nbsp;<span style={{color:'gray'}}>自定义选择时间范围</span>
           </Form.Item>

         ):(
          <Form.Item>
          <ScheduleOutlined style={{ marginLeft: '5px',fontSize:18 }}  onClick={()=>{setType("time-interval")}} />&nbsp;<span style={{color:'gray'}}>切换时间段选择</span>
          </Form.Item>
         )}
          
           
          </Space>
        </Form.Item>
       
        <Form.Item label="授权功能" name="privList">
        <CheckboxGroup options={checkOptions} onChange={onChange}  />

          
        </Form.Item>
    {/* </Form> */}
    
    </>
}