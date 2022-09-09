// 数据管理-工单详情
// @author JITONGHUAN <muxi@come-future.com>
// @create 2022/09/8 14:50

import React, { useState, useEffect, useRef } from 'react';
import PageContainer from '@/components/page-container';
import type { RadioChangeEvent } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import {options,checkOptions,START_TIME_ENUMS} from './schema'
import { Drawer, Form, Button, Select, Radio,Steps, Card ,Tag,Space,Input,Checkbox,DatePicker} from 'antd';
import {ScheduleOutlined,DingdingOutlined,CheckCircleTwoTone,StarOutlined} from '@ant-design/icons'


const { RangePicker } = DatePicker;
export interface CreateArticleProps {
  mode?: EditorMode;
  curRecord?: any;
  onClose: () => any;
  onSave: () => any;
}
const { Step } = Steps;
const CheckboxGroup = Checkbox.Group;

export default function CreateArticle(props: CreateArticleProps) {
  const createForm:any=Form.useForm()
  const { mode, curRecord, onClose, onSave } = props;
  const [value3, setValue3] = useState('Apple');
  //time-ranger
  const [type,setType]=useState<string>("time-interval")
 
  useEffect(() => {
    if (mode === 'HIDE' || !curRecord) return;
   
    return () => {
     
    };
  }, [mode]);
  const onChange3 = ({ target: { value } }: RadioChangeEvent) => {
    console.log('radio3 checked', value);
    setValue3(value);
  };
  const onChange = (list: CheckboxValueType[]) => {
  
  };

  
  return (
    <Drawer
    width={900}
    title="申请权限"
    placement="right"
    visible={mode !== 'HIDE'}
    onClose={onClose}
    maskClosable={false}
    footer={
      <div className="drawer-footer">
      <Button type="primary" >
        提交申请
      </Button>
      <Button type="default" onClick={onClose}>
        取消
      </Button>
    </div>
    }
    className="apply-detail-drawer"
    >
      <Form labelCol={{ flex: '110px' }} >
        <Form.Item label="对象类型">
        <Radio.Group options={options} onChange={onChange3} value={value3} optionType="button" />
        </Form.Item>
        <Form.Item label="环境">
          <Select options={[]} allowClear showSearch  style={{width:220}}/>
          
        </Form.Item>
        <Form.Item label="实例选择">
        <Select options={[]} allowClear showSearch  style={{width:220}}/>
          
        </Form.Item>
        <Form.Item label="目标库">
          
        </Form.Item>
        <Form.Item label="有效期" >
          <Space>
            {type==="time-interval"?( <Form.Item name="versionRangeOne"  >
             <Select options={START_TIME_ENUMS} allowClear showSearch  style={{width:220}}/>
           </Form.Item>):
           ( <Form.Item name="versionRangeOne"  >
           <RangePicker  style={{ marginLeft: '5px', width: 260 }}  format="YYYY-MM-DD HH:mm:ss" showTime />
         </Form.Item>)}
         {type==="time-interval"?(
           <Form.Item>
           <ScheduleOutlined style={{ marginLeft: '5px',fontSize:18 }}  onClick={()=>{setType("time-ranger")}} />&nbsp;<span style={{color:'gray'}}>自定义选择时间范围</span>
             
           {/* <RangePicker  style={{ marginLeft: '5px', width: 260 }}  format="YYYY-MM-DD HH:mm:ss" showTime /> */}
           </Form.Item>

         ):(
          <Form.Item>
          <ScheduleOutlined style={{ marginLeft: '5px',fontSize:18 }}  onClick={()=>{setType("time-ranger")}} />&nbsp;<span style={{color:'gray'}}>切换时间段选择</span>
            
          {/* <RangePicker  style={{ marginLeft: '5px', width: 260 }}  format="YYYY-MM-DD HH:mm:ss" showTime /> */}
          </Form.Item>
         )}
          
           
          </Space>
        </Form.Item>
       
        <Form.Item label="授权功能">
        <CheckboxGroup options={checkOptions} onChange={onChange}  />

          
        </Form.Item>
        <Form.Item label="理由">
          <Input.TextArea  style={{width:320}}></Input.TextArea>
          
        </Form.Item>
      </Form>

    </Drawer>

     
  );
}
