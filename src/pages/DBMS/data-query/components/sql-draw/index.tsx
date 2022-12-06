// article editor
// @author JITONGHUAN <muxi@come-future.com>
// @create 2022/06/15 14:50

import React, {  useEffect,} from 'react';
import { Drawer, Form,Spin } from 'antd';
import AceEditor from '@/components/ace-editor';



export interface IProps {
    mode?: EditorMode;
    initData?: any;
    onClose: () => any;
    loading?:boolean
   
  
}

export default function CreateArticle(props: IProps) {
    const { mode, initData, onClose,loading} = props;
    const [form] = Form.useForm();
    useEffect(()=>{
        if(mode==="HIDE") return

        if(initData){
            form.setFieldsValue({
                showSql:initData
            })

        }
        return()=>{
           // form.resetFields()
        }


    },[mode,initData])
   
    return (
        <Drawer
            width={"60%"}
            title={`Create Table Sql`}
            placement="right"
            visible={mode !== 'HIDE'}
            destroyOnClose
            onClose={onClose}
            maskClosable={false}
            footer={false}
        >
            <Spin spinning={loading} >
            <Form form={form} labelCol={{ flex: '140px' }} preserve={false}>
               
               <Form.Item name="showSql">
                <AceEditor mode="sql" height={900} readOnly={true} />
                </Form.Item>
                 
             
           </Form>

            </Spin>
           
        </Drawer>
    );
}
