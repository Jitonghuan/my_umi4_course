import React, { useState,useEffect } from 'react';
import {  Modal, message,  Form, Select,Input,} from 'antd';
import { getRequest } from '@/utils/request';
import { getPipelineUrl } from '@/pages/application/service';
import { appReleasePublish } from '@/pages/application/service';
import AceEditor from '@/components/ace-editor';

interface Iprops{
    visible:boolean;
    onClose:()=>void;
    curPipelineCode:string
    onSave:()=>void
    appCode?:string;
    versionData:any;
    handleTabChange:(tab:string)=>void;


}

export default function VersionPublish(props:Iprops){
    const {visible,onClose,curPipelineCode,onSave,appCode,versionData,handleTabChange}=props
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [form]=Form.useForm()
    const [pipelineOptions, setPipelineOptions] = useState<any>([]);
    const [releaseOption,setReleaseOption]=useState<any>([])
    useEffect(()=>{
        if(visible&&appCode){
            getPipelineOptions()

        }
        if(visible){
            let option=versionData?.filter((item:any) => item.canPublish===true)
            let data=[]
            if(option?.length>0){
                data=  option?.map((ele:any)=>({
                    label:ele?.releaseNumber,
                    value:ele?.id
                }))

            }
           
            setReleaseOption(data)
         


        }

    },[visible])
    useEffect(()=>{
        if(visible&&pipelineOptions?.length>0){
            form.setFieldsValue({
                pipelineCode:pipelineOptions[0]?.value
            })

        }
       

    },[pipelineOptions,visible])

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
            reusePipelineCode:curPipelineCode,
            releaseId:params?.releaseId

        }).then((res)=>{
            if(res?.success){
                message.success("提交成功！")
                onSave()
                handleTabChange('version')

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
                <Form.Item name="releaseId" label="发布版本" rules={[{ required: true, message: '请输入' }]} initialValue={releaseOption[0]?.value} >
                    <Select options={releaseOption} style={{width: '240px'}}  defaultValue={releaseOption[0]?.value}/>
                </Form.Item>
                <Form.Item name="pipelineCode" label="选择流水线" rules={[{ required: true, message: '请输入' }]} initialValue={pipelineOptions[0]?.value}>
                <Select
              options={pipelineOptions}
              style={{ width: '300px' }}
              showSearch
              defaultValue={pipelineOptions[0]?.value}
              optionFilterProp="label"
              filterOption={(input, option) => {
                  //@ts-ignore
                return option?.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0;
              }}
            ></Select>
                </Form.Item>
                
                <Form.Item name="config" label="配置" >
                    {/* <Input.TextArea  style={{width:600}}/> */}
                    <AceEditor mode="yaml"  height={300} />

                </Form.Item>
                <Form.Item name="sql" label="Sql" >
                {/* <Input.TextArea  style={{width:600}}/> */}
                <AceEditor mode="sql"  height={300} />
                </Form.Item>
            </Form>


      </Modal>
    )
}