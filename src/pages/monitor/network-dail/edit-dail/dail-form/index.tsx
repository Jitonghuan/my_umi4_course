import React, { useState, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
import { Collapse, Drawer, Form, Select, Input, Radio, InputNumber,Segmented } from 'antd';
import type { RadioChangeEvent } from 'antd';
import { frequencyOptions, questConfigOptions, tcpQuestConfig, dnsTypeOptions, visitAgreementOption, probeUrlOptions } from './type'

import EditorTable from '@cffe/pc-editor-table';
import { useGetNetworkProbeType, useGetCluster, } from '../../edit-dail/hook'
interface Iprops {
    mode: EditorMode;
    curRecord: any

}

export default forwardRef(function DailForm(props: Iprops, ref: any) {
    const { mode, curRecord } = props

    const [form] = Form.useForm()
    const createFormRef = useRef<any>(null)
    const [dailTypesLoading, dailTypeOptions, getNetworkProbeProbeType] = useGetNetworkProbeType()
    const [clusterLoading, clusterData, getCluster] = useGetCluster()
    const [questConfigType, setQuestConfigType] = useState<string>(questConfigOptions[0]?.value)
    const [dailType, setDailType] = useState<string>("Http");
    const [headersData,setHeadersData]=useState<any>([])
    const [username,setUsername]=useState<string>("");
    const [password,setPassword]=useState<string>("");
    useEffect(() => {
        getNetworkProbeProbeType()
        getCluster()
    }, [])

    useEffect(() => {
        if (mode === "HIDE") return
        if (dailTypeOptions?.length > 0 && mode === "ADD") {
            form.setFieldsValue({
                probeType: dailTypeOptions[0]?.value
            })
            setDailType(dailTypeOptions[0]?.value)
        }



    }, [dailTypeOptions, mode])
    useEffect(() => {
        if (mode === "EDIT" && Object.keys(curRecord)?.length > 0) {
            const probeConfig=JSON.parse(curRecord?.probeConfig||"{}")
            const keyData=Object.keys(probeConfig)?.length>0?Object.keys(probeConfig):[]
            let headersList:any=[]
            let basicAuth:any=[]
            let queryResponseList:any=[]
            setDailType(curRecord?.probeType)
            let dnsConfig={}
            if(curRecord?.probeType==="Dns"){

                dnsConfig= probeConfig
            }
            if(curRecord?.probeType==="Http"){
                setQuestConfigType("headers")
            }
            if(curRecord?.probeType==="Tcp"){
                setQuestConfigType("queryResponse")
            }
            if(curRecord?.probeType==="Http"&&keyData?.includes("headers")){
            headersList = Object.keys(probeConfig?.headers  || {}).map((key) => ({
                    httpKey: key,
                    httpValue: probeConfig?.headers?.[key],
                  }));
                // labelList= (probeConfig?.headers || [])?.map((item:any) => ({
                //     httpKey:item?.httpKey,
                //     httpValue: item?.httpValue,
                // }));

            }
            if(curRecord?.probeType==="Http"&&keyData?.includes("basicAuth")){
                basicAuth = Object.keys(probeConfig?.basicAuth  || {}).map((key) => ({
                    username: key,
                    password: probeConfig?.basicAuth?.[key],
                  }));
            }
            if(curRecord?.probeType==="Tcp"&&keyData?.includes("queryResponse")){
                queryResponseList = Object.keys(probeConfig?.queryResponse  || {}).map((key) => ({
                    expect: key,
                    send: probeConfig?.queryResponse?.[key],
                  }));
                

            }
          
            form.setFieldsValue({
                ...curRecord,
                // probeConfig:key,
                headers:headersList,
                probeTimeout: curRecord?.probeTimeout.substr(0, curRecord?.probeTimeout.length - 1),
                username:basicAuth?.length>0?basicAuth[0]:"",
                password:basicAuth?.length>1?basicAuth[1]:"",
                queryResponse:queryResponseList,
                ...dnsConfig
                
            })



        }
        return()=>{
            
            
        }

    }, [mode])


    const onChangeType = ({ target: { value } }: RadioChangeEvent) => {
        setDailType(value)
        if (value === "Http") {
            form.setFieldsValue({
                probeConfig: questConfigOptions[0]?.value
            })
            setQuestConfigType(questConfigOptions[0]?.value)

        }
        if (value === "tcp") {
            form.setFieldsValue({
                probeConfig: tcpQuestConfig[0]?.value
            })


        }

    };
    useImperativeHandle(ref, () => ({
        createFormRef: createFormRef,
        
        getData:()=>{
            
            return{
                headersData:form.getFieldValue("headers"),
                username:form.getFieldValue("username"),
                password:form.getFieldValue("password")

            }
        }
       


    }))
    return (
        <div>
            <Form labelCol={{ flex: '110px' }} ref={createFormRef} form={form} preserve={false}>
                <Form.Item label="集群选择" name="clusterName" rules={[{ required: true, message: '请填写' }]}>
                    <Select style={{ width: 320 }} options={clusterData} loading={clusterLoading} />
                </Form.Item>
                <Form.Item label="拨测类型" name="probeType" rules={[{ required: true, message: '请填写' }]}  >
                    <Radio.Group options={dailTypeOptions} onChange={onChangeType} value={dailType} optionType="button" />
                </Form.Item>
                <Form.Item label="拨测名称" name="probeName" rules={[{ required: true, message: '请填写' }]}>
                    <Input style={{ width: 320 }} />
                </Form.Item>

                <Form.Item label="拨测地址" name="probeUrl" rules={[{ required: true, message: '请填写' }]}>
                    <Input style={{ width: 320 }} />
                </Form.Item>

                <Form.Item label="拨测频率" name="probeInterval" rules={[{ required: true, message: '请填写' }]}>
                    <Radio.Group options={frequencyOptions} />
                </Form.Item>
                <Form.Item label="拨测超时(s)" name="probeTimeout" rules={[{ required: true, message: '请填写' }]}>
                    <InputNumber style={{ width: 320 }} min={1} />
                </Form.Item>
                {dailType === "Http" && (
                    <>
                        <Form.Item label="请求配置" name="probeConfig" initialValue={questConfigOptions[0]?.value} rules={[{ required: true, message: '请填写' }]}>
                            <Segmented options={questConfigOptions} defaultValue={questConfigOptions[0]?.value} value={questConfigType} onChange={(value:any) => { setQuestConfigType(value)
                            if(form.getFieldValue("headers")?.length>0){
                                setHeadersData(form.getFieldValue("headers"))
                            }
                            if(form.getFieldValue("username")){
                                setUsername(form.getFieldValue("username"))
                            }
                            if(form.getFieldValue("password")){
                                setPassword(form.getFieldValue("password"))
                            }
                            if(value=== "headers"){
                                form.setFieldsValue({
                                    headers:headersData
                                })

                            }
                            if(value=== "basicAuth"){
                                form.setFieldsValue({
                                    username,
                                    password
                                })

                            }

                             }}  />
                        </Form.Item>

                        {questConfigType === "headers" && <Form.Item
                            name="headers"
                            style={{ marginLeft: 110 }}
                            rules={[
                                {
                                    validator: async (_, value: any) => {
                                        if (!value?.length) {
                                            throw new Error('关联信息至少填写一组');
                                        }
                                        if (value.find((n: any) => !(n.httpKey && n.httpValue))) {
                                            throw new Error('Key 和 Value不能为空!');
                                        }
                                        // 去重校验
                                        const httpKey = value.map((n: any) => n.httpKey);
                                        if (httpKey.length > [...new Set(httpKey)].length) {
                                            throw new Error('请勿重复Key!');
                                        }
                                    },
                                    validateTrigger: [],
                                },
                            ]}>
                            <EditorTable
                                columns={[
                                    {
                                        dataIndex: 'httpKey',
                                        title: 'Key',
                                        fieldType: 'input',

                                        colProps: { width: 200 },
                                    },
                                    { dataIndex: 'httpValue', title: 'Value', fieldType: 'input', colProps: { width: 200 }, },
                                ]}
                            //limit={10}
                            />
                        </Form.Item>}

                        {questConfigType === "basicAuth" &&
                            <>
                                <Form.Item label="账号" name="username" rules={[{ required: true, message: '请填写' }]}>
                                    <Input style={{ width: 320 }} />
                                </Form.Item>
                                <Form.Item label="密码" name="password" rules={[{ required: true, message: '请填写' }]}>
                                    <Input.Password style={{ width: 320 }} />
                                </Form.Item>
                            </>
                        }
                    </>
                )}
                {dailType === "Dns" && (
                    <Form.Item label="类型" name="dnsType" rules={[{ required: true, message: '请填写' }]}>
                        <Radio.Group options={dnsTypeOptions} />
                    </Form.Item>
                )}
                {dailType === "Dns" && (
                    <Form.Item label="DNS 访问协议" name="dnsProtocol" rules={[{ required: true, message: '请填写' }]}>
                        <Radio.Group options={visitAgreementOption} />
                    </Form.Item>
                )}
                {dailType === "Dns" && (
                    <Form.Item label="DNS 服务器" name="dnsServer" rules={[{ required: true, message: '请填写' }]}>
                        <Input style={{ width: 320 }} />
                    </Form.Item>
                )}
                {dailType === "Tcp" && (
                    <>
                        <Form.Item rules={[{ required: true, message: '请填写' }]} name="probeConfig" label="请求配置" initialValue={tcpQuestConfig[0]?.value}> <Radio.Group options={tcpQuestConfig} optionType="button" defaultValue={tcpQuestConfig[0]?.value} /></Form.Item>
                        <Form.Item name="queryResponse" style={{ marginLeft: 110 }} rules={[
                            {
                                validator: async (_, value: any) => {
                                    if (!value?.length) {
                                        throw new Error('关联信息至少填写一组');
                                    }
                                    if (value.find((n: any) => !(n.expect && n.send))) {
                                        throw new Error('Key 和 Value不能为空!');
                                    }
                                    // 去重校验
                                    const expect = value.map((n: any) => n.expect);
                                    if (expect.length > [...new Set(expect)].length) {
                                        throw new Error('请勿重复Key!');
                                    }
                                },
                                validateTrigger: [],
                            },
                        ]}>
                            <EditorTable
                                columns={[
                                    {
                                        dataIndex: 'expect',
                                        title: 'Key',
                                        fieldType: 'input',

                                        colProps: { width: 200 },
                                    },
                                    { dataIndex: 'send', title: 'Value', fieldType: 'input', colProps: { width: 200 }, },
                                ]}
                                limit={10}
                            />
                        </Form.Item>

                    </>

                )}




            </Form>
        </div>
    )
})