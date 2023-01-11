// group editor
// @author JITONGHUAN <muxi@come-future.com>
// @create 2023/01/10 10:50

import React, { useState, useEffect, useRef } from 'react';
import { Drawer, Form, Button, Select, Input, message } from 'antd';
import UserSelector from "@/components/user-selector";
import {addAlertGroup,updateAlertGroup,checkName} from '../hook'

export interface CreateIProps {
    mode?: EditorMode;
    initData?: any;
    onClose: () => any;
    onSave: () => any;
}

export default function CreateArticle(props: CreateIProps) {

    const { mode, initData, onClose, onSave } = props;
    const [editForm] = Form.useForm<Record<string, string>>();
    const [viewDisabled, seViewDisabled] = useState<boolean>(false);
    const [loading,setLoading] = useState<boolean>(false);
    const []=useState<boolean>(false)
    

    useEffect(() => {
        if (mode === 'HIDE') return;
     
        if (mode !== 'ADD') {
            let currentGroupUser: any = [];
            if (!initData?.groupUser) {
                currentGroupUser = [];
            } else {
                currentGroupUser = initData?.groupUser?.split(',');
            }
            console.log("currentGroupUser",currentGroupUser)
            editForm.setFieldsValue({
              ...initData,
              groupUser:currentGroupUser

            });
           
        }

        if (mode === 'VIEW') {
            seViewDisabled(true);
        }
       

        return () => {
            seViewDisabled(false);
            editForm.resetFields();
           
        };
    }, [mode]);
    const handleSubmit = async() => {
        const params:any = await editForm.validateFields();
        setLoading(true)

        if (mode === 'EDIT') {
            updateAlertGroup({...params,id:initData?.id,
                groupUser: (params?.groupUser || []).join(',')}).then((res)=>{
                if(res?.success){
                    message.success("新建报警分组成功!")
                    onSave()

                }

            }).finally(()=>{
                setLoading(false)  
            })

        }
        if (mode === 'ADD') {
            addAlertGroup({...params, groupUser: (params?.groupUser || []).join(','),}).then((res)=>{
                if(res?.success){
                    message.success("编辑报警分组成功!")
                    onSave()

                }

            }).finally(()=>{
                setLoading(false)  
            })

        }
    };


    

    return (
        <Drawer
            width={900}
            title={mode === 'EDIT' ? '编辑分组' : mode === 'VIEW' ? '查看分组' : '新增分组'}
            placement="right"
            visible={mode !== 'HIDE'}
            onClose={onClose}
            maskClosable={false}
            footer={
                <div className="drawer-footer">
                    <Button type="primary" loading={loading} onClick={handleSubmit} disabled={viewDisabled}>
                        保存
                    </Button>
                    <Button type="default" onClick={onClose}>
                        取消
                    </Button>
                </div>
            }
        >
            <Form form={editForm} labelCol={{ flex: '100px' }}>
                <Form.Item label="分组名称" name="groupName" rules={[{ required: true, message: '请输入' }]}>
                    <Input disabled={viewDisabled} style={{ width: 320 }} />
                </Form.Item>
                <Form.Item label="分组用户" name="groupUser" >
                    <UserSelector style={{ width: '400px' }} disabled={viewDisabled} />
                </Form.Item>
                <Form.Item label="DingToken" name="dingToken" rules={[{ required: true, message: '请输入' }]}>
                    <Input disabled={viewDisabled} style={{ width: 520 }} />
                </Form.Item>
                <Form.Item label="备注" name="remark" >
                    <Input.TextArea disabled={viewDisabled} style={{ width: 520 }} />
                </Form.Item>

            </Form>
        </Drawer>
    );
}
