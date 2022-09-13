import React, { useState} from 'react';
import ShuttleFrame from '@/components/shuttle-frame';
import {START_TIME_ENUMS} from '../../schema';
import {ScheduleOutlined,} from '@ant-design/icons';
import { Form,Select, Space,DatePicker} from 'antd';
const { RangePicker } = DatePicker;
export default function LibraryForm (){
    const [type,setType]=useState<string>("time-interval")
    return <>
    {/* <Form labelCol={{ flex: '110px' }}> */}
     <Form.Item label="目标库">
        <ShuttleFrame  
           showSearch 
           title={["可选项","已选择"]}
           canAddSource={[]}
           alreadyAddTargets={[]}
           onOk={(targetSource:any)=>{}}
         />
          
        </Form.Item>
        <Form.Item label="授权时间" >
          <Space style={{height:20}}>
            {type==="time-interval"?( <Form.Item name="versionRangeOne"  >
             <Select options={START_TIME_ENUMS} allowClear showSearch  style={{width:220}}/>
           </Form.Item>):
           ( <Form.Item name="versionRangeOne"  >
           <RangePicker  style={{ marginLeft: '5px', width: 260 }}  format="YYYY-MM-DD HH:mm:ss" showTime />
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
    {/* </Form> */}
    
    </>
}