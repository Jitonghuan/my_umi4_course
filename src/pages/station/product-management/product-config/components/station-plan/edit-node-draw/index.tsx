// @author JITONGHUAN <muxi.jth@come-future.com>
// @create 2022/05/10 10:30

import React from 'react';
import { useState, useEffect } from 'react';
import { Drawer, Button, Form, Spin, Select, Space, Divider, Input, Switch,message } from 'antd';
import {  saveServerInfo } from '../hook';
import { getRequest } from '@/utils/request';
import { checkServerIpApi, checkServerNameApi } from '../../../../../service';


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
    const [rightInfo, setRightInfo] = useState<boolean>(false);
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    useEffect(()=>{
        if (mode === 'HIDE') return;
        if(mode==="EDIT"){
            nodeForm.setFieldsValue({
                ...curRecord,
                enableNfs:curRecord?.enableNfs===1?true:false,
                isRootDisk:curRecord?.isRootDisk===1?true:false
            })

        }
    },[mode])
    const handleSubmit = async() => {
      const values=  await nodeForm.validateFields();
      saveServerInfo({...values,enableNfs:values?.enableNfs?1:0,isRootDisk:values?.isRootDisk?1:0}).then((res)=>{
          if(res?.code===1000){
              message.success(res?.data)
              onSave()

          }
      })

    };
    const onServerIpChange = (value: any) => {
        let formData = nodeForm.getFieldsValue();
        getCheck("serverIp",formData.serverIp, );
      };
      const onHostnameChange = (value: any) => {
        let formData = nodeForm.getFieldsValue();
        getCheck("hostname",formData.hostname, );
      };
    const getCheck = async (
        key:string,
        value: string, 
      ) => {
        setLoading(true);
        setType('begin');
        try {
          await getRequest(
            `${checkServerIpApi}?indentId=${indentId}&${key}=${value}`,
          )
            .then((res) => {
              if (res.success && res.data === 'success') {
                setRightInfo(true);
    
                setType('success');
              } else if (res.success && res.data !== 'success') {
                setRightInfo(false);
                setErrorMessage(res.data);
                setType('error');
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
                <Form.Item label="主机IP" name="serverIp" 
                rules={[{ required: true, message: '请输入唯一的主机IP' }]}
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
                help={type === 'success' ? '主机IP唯一性检查通过' : type === 'error' ? errorMessage : '等待检查主机IP唯一性'}
                >
                <Input style={{ width: 320 }} placeholder="请输入" onBlur={onServerIpChange}></Input>
                </Form.Item>
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
                help={type === 'success' ? '主机名唯一性检查通过' : type === 'error' ? errorMessage : '等待主机名是否唯一'}
                >
                <Input style={{ width: 320 }} placeholder="请输入" onBlur={onHostnameChange}></Input>
                </Form.Item>
                <Form.Item
                    label="CPU"
                    name="cpu"
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: '请输入',
                           
                        },
                    ]}

                >
                    <Input style={{ width: 160 }} placeholder="请输入"></Input>
                    <span className="ant-form-text"  style={{marginLeft:8}}> C</span>
                </Form.Item>
           
            <Form.Item
                label="内存"
                name="memory"
                hasFeedback
                rules={[
                    {
                        required: true,
                        message: '请输入',
                     
                    },
                ]}

            >
                <Input style={{ width: 160 }} placeholder="请输入"></Input>
                <span className="ant-form-text" style={{marginLeft:8}}> G</span>
            </Form.Item>
            <Form.Item name="isRootDisk" label="共用系统盘">
            <Switch />
            </Form.Item>
            <Form.Item name="dataDisk" label="数据盘">
                <Input style={{ width: 320 }} disabled={nodeForm.getFieldValue("isRootDisk")===true}/>

            </Form.Item>
            <Form.Item name="nodeRole" label="主机角色">
                <Select style={{ width: 320 }}/>
            </Form.Item>
            <Form.Item name="nodePurpose" label="主机用途">
                <Select style={{ width: 320 }}/>
            </Form.Item>
            <Form.Item name="enableNfs" label="启用nfs server">
            <Switch />
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
