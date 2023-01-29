
import React, { useContext, useRef } from 'react';
import { Button, Row, Col, Form, Select, Space, message, Spin, Modal, Radio, Popconfirm } from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import { getRequest, putRequest } from '@/utils/request';
import { useState, useEffect } from 'react';
import {  useLocation } from 'umi';
import { parse } from 'query-string';
import AceEditor from '@/components/ace-editor';
import DetailContext from '@/pages/application/application-detail/context';
import EditorTable from '@cffe/pc-editor-table';
import * as APIS from '@/pages/application/service';
import {getCicdTemplateList} from './service'


const PipeLineTmpl=()=>{
    const { appData } = useContext(DetailContext);
    //getCicdTemplateList
    const [tmplList,setTmplList]=useState<any>({})
    const [flowType,setFlowType]=useState<any>([])
    const getCicdTemplList=()=>{
        setTmplList({})
        getRequest(getCicdTemplateList,{data:{appCode:appData?.appCode}}).then((result)=>{
            if(result?.success){
                setFlowType(result?.data)

            }

        })
    }
    useEffect(()=>{
        if(!appData?.appCode) return
        getCicdTemplList()
    },[])
    return(
        <ContentCard>
            <Form layout="horizontal">
                <Form.Item label="发布类型">
                    <Select  style={{width:260}} options={[]}/>
                </Form.Item>
                <Form.Item label="模版详情">
                    <AceEditor height={window.innerHeight - 290}  mode="yaml" />
                </Form.Item>
                <div style={{display:"flex",justifyContent:"flex-end"}}>
                    <Button type="primary">提交</Button>
                </div>
            </Form>
        </ContentCard>

        )
}
export default PipeLineTmpl;
    
