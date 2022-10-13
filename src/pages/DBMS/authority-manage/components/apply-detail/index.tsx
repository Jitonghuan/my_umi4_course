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
import LibraryOwnerForm from '../apply-detail/_components/library-owner-form';
import {useCreatePriv} from './hook';
import moment from "moment";
import {useEnvList,useInstanceList,useQueryDatabasesOptions,useQueryTableFieldsOptions} from '../../../common-hook'


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
  const [createForm]=Form.useForm();
  const [createLoading, createPriv]=useCreatePriv()
  const [envOptionLoading,  envOptions, queryEnvList]=useEnvList();
  const [instanceLoading, instanceOptions, getInstanceList]=useInstanceList();
 
  const [databasesOptionsLoading,databasesOptions,queryDatabases,setSource]=useQueryDatabasesOptions()

  const { mode, curRecord, onClose, onSave } = props;
  const [value, setValue] = useState("database");
  const [flag,setFlag]=useState<string>("");
  const [instanceId,setInstanceId]=useState<any>();
  useEffect(() => {
    if (mode === 'HIDE' ) return;
    queryEnvList()
    getInstanceList()
    // setValue("")
    setValue("database")
    return()=>{
      setFlag("");
      createForm.resetFields()
      setSource([])
      setValue("")
  
    }
    
  }, [mode]);
  const onChange3 = ({ target: { value } }: RadioChangeEvent) => {
    console.log('radio3 checked', value);
    setValue(value);
  };

const submit=async(params:any)=>{
  const values=await createForm.validateFields();
  console.log("params",params)
  
  createPriv({
    // ...values,
    remark:values?.remark,
    limitNum:values?.limitNum,
    privList:  values?.privList,
    dbList:Array.isArray( values?.dbList)? values?.dbList:[ values?.dbList], 
    privWfType:values?.privWfType,
    instanceId:values?.instanceId,
    envCode:values?.envCode,
    tableList:values?.tableList,
    title:values?.title,
    ...params,
    validStartTime:moment(params?.validStartTime*1000).format('YYYY-MM-DD HH:mm:ss'),
    validEndTime:moment(params?.validEndTime*1000).format('YYYY-MM-DD HH:mm:ss'),
    }).then(()=>{
    onSave()
  })

}
  
  return (
    <Drawer
    destroyOnClose
    width={900}
    title="申请权限"
    placement="right"
    visible={mode !== 'HIDE'}
    onClose={onClose}
    maskClosable={false}
    footer={
      <div className="drawer-footer">
      <Button type="primary" loading={createLoading} onClick={()=>{setFlag("submit")}}>
        提交申请
      </Button>
      <Button type="default" onClick={onClose}>
        取消
      </Button>
    </div>
    }
    className="apply-detail-drawer"
    >
      <Form labelCol={{ flex: '110px' }} form ={createForm}  >
       
        <Form.Item label="对象类型" name="privWfType" initialValue={options[0].value} rules={[{ required: true, message: '请选择' }]}>
        <Radio.Group options={options} onChange={onChange3} value={value} optionType="button" />
        </Form.Item>
        <Form.Item label="标题" name="title"  rules={[{ required: true, message: '请填写' }]}>
        <Input style={{width:320}} />
        </Form.Item>
        <Form.Item label="环境" name="envCode" rules={[{ required: true, message: '请选择' }]}>
          <Select options={envOptions} allowClear showSearch loading={envOptionLoading} 
          onChange={(envCode)=>{
            createForm?.setFieldsValue({
              instanceId:"",
              dbCode:"",
              tableCode:""
            })
            setSource([])

          }}
           style={{width:220}}/>
          
        </Form.Item>
        <Form.Item label="实例选择" name="instanceId" rules={[{ required: true, message: '请选择' }]}>
        <Select options={instanceOptions} allowClear showSearch loading={instanceLoading} style={{width:220}} onChange={(instanceId)=>{
          queryDatabases({instanceId})
          setInstanceId(instanceId)
          createForm?.setFieldsValue({
            dbCode:"",
            tableCode:""
          })
          setSource([])
          }}/>
          
        </Form.Item>
        {/* 库权限 */}
        {value==="database"&&<LibraryForm  instanceId={instanceId} flag={flag} submit={(params:any)=>submit(params)} databasesOptions={databasesOptions}  />}
        {/* 表权限 */}
        {value==="table"&&<TableForm  
         instanceId={instanceId}
        databasesOptions={databasesOptions} 
        databasesOptionsLoading={databasesOptionsLoading}
        flag={flag} submit={(params:any)=>submit(params)}
      
        />}
        {/* 库owner权限 */}
        {value==="owner"&&<LibraryOwnerForm  instanceId={instanceId}  flag={flag} submit={(params:any)=>submit(params)} databasesOptions={databasesOptions} />}
        {/* limit限制 */}
        {value==="limit"&&<LimitForm flag={flag}  instanceId={instanceId} submit={(params:any)=>submit(params)}   databasesOptions={databasesOptions} databasesOptionsLoading={databasesOptionsLoading}/>}

     
        <Form.Item label="理由" name="remark">
          <Input.TextArea  style={{width:320}} placeholder="说明理由和用途"></Input.TextArea>
          
        </Form.Item>
      </Form>

    </Drawer>

     
  );
}
