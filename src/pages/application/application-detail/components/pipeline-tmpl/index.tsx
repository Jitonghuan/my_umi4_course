
import React, { useContext, useRef } from 'react';
import { Button, Row, Col, Form, Select, Space, message, Spin, Modal, Radio, Popconfirm } from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import { getRequest, postRequest } from '@/utils/request';
import { useState, useEffect } from 'react';
import { useLocation } from 'umi';
import { parse } from 'query-string';
import AceEditor from '@/components/ace-editor';
import DetailContext from '@/pages/application/application-detail/context';
import EditorTable from '@cffe/pc-editor-table';
import * as APIS from '@/pages/application/service';
import { getCicdTemplateList,updateCicdTemplate } from './service'


const PipeLineTmpl = () => {
    const { appData } = useContext(DetailContext);
    let location:any = useLocation();
    const query :any= parse(location.search);
    const [loading,setLoading]=useState<boolean>(false)
    //getCicdTemplateList
    const [form]=Form.useForm()
    const [tmplList, setTmplList] = useState<any>({})
  
    const getCicdTemplList = (flowType:string) => {
        setTmplList({})
        getRequest(getCicdTemplateList, { data: { appCode: appData?.appCode||query?.appCode,flowType } }).then((result) => {
            if (result?.success) {
                if(result?.data?.length>0){
                    setTmplList(result?.data[0]||{})
                }
                
                form.setFieldsValue({
                    templateValue:result?.data[0]?.templateValue,
                    flowType
                })

            }

        })
    }
    useEffect(() => {
        if (!appData?.appCode||!query?.appCode) return
        getCicdTemplList("app")
    }, [])
    const updateCicdTmpl=()=>{
        setLoading(true)
        postRequest(updateCicdTemplate,{data:{
            id:tmplList?.id,
            templateValue:form.getFieldValue("templateValue")

        }}).then((res)=>{if(res?.success){
            message.success("提交成功！")
            getCicdTemplList(form.getFieldValue("flowType"))

        }}).finally(()=>{
            setLoading(false)
        })
    }
    return (
        <ContentCard>
            <Form layout="horizontal" form={form}>
                <Form.Item label="发布类型" name="flowType" initialValue={"app"}>
                    <Select style={{ width: 260 }} defaultValue={"app"} onChange={(type)=>{
                          getCicdTemplList(type)

                    }} options={[
                        { label: "App", value: "app" },
                        { label: "Client", value: "client" },
                    ]} />
                </Form.Item>
                <Form.Item label="模版详情" name="templateValue">
                    <AceEditor height={window.innerHeight - 290} mode="yaml" />
                </Form.Item>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button type="primary" onClick={updateCicdTmpl} loading={loading}>提交</Button>
                </div>
            </Form>
        </ContentCard>

    )
}
export default PipeLineTmpl;

