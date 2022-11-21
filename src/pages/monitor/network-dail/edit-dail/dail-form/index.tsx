import { Collapse, Drawer, Form, Select, Input, Radio } from 'antd';
import type { RadioChangeEvent } from 'antd';
import { dailTypeOptions, frequencyOptions, questConfigOptions, tcpQuestConfig, dnsTypeOptions, visitAgreementOption } from './type'
import React, { useState,useEffect } from 'react';
import EditorTable from '@cffe/pc-editor-table';
import {useGetNetworkProbeType,useGetCluster} from '../../edit-dail/hook'

export default function DailForm() {
    const [dailType, setDailType] = useState('http');
    const [form] = Form.useForm()
    const [dailTypesLoading,dailTypes, getNetworkProbeProbeType]=useGetNetworkProbeType()
    const [clusterLoading,clusterData, getCluster]=useGetCluster()
    useEffect(()=>{
        getNetworkProbeProbeType()
        getCluster()
      },[])

    

    const onChange3 = ({ target: { value } }: RadioChangeEvent) => {
        console.log('radio3 checked', value);
        setDailType(value);
    };
    return (
        <div>
            <Form labelCol={{ flex: '80px' }} form={form}>
                <Form.Item label="集群选择" name="clusterNameb">
                    <Select style={{ width: 320 }} options={clusterData} />
                </Form.Item>
                <Form.Item label="拨测类型" >
                    
                    <Radio.Group options={dailTypeOptions}  onChange={onChange3} value={dailType} optionType="button" />
                </Form.Item>
                <Form.Item label="拨测名称">
                    <Input style={{ width: 320 }} />
                </Form.Item>
                {(dailType === "ping" || dailType === "dns") && (
                    <Form.Item label="拨测地址">
                        <Input />
                    </Form.Item>
                )}
                {dailType === "http" &&
                    <Form.Item label="拨测地址" style={{ marginBottom: 0 }}>
                        <Form.Item
                            name="year"
                            rules={[{ required: true }]}
                            style={{ display: 'inline-block', width: 'calc(14% - 8px)' }}
                        >
                            <Select placeholder="请选择" />
                        </Form.Item>
                        <Form.Item
                            name="month"
                            rules={[{ required: true }]}
                            style={{ display: 'inline-block', width: 'calc(30% - 8px)', margin: '0 8px' }}
                        >
                            <Input placeholder="单行输入" />
                        </Form.Item>
                    </Form.Item>}
                <Form.Item label="拨测频率">
                    <Radio.Group options={frequencyOptions} onChange={onChange3} />
                </Form.Item>
                <Form.Item label="拨测超时(s)">
                    <Input style={{ width: 320 }} />
                </Form.Item>
                {dailType === "dns" && (
                    <Form.Item label="类型">
                        <Radio.Group options={dnsTypeOptions} onChange={onChange3} />
                    </Form.Item>
                )}
                {dailType === "dns" && (
                    <Form.Item label="DNS 访问协议">
                        <Radio.Group options={visitAgreementOption} onChange={onChange3} />
                    </Form.Item>
                )}
                {dailType === "dns" && (
                    <Form.Item label="DNS 服务器">
                        <Input style={{ width: 320 }} />
                    </Form.Item>
                )}
                {dailType === "tcp" && (
                    <>
                        <Form.Item> <Radio.Group options={tcpQuestConfig} /></Form.Item>
                        <Form.Item>
                            <EditorTable
                                columns={[
                                    {
                                        dataIndex: 'key',
                                        title: 'Key',
                                        fieldType: 'input',

                                        colProps: { width: 200 },
                                    },
                                    { dataIndex: 'value', title: 'Value', colProps: { width: 200 }, },
                                ]}
                                limit={10}
                            />
                        </Form.Item>

                    </>

                )}
                {dailType === "http" && (
                    <>
                        <Form.Item label="请求配置">
                            <Radio.Group options={questConfigOptions} />

                        </Form.Item>
                        <Form.Item>
                            <EditorTable
                                columns={[
                                    {
                                        dataIndex: 'key',
                                        title: 'Key',
                                        fieldType: 'input',

                                        colProps: { width: 200 },
                                    },
                                    { dataIndex: 'value', title: 'Value', colProps: { width: 200 }, },
                                ]}
                                limit={10}
                            />
                        </Form.Item>
                        {
                            <>
                                <Form.Item label="账号">
                                    <Input style={{ width: 320 }} />
                                </Form.Item>
                                <Form.Item label="密码">
                                    <Input.Password style={{ width: 320 }} />
                                </Form.Item>
                            </>
                        }
                    </>
                )}



            </Form>
        </div>
    )
}