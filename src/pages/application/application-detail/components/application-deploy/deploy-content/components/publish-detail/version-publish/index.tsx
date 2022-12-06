import React, { useState, useContext, useEffect, useMemo } from 'react';
import { Descriptions, Button, Modal, message, Checkbox, Radio, Upload, Form, Select,Input, Typography,Spin } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { appReleasePublish } from '@/pages/application/service';
interface Iprops{
    visible:boolean;
    onClose:()=>void;
    pipelineOptions:any;
    curPipelineCode:string
    onSave:()=>void


}

export default function VersionPublish(props:Iprops){
    const {visible,onClose,pipelineOptions,curPipelineCode,onSave}=props
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [form]=Form.useForm()
    const handleSubmit=async()=>{
        setConfirmLoading(true);
        const params= await form.validateFields()
        appReleasePublish({
            ...params,
            reusePipelineCode:curPipelineCode
        }).then((res)=>{
            if(res?.success){
                message.success("提交成功！")
                onSave()

            }

        }).finally(()=>{
            setConfirmLoading(false);
        })


    }
    return(
        <Modal key="publish-version"
        title="部署到版本发布"
        visible={visible}
        width={800}
        onCancel={onClose}
        onOk={handleSubmit}
        confirmLoading={confirmLoading}
        maskClosable={false}>
            <Form form={form} labelCol={{flex:"110px"}} >
                <Form.Item name="pipelineCode" label="选择流水线" rules={[{ required: true, message: '请输入' }]}>
                <Select
              options={pipelineOptions}
              style={{ width: '240px', marginRight: '20px' }}
              showSearch
              optionFilterProp="label"
              filterOption={(input, option) => {
                  //@ts-ignore
                return option?.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0;
              }}
            ></Select>
                </Form.Item>
                
                <Form.Item name="config" label="配置" rules={[{ required: true, message: '请输入' }]}>
                    <Input.TextArea  style={{width:600}}/>

                </Form.Item>
                <Form.Item name="sql" label="Sql" rules={[{ required: true, message: '请输入' }]}>
                <Input.TextArea  style={{width:600}}/>
                </Form.Item>
            </Form>


      </Modal>
    )
}