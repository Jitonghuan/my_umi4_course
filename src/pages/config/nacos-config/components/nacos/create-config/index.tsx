// 编辑nacos配置
// @author JITONGHUAN <muxi@come-future.com>
// @create 2022/11/1 14:05

import React, { useState, useEffect} from 'react';
import { Drawer, Form, Button, Select, Input, Radio ,Spin} from 'antd';
import AceEditor from '@/components/ace-editor';
import type{AceDataType} from '@/components/ace-editor';
import {getConfigVersions,getConfigDetails,useCreateNacosConfig,useUpdateNacosConfig,useRollbackNacosConfig} from '../hook';
import {formatTypeOptions} from '../schema'

export interface CreateNacosProps {
  mode?: EditorMode;
  initData?: any;
  envCode:string;
  namespaceId:string
  onClose: () => any;
  onSave: () => any;
}

export default function CreateNacos(props: CreateNacosProps) {
 
  const { mode, initData, onClose, onSave,envCode,namespaceId } = props;
  const [editForm] = Form.useForm<any>();
  const [createLoading, createNacosConfig]=useCreateNacosConfig();
  const [rollbackLoading, rollbackNacosConfig]=useRollbackNacosConfig()
  const [updateLoading, updateNacosConfig]=useUpdateNacosConfig()
  const [viewDisabled, setViewDisabled] = useState<boolean>(false);
  const [versionOptions,setVersionOptions]=useState<any>([]);
  const [versionLoading,setVersionLoading]= useState<boolean>(false);
  const [detailLoading,setDetailLoading]= useState<boolean>(false);
  const [detailInfo,setDetailInfo]=useState<any>({})
  const [currentVersionOption,setCurrentVersionOption]=useState<any>({})
  const [formatType,setFormatType]=useState<AceDataType|string>("yaml")
  useEffect(()=>{
    if(!namespaceId||!envCode)return
    if(mode!=="HIDE"&&mode!=="ADD"){
      queryConfigVersions()
    }


  },[mode])
  
  const queryConfigVersions=()=>{
    setVersionLoading(true)
    getConfigVersions({envCode,namespaceId,dataId:initData?.dataId,groupId:initData?.groupId}).then((res)=>{
      setVersionOptions(res)
      setCurrentVersionOption(res[0])
      queryDetailInfo(res[0]?.value)
      editForm.setFieldsValue({
        version:res[0]?.value
      })
      if(res[0]?.isLatest===true&&mode !== 'VIEW'){
        setViewDisabled(false)
      }else {
        setViewDisabled(true)
      }

    }).finally(()=>{
      setVersionLoading(false)
    })
  }
  const queryDetailInfo=(versionId:number)=>{
    setDetailLoading(true)
    getConfigDetails(versionId).then((result)=>{

     setDetailInfo(result)
     editForm.setFieldsValue({
      ...result

     })
     setFormatType(result?.formatType)
    }).finally(()=>{
      setDetailLoading(false)
    })
  }

  useEffect(() => {
    if (mode === 'HIDE' || !initData) return;
    if (mode === 'VIEW') {
      setViewDisabled(true);
    }
    return () => {
      setViewDisabled(false);
      editForm.resetFields();
      setFormatType("yaml")
     
    };
  }, [mode]);
  const handleSubmit = () => {

    const paramsValue = editForm.getFieldsValue();
    if (mode === 'EDIT') {
      if(currentVersionOption?.isLatest!==true){
        rollbackNacosConfig(currentVersionOption?.value).then(()=>{
          onSave()
        })

      }else{
        updateNacosConfig({...paramsValue, envCode,
          namespaceId,}).then(()=>{
            onSave()
          })

      }
    }
   
    if (mode === 'ADD') {
      createNacosConfig({
        ...paramsValue,
        envCode,
        namespaceId,
      }).then(()=>{
        onSave()
      })
    }
  };

  

  return (
    <Drawer
      width={900}
      title={mode === 'EDIT' ? '编辑配置' : mode === 'VIEW' ? '查看配置详情' : '新增配置'}
      placement="right"
      visible={mode !== 'HIDE'}
      onClose={onClose}
      maskClosable={false}
      footer={
        <div className="drawer-footer">
          <Button type="primary" loading={createLoading} onClick={handleSubmit} disabled={mode === 'VIEW'}>
            {currentVersionOption?.isLatest!==true&&mode!=="VIEW"&&mode!=="ADD"?"回滚":"保存"}
          </Button>
          <Button type="default" onClick={onClose}>
            取消
          </Button>
        </div>
      }
    >
    
      <Form form={editForm} labelCol={{ flex: '80px' }}>
        {mode!=="ADD"&&(
            <Form.Item label="切换版本" name="version" rules={[{ required: true, message: '请选择' }]}>
            <Select options={versionOptions} onChange={(value,option:any)=>{
                queryDetailInfo(value)
                setCurrentVersionOption(option)
                if(option?.isLatest===true&&mode !== 'VIEW'){
                  setViewDisabled(false)
                }else{
                  setViewDisabled(true)
                }
  
            }}  loading={versionLoading} style={{ width: 320 }} />
          </Form.Item>

        )}
        <Spin spinning={detailLoading}>
        <Form.Item label="Data ID" name="dataId" rules={[{ required: true, message: '请输入' }]}>
          <Input disabled={viewDisabled} style={{ width: 320 }} />
        </Form.Item>
        <Form.Item label="Group" name="groupId" rules={[{ required: true, message: '请输入' }]}>
          <Input disabled={viewDisabled} style={{ width: 320 }} />
        </Form.Item>
        <Form.Item label="归属应用" name="appName" >
          <Input disabled={viewDisabled} style={{ width: 320 }} />
        </Form.Item>
        <Form.Item label="描述" name="desc" >
          <Input disabled={viewDisabled} style={{ width: 320 }} />
        </Form.Item>
        {mode==="VIEW"&&<Form.Item label="MD5" name="md5" rules={[{ required: true, message: '请输入' }]}>
          <Input disabled={viewDisabled} style={{ width: 320 }} />
        </Form.Item>}
       {mode!=="VIEW"&&(<Form.Item label="配置格式" name="formatType" initialValue={"yaml"}>
        <Radio.Group options={formatTypeOptions} defaultValue={"yaml"} onChange={(e)=>{
          setFormatType(e.target.value)
        }} disabled={viewDisabled} />
        </Form.Item>)} 
       
        <Form.Item label="配置内容" name="content" rules={[{ required: true, message: '这是必填项' }]}>
            <AceEditor mode={formatType||"yaml"} height={500} readOnly={viewDisabled} />
        </Form.Item>

        </Spin>
      
      </Form>

     
   
    </Drawer>
  );
}
