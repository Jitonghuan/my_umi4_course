import React, { useState,useEffect } from 'react';
import {  Modal, message,  Form, Select,Input,} from 'antd';
import { getRequest } from '@/utils/request';
import { getPipelineUrl } from '@/pages/application/service';
import { appReleasePublish } from '@/pages/application/service';

interface Iprops{
    visible:boolean;
    onClose:()=>void;
    curPipelineCode:string
    onSave:()=>void
    appCode?:string;


}

export default function VersionPublish(props:Iprops){
    const {visible,onClose,curPipelineCode,onSave,appCode}=props
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [form]=Form.useForm()
    const [pipelineOptions, setPipelineOptions] = useState<any>([]);
    useEffect(()=>{
        if(visible&&appCode){
            getPipelineOptions()

        }

    },[visible])

    const getPipelineOptions=()=>{
        getRequest(getPipelineUrl, {
            data: { appCode, envTypeCode: "version", pageIndex: -1, size: -1 },
          }).then((res) => {
            if (res?.success) {
              let data = res?.data?.dataSource;
              const pipelineOptionData = data.map((item: any) => ({ value: item.pipelineCode, label: item.pipelineName }));
              setPipelineOptions(pipelineOptionData);
            } else {
              setPipelineOptions([]);
            }
          });
    }
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
        maskClosable={false}
        destroyOnClose
        >
            <Form form={form} labelCol={{flex:"110px"}} preserve={false}>
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