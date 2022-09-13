// 数据管理-工单详情
// @author JITONGHUAN <muxi@come-future.com>
// @create 2022/09/8 14:50

import React, { useState, useEffect, useRef } from 'react';
import PageContainer from '@/components/page-container';
import type { RadioChangeEvent } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import {options,checkOptions,START_TIME_ENUMS} from './schema';
import { Drawer, Form, Button, Select, Radio,Steps, Card ,Tag,Space,Input,Checkbox,DatePicker} from 'antd';
import {ScheduleOutlined,DingdingOutlined,CheckCircleTwoTone,StarOutlined} from '@ant-design/icons';
import ShuttleFrame from '@/components/shuttle-frame';
import LibraryForm from '../apply-detail/_components/library-form';
import TableForm from '../apply-detail/_components/table-form';
import LimitForm from '../apply-detail/_components/limit-form';
import LibraryOwnerForm from '../apply-detail/_components/library-owner-form'


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
  const [value, setValue3] = useState('library');
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
        <Radio.Group options={options} onChange={onChange3} value={value} optionType="button" />
        </Form.Item>
        <Form.Item label="环境">
          <Select options={[]} allowClear showSearch  style={{width:220}}/>
          
        </Form.Item>
        <Form.Item label="实例选择">
        <Select options={[]} allowClear showSearch  style={{width:220}}/>
          
        </Form.Item>
        {value==="library"&&<LibraryForm />}
        {value==="table"&&<TableForm/>}
        {value==="libraryOwner"&&<LibraryOwnerForm/>}
        {value==="limit"&&<LimitForm/>}

     
        <Form.Item label="理由">
          <Input.TextArea  style={{width:320}} placeholder="说明理由和用途"></Input.TextArea>
          
        </Form.Item>
      </Form>

    </Drawer>

     
  );
}
