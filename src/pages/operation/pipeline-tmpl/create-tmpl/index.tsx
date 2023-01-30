import React, { useState, useEffect, useMemo } from 'react';
import { Input, Table, Form, Button, Space,Select,Drawer ,message} from 'antd';
import AceEditor from '@/components/ace-editor';
import {appDevelopLanguageOptions,envTypeData} from '../types';
import {createCicdTemplate,updateCicdTemplate} from '../hook'

interface Iprops{
    mode:EditorMode;
    onClose:()=>void;
    categoryData:any;
    curRecord:any;
    onSave:()=>void;


}
export default function CreateTmpl(props:Iprops){
    const {mode,onClose,categoryData,curRecord,onSave}=props
    const [form]=Form.useForm()
    const [loading,setLoading]=useState<boolean>(false)
    const [appType,setAppType]=useState<string>("")
    const handleSubmit=async()=>{
        const values=await form.validateFields()
        const createRequest=mode==="ADD"?createCicdTemplate:mode==="COPY"?createCicdTemplate:updateCicdTemplate;
        const playloads=mode==="ADD"?{...values}:{...values,id:curRecord?.id}
        setLoading(true)
        createRequest({...playloads,}).then((res)=>{
            if(res?.success){
                message.success(`${mode==="ADD"?"新增成功！":"编辑成功！"}`)
                onSave()


            }
        }).finally(()=>{
            setLoading(false)
        })

    }
    const categoryDataOptions=useMemo(()=>categoryData,[categoryData])
    useEffect(()=>{
        if (mode==="HIDE") return
        if(mode!=="ADD"){
            form.setFieldsValue({
                ...curRecord
            })
            setAppType(curRecord?.appType)

        }
        return()=>{
            form.resetFields()
        }
    },[mode])
   
    return(
    <Drawer 
    open={mode!=="HIDE"} 
    width={900} 
    title={mode==="ADD"?"新增流水线模版":mode==="EDIT"?"编辑流水线模版":mode==="COPY"?"复制流水线模版":"查看流水线模版"}
    onClose={onClose}
    footer={<div className="drawer-footer">
    <Button type="primary" loading={false} onClick={handleSubmit} disabled={mode==="VIEW"} >
      保存
    </Button>
    <Button type="default" onClick={onClose}>
      取消
    </Button>
  </div>}
    >
        <Form layout="horizontal" labelCol={{flex:'100px'}} form={form}>
            <Form.Item label="模版名称" name="templateName" rules={[{ required: true, message: '请输入' }]}>
            <Input  style={{width:300}} disabled={mode==="VIEW"}/>
            </Form.Item>
            <Form.Item label="模版类型" name="templateType" rules={[{ required: true, message: '请选择' }]}>
            <Select style={{width:300}} disabled={mode!=="ADD"} options={[{
                label:"CICD",
                value:'CICD',
                key:'CICD'
            }]}/>
            </Form.Item>
         
            <Form.Item label="应用类型" name="appType" rules={[{ required: true, message: '请选择' }]}>
            <Select style={{width:300}} disabled={mode!=="ADD"} value={appType} onChange={(type)=>{
             setAppType(type)
            }} options={[
                {label:'前端',value:"front"},
                {label:'后端',value:"backend"}
            ]}/>
            </Form.Item>
            <Form.Item label="应用语言" name="languageCode" rules={[{ required: appType==="front"?false: true, message: '请选择' }]}>
               <Select style={{width:300}} disabled={mode!=="ADD"} options={appDevelopLanguageOptions}/>
            </Form.Item>
            <Form.Item label="应用分类" name="appCategoryCode" rules={[{ required: true, message: '请选择' }]}>
                <Select style={{width:300}} disabled={mode!=="ADD"} options={categoryDataOptions} />
            </Form.Item>
            <Form.Item label="构建类型" name="buildType" >
            <Select style={{width:300}} disabled={mode!=="ADD"}/>
            </Form.Item>
            <Form.Item label="模版内容" name="templateValue" rules={[{ required: true, message: '请输入' }]}>
             <AceEditor height={500} mode="yaml"  readOnly={mode==="VIEW"} />
            </Form.Item>
            <Form.Item label="描述" name="templateDesc">
                <Input.TextArea style={{width:600}} disabled={mode==="VIEW"}/>
            </Form.Item>
        </Form>

    </Drawer>)
}