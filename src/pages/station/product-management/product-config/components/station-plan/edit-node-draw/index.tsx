// @author JITONGHUAN <muxi.jth@come-future.com>
// @create 2022/05/10 10:30

import React from 'react';
import { useState, useEffect } from 'react';
import { Drawer, Button, Form, Spin, Select, Input, Switch,message ,InputNumber} from 'antd';
import {  saveServerInfo } from '../hook';
import { getRequest } from '@/utils/request';
import { checkServerIpApi, checkServerInfoApi, } from '../../../../../service';
import {useGetListNacosPurposeInfo,useGetListNacosRoleInfo} from '../hook';



export interface IProps {
    indentId:number;
    mode: EditorMode;
    curRecord: any;
    onClose?: () => any;
    onSave: () => any;
}

export default function EditNodeDraw(props: IProps) {
    const [nodeForm] = Form.useForm();
    const { mode, curRecord, onClose, onSave,indentId } = props;
    const [loading, setLoading] = useState<boolean>(false);
    const [type, setType] = useState<string>('');
    const [serverRightInfo, setServerRightInfo] = useState<boolean>(false);
    const [serverType, setServerType]=useState<string>('');
    const [serverErrorMessage, setServerErrorMessage] = useState<string>('');
    const [rightInfo, setRightInfo] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [infoLoading,purposeOptions, getListNacosPurposeInfo]=useGetListNacosPurposeInfo()
    const [roleLoading,roleOptions, getListNacosRoleInfo]=useGetListNacosRoleInfo();
    const [isRootDiskChecked, setIsRootDiskChecked] = useState<boolean>(false);
    const [enableNfsChecked, setEnableNfsChecked] = useState<boolean>(false);
   
    const onEnableNfsChange=(checked: boolean)=>{
      if (checked === true) {
        setEnableNfsChecked(true);
          
        } else {
          setEnableNfsChecked(false);
          
        }

  }
  const onRootDiskChange=(checked: boolean)=>{
    if (checked === true) {
      setIsRootDiskChecked(true);
        
      } else {
        setIsRootDiskChecked(false);
        
      }

}
    useEffect(()=>{
        if (mode === 'HIDE') return;
        if(mode==="EDIT"){
            nodeForm.setFieldsValue({
                ...curRecord,
                // enableNfs:curRecord?.enableNfs?true:false,
                // isRootDisk:curRecord?.isRootDisk?true:false
            })
           setEnableNfsChecked(curRecord?.enableNfs?true:false,) 
           setIsRootDiskChecked( curRecord?.isRootDisk?true:false)
          
            // onServerIpChange()
            // onHostnameChange()

        }
        getListNacosPurposeInfo()
        getListNacosRoleInfo()
        return()=>{
          nodeForm.resetFields()
          setIsRootDiskChecked(false)
          setEnableNfsChecked(false)
          setServerRightInfo(false)
          setRightInfo(false)
          setServerType("")
          setType("")
        }

    },[mode])
    const handleSubmit = async() => {
      const values=  await nodeForm.validateFields();
      saveServerInfo({indentId,server:{...values,cpu:parseInt(values?.cpu),memory:parseInt(values?.memory),enableNfs:values?.enableNfs?true:false,isRootDisk:values?.isRootDisk===true?true:false}}).then((res)=>{
          if(res?.code===1000){
              message.success(res?.data)
              onSave()

          }
      })

    };
    const onServerIpChange = (value?: any) => {
        let formData = nodeForm.getFieldsValue();
        getCheck("serverIp",formData.serverIp,checkServerInfoApi);
      };
      const onHostnameChange = (value?: any) => {
        let formData = nodeForm.getFieldsValue();
        getCheck("hostname",formData.hostname,checkServerInfoApi );
      };
    const getCheck = async (
        key:string,
        value: string, 
        ip:string
      ) => {
        setLoading(true);
        if(key==="serverIp"){
          setServerType('begin');

          }else{
            setType('begin');
          }
         
        
        try {
          await getRequest(
            `${ip}?indentId=${indentId}&${key}=${value}`,
          )
            .then((res) => {
              if (res.success && res.data === 'success') {
                if(key==="serverIp"){
                setServerRightInfo(true)

                }else{
                  setRightInfo(true);
                }
                if(key==="serverIp"){
                  setServerType('success');
        
                  }else{
                    setType('success');
                  }
    
                
              } else if (res.success && res.data !== 'success') {
               
                if(key==="serverIp"){
                  setServerRightInfo(false)
  
                  }else{
                    setRightInfo(false);
                  }
                if(key==="serverIp"){
                  setServerErrorMessage(res?.data)
                }else{
                  setErrorMessage(res?.data);
                }
                if(key==="serverIp"){
                  setServerType('error');
        
                  }else{
                    setType('error');
                  }
    
               
              
                return;
              }
            })
            .finally(() => {
              setLoading(false);
            });
        } catch (error) {
          console.log(error);
        }
      };
 const onblur=()=>{}


    return (
        <Drawer
            destroyOnClose
            visible={mode !== 'HIDE'}
            title={mode==="ADD"?"新增节点":"编辑节点"}
            // maskClosable={false}
            onClose={onClose}
            width={'40%'}
            footer={
                <div className="drawer-footer">
                    <Button type="primary" onClick={handleSubmit}>
                        保存
                    </Button>
                    <Button type="default" onClick={onClose}>
                        取消
                    </Button>
                </div>
            }
        >
            <Form  form={nodeForm} labelCol={{ flex: '100px' }}>
              {mode==="EDIT"&&(
                 <Form.Item label="主机IP" name="serverIp" 
                 rules={[{ required: true, message: '请输入唯一的主机IP' }]}

                 >
                 <Input style={{ width: 320 }} disabled={true} placeholder="请输入"></Input>
                 </Form.Item>
                
              )}
              {mode==="ADD"&&(
                 <Form.Item label="主机IP" name="serverIp" 
                 rules={[{ required: true, message: '请输入唯一的主机IP' }]}
                 hasFeedback
                 validateTrigger="onBlur"
                 validateStatus={
                  serverRightInfo && !loading && serverType === 'success'
                     ? 'success'
                     : !serverRightInfo && !loading && serverType === 'begin'
                     ? 'validating'
                     : serverType === 'error'
                     ? 'error'
                     : 'warning'
                 }
                 help={serverType === 'success' ? '主机IP唯一性检查通过' : serverType === 'error' ? serverErrorMessage : '等待检查主机IP是否唯一'}
                 >
                 <Input style={{ width: 320 }} placeholder="请输入" onBlur={onServerIpChange}></Input>
                 </Form.Item>

              )}
              {mode==="ADD"&&(
                 <Form.Item label="主机名" name="hostname" 
                 rules={[{ required: true, message: '请输入唯一的主机名' }]}
                 hasFeedback
                 validateTrigger="onBlur"
                 validateStatus={
                   rightInfo && !loading && type === 'success'
                     ? 'success'
                     : !rightInfo && !loading && type === 'begin'
                     ? 'validating'
                     : type === 'error'
                     ? 'error'
                     : 'warning'
                 }
                 help={type === 'success' ? '主机名唯一性检查通过' : type === 'error' ? errorMessage : '等待检查主机名是否唯一'}
                 >
                 <Input style={{ width: 320 }}  placeholder="请输入" onBlur={onHostnameChange}></Input>
                 </Form.Item>

              )}
              {mode==="EDIT"&&(
                  <Form.Item label="主机名" name="hostname" 
                  rules={[{ required: true, message: '请输入唯一的主机名' }]}
                
                 
                  >
                  <Input style={{ width: 320 }}  placeholder="请输入" disabled={true} ></Input>
                  </Form.Item>
              )}
               
               
                <Form.Item  label="CPU" style={{display:"flex"}}>
                    <div style={{display:'flex',height:30}}>
                    <Form.Item
                   
                   name="cpu"
                  //  hasFeedback
                   rules={[
                       {
                           required: true,
                           message: '请输入',
                          
                       },
                   ]}

               >
                   <InputNumber style={{ width: 160 }} min={1}  placeholder="请输入"></InputNumber>
                  
               </Form.Item>
               <Form.Item style={{marginLeft:8}}> C</Form.Item>


                    </div>
             
                </Form.Item>

           <Form.Item  label="内存" >
               <div style={{display:'flex',height:30}}>
               <Form.Item
                name="memory"
                // hasFeedback
                rules={[
                    {
                     required: true,
                     message: '请输入',
     
                    },
               ]}

>
<InputNumber style={{ width: 160 }}  min={1}   placeholder="请输入"></InputNumber>

</Form.Item>
<Form.Item style={{marginLeft:8}} > G</Form.Item>

               </div>
            

           </Form.Item>
           
            <Form.Item name="isRootDisk" label="共用系统盘">
            <Switch  checked={isRootDiskChecked} onChange={onRootDiskChange}/>
            </Form.Item>
            <Form.Item name="dataDisk" label="数据盘">
                <Input style={{ width: 320 }} disabled={nodeForm.getFieldValue("isRootDisk")===true}/>

            </Form.Item>
            <Form.Item name="nodeRole" label="主机角色">
                <Select style={{ width: 320 }} loading={roleLoading} options={roleOptions}/>
            </Form.Item>
            <Form.Item name="nodePurpose" label="主机用途">
                <Select style={{ width: 320 }} loading={infoLoading} mode="multiple" options={purposeOptions}/>
            </Form.Item>
            <Form.Item name="enableNfs" label="启用nfs server">
            <Switch checked={enableNfsChecked} onChange={onEnableNfsChange} />
            </Form.Item>
            {nodeForm.getFieldValue("enableNfs")===true &&(
                <Form.Item name="nfsWhite" label="白名单">
                <Input style={{ width: 320 }}/>
                </Form.Item>

            )}
            
            </Form>

        </Drawer>
    );
}
