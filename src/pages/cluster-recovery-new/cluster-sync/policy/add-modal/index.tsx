import React, { useEffect, useState, useCallback } from 'react';
import { Modal, Select, Button, message, Empty,Form,Card,Divider,Input } from 'antd';
import {useGetDeploymentNameList,useGetNacosNamespaceList,addSyncStrategy,updateSyncStrategy} from '../hooks';

interface Iprops{
    type:string;
    visible:boolean;
    onSave:()=>any;
    onClose:()=>any;
    curRecord:any;
    envCode:string;
   
}
const typeTitleMap:Record<string,string>={
    "app":"新增过滤应用",
    "namespace":"新增命名空间",
    "config":"新增配置项",
    "jvm":"新增JVM参数",
    'edit-config':"编辑配置项",
    "edit-jvm":"编辑JVM参数",

}
const configTypeMap:Record<string,string>={
    "app":"appFilter",
    "namespace":"nacosNs",
    "config":"nacosConf",
    "jvm":"jvmParam",
    'edit-config':"nacosConf",
    "edit-jvm":"jvmParam",

}
export default function AddModal(props:Iprops){
    const {type,visible,onSave,onClose,curRecord,envCode} =props;
    const [loading,namespaceOptions,getNacosNamespaceList]=useGetNacosNamespaceList()
    const [deployLoading, deployOptions, getDeploymentNameList]=useGetDeploymentNameList()
    const [enSureLoading,setEnSureLoading]=useState<boolean>(false)
    
    const [addForm]=Form.useForm()
    useEffect(()=>{
        if(visible&&Object.keys(curRecord)?.length>0){
            addForm.setFieldsValue({
                ...curRecord
            })

        }
        if(visible&&envCode&&type=="namespace"){
            getNacosNamespaceList(envCode)
          

        }
        if(visible&&envCode&&type=="app"){
         
            getDeploymentNameList()

        }
        return()=>{
            addForm.resetFields()
        }

    },[visible])

    const handleSubmit=async()=>{
        setEnSureLoading(true)
        const params=await addForm.validateFields();
        let sendParams:any={}

        if(type==="edit-config"||type==="config"){
            sendParams={
                description:params?.description,
                specialConf:{
                    clusterA:params?.clusterA,
                    clusterB:params?.clusterB 
                }

            }
          

        }
        if(type==="edit-jvm"||type==="jvm"){
            sendParams={
                description:params?.description,
                specialJvm:{
                    clusterA:params?.clusterA,
                    clusterB:params?.clusterB 
                }

            }

        }
      if(type==="app"||type==="namespace"){
           sendParams={...params}
      }


      if(type!=="edit-config"&&type!=="edit-jvm"){
        addSyncStrategy({
            envCode,
            ...sendParams,
            configType:configTypeMap[type],
        }).then((res)=>{
            if(res?.success){
                message.success("新增成功！")
                onSave()

            }
           
        }).finally(()=>{
            setEnSureLoading(false)
        })

      }
      if(type==="edit-config"||type==="edit-jvm"){
        updateSyncStrategy({
            id:curRecord?.id,
            configType:configTypeMap[type],
            envCode,
            ...sendParams,
        }).then((res)=>{
            if(res?.success){
                onSave()
                message.success("编辑成功！")

            }
           
        }).finally(()=>{
            setEnSureLoading(false)
        })
      }
     
   

    }
    return(
        <Modal title={ typeTitleMap[type]} width={800} visible={visible} destroyOnClose onCancel={onClose} onOk={handleSubmit} confirmLoading={enSureLoading}>
            <Form form={addForm} preserve={false} labelCol={{flex:"120px"}} >
                {type==="app"&& <Form.Item label="应用部署名" name="deploymentName" rules={[{ required: true, message: '请填写' }]}>
                    <Select style={{width:280}} options={deployOptions} showSearch allowClear loading={deployLoading} />
                </Form.Item>}
                {type==="namespace"&&<Form.Item label="命名空间名称" name="namespace" rules={[{ required: true, message: '请填写' }]}>
                  <Select style={{width:280}} options={namespaceOptions} showSearch allowClear loading={loading} />
                </Form.Item>}
                {(type==="config"||type==="edit-config")&&<>
                <Form.Item label="A集群配置项" name="clusterA" rules={[{ required: true, message: '请填写' }]}>
                <Input style={{width:280}} />
                </Form.Item>
                <Form.Item label="B集群配置项" name="clusterB" rules={[{ required: true, message: '请填写' }]}>
                <Input style={{width:280}} />
                </Form.Item>
                <Form.Item label="配置项说明" name="description" rules={[{ required: true, message: '请填写' }]}>
                <Input style={{width:280}} />
                </Form.Item>
                </>}
                {(type==="jvm"||type==="edit-jvm")&&<>
                <Form.Item label="A集群JVM参数" name="clusterA" rules={[{ required: true, message: '请填写' }]}>
                <Input style={{width:280}} />
                </Form.Item>
                <Form.Item label="B集群JVM参数" name="clusterB" rules={[{ required: true, message: '请填写' }]}>
                <Input style={{width:280}} />
                </Form.Item>
                <Form.Item label="配置项说明" name="description" rules={[{ required: true, message: '请填写' }]}>
                <Input style={{width:280}} />
                </Form.Item>

                </>}
               
                
              
             
              
             


            </Form>
        </Modal>
    )
}