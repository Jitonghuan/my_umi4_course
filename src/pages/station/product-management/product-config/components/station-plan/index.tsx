import React, { useState, useMemo, useRef } from 'react';
import { Divider, Button, Table, Steps, message, Row, Col, Switch, Form, Input, Select,Space } from 'antd';
import { useUpdateParamIndent, } from '../../../hook';
import type { FormInstance } from 'antd/lib';

import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { nodesSchema } from './schema';
import './index.less'


const { Option } = Select;

const areas = [
    { label: 'Beijing', value: 'Beijing' },
    { label: 'Shanghai', value: 'Shanghai' },
];

const sights = {
    Beijing: ['Tiananmen', 'Great Wall'],
    Shanghai: ['Oriental Pearl', 'The Bund'],
};

type SightsKeys = keyof typeof sights;

export default function StationPlan() {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const formRef = useRef<FormInstance>();

    const { Step } = Steps;

    const [form] = Form.useForm();
    const [current, setCurrent] = useState(0);

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const waitTime = (time: number = 100) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, time);
        });
    };
    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    //组件参数表格列配置
    const nodesTableColumns = useMemo(() => {
        return nodesSchema({
            onEditClick: (record, index) => {

            },
        }) as any;
    }, []);
    const steps = [
        {
            title: '基础配置',
            content: (
                <div style={{padding:10}}>
                    <Form layout="horizontal"  labelCol={{ flex: '150px' }}>
                        <Row gutter={12} >
                            <Col >
                                <Form.Item   name="code" label="项目Code" >
                                    <Input style={{width:260}}/>
                                </Form.Item>
                            </Col >
                            <Col >
                            <Form.Item   name="code" label="ssh用户" >
                                    <Input style={{width:260}}/>
                                </Form.Item>
                           </Col>
                        </Row> 
                        <Row>
                            <Col >
                                <Form.Item   name="code" label="项目domian" >
                                    <Input style={{width:260}}/>
                                </Form.Item>
                            </Col >
                            {/* <Col  > */}
                            <Form.Item   name="code" label="ssh密码" >
                                    <Input style={{width:260}}/>
                                </Form.Item>

                            {/* </Col>  */}
                        </Row>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item   name="code" label="k8s版本" >
                                    <Input style={{width:260}}/>
                                </Form.Item>
                           </Col > 
                            <Col > 
                            <Form.Item   name="code" label="部署双集群" >
                                    <Switch />
                                </Form.Item>

                            </Col>
                        </Row>
                        <Row>
                        <Form.Item   name="code" label="VIP" >
                                <Input style={{width:260}}/>
                        </Form.Item>

                        </Row>
                        <Row>
                        <Form.Item   name="code" label="DNS" >
                                <Input style={{width:260}}/>
                        </Form.Item>

                        </Row>
                        <Row>
                        <Form.Item   name="code" label="NTP" >
                             <Input style={{width:260}}/>
                        </Form.Item>
                       

                        </Row>
                       
                        
                        


                    </Form>
                </div>
            )
        },
        {
            title: '节点列表',
            content: (
                <div style={{padding:10}}>
                    <div style={{ marginBottom: 16, display: "flex", justifyContent: 'space-between' }}>
                        <div >
                            <Button type="primary" onClick={() => { }} disabled={!hasSelected} >
                                删除选中
                             </Button>

                            <span style={{ marginLeft: 8 }}>
                                {hasSelected ? `选中 ${selectedRowKeys.length} 条数据` : ''}
                            </span>

                        </div>
                        <div>
                            <Button type="primary">新增节点</Button>
                        </div>

                    </div>
                    <Table style={{ paddingBottom: 10 }} rowSelection={rowSelection} columns={nodesTableColumns} dataSource={[]} />
                </div>


            ),
        },
        {
            title: '数据设施',
            content: (<div style={{ display: 'flex', justifyContent: "space-around", width: '100%' }}>
                <div>
                    <p><b>数据库信息</b></p>
                    <p className="third-step-content">
                        <Form form={form} layout="horizontal" labelCol={{ flex: '120px' }} name="dynamic_form_nest_item" onFinish={() => { }} >
                            <Form.Item name="area" label="数据库类型" rules={[{ required: true, message: 'Missing area' }]}>
                                <Select options={areas} style={{ width: 220 }} onChange={() => { }} />
                            </Form.Item>
                            <Form.Item name="area" label="地址" rules={[{ required: true, message: 'Missing area' }]}>
                                <Input style={{ width: 220 }} onChange={() => { }} />
                            </Form.Item>
                            <Form.Item name="area" label="端口" rules={[{ required: true, message: 'Missing area' }]}>
                                <Input style={{ width: 220 }} onChange={() => { }} />
                            </Form.Item>
                            <Form.Item name="area" label="用户名" rules={[{ required: true, message: 'Missing area' }]}>
                                <Input style={{ width: 220 }} onChange={() => { }} />
                            </Form.Item>
                            <Form.Item name="area" label="密码" rules={[{ required: true, message: 'Missing area' }]}>
                                <Input style={{ width: 220 }} onChange={() => { }} />
                            </Form.Item>
                            <Form.Item name="area" label="类别" rules={[{ required: true, message: 'Missing area' }]}>
                                <Select options={areas} style={{ width: 220 }} onChange={() => { }} />
                            </Form.Item>
                            < Divider/>
                            <Form.List name="sights" >
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(field => (
                                            // <Space key={field.key} align="start">
                                            <>
                                                <Form.Item
                                                    {...field}
                                                    label="数据库类型"
                                                    name={[field.name, 'price']}
                                                    rules={[{ required: true, message: 'Missing price' }]}
                                                >
                                                    <Select options={areas} style={{ width: 242 }} onChange={() => { }} />
                                                </Form.Item>
                                                <Form.Item
                                                    {...field}
                                                    label="地址"
                                                    name={[field.name, 'price']}
                                                    rules={[{ required: true, message: 'Missing price' }]}
                                                >
                                                    <Input />
                                                </Form.Item>
                                                <Form.Item
                                                    {...field}
                                                    label="端口"
                                                    name={[field.name, 'price']}
                                                    rules={[{ required: true, message: 'Missing price' }]}
                                                >
                                                    <Input />
                                                </Form.Item>
                                                <Form.Item
                                                    {...field}
                                                    label="用户名"
                                                    name={[field.name, 'price']}
                                                    rules={[{ required: true, message: 'Missing price' }]}
                                                >
                                                    <Input />
                                                </Form.Item>
                                                <Form.Item
                                                    {...field}
                                                    label="密码"
                                                    name={[field.name, 'price']}
                                                    rules={[{ required: true, message: 'Missing price' }]}
                                                >
                                                    <Input />
                                                </Form.Item>

                                              <div style={{display:"flex"}}>
                                              <Form.Item
                                                    {...field}
                                                    label="类别"
                                                    name={[field.name, 'price']}
                                                    rules={[{ required: true, message: 'Missing price' }]}
                                                >
                                                    <Select options={areas} style={{ width: 220 }} onChange={() => { }} />
                                                </Form.Item>
                                                <Form.Item style={{marginLeft:80}}><MinusCircleOutlined onClick={() => remove(field.name)} /></Form.Item>
                                              </div>
                                             < Divider/>
                                            </>
                                        //    </Space>
                                        ))}

                                        <Form.Item>
                                            <Button type="primary" onClick={() => add()} block icon={<PlusOutlined />}>
                                                新增
                                                      </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>

                        </Form>

                    </p>
                </div>
                <div>
                    <p><b>minio信息</b></p>
                    <Form form={form} layout="horizontal" labelCol={{ flex: '120px' }} name="dynamic_form_nest_item" onFinish={() => { }} >
                        <Form.Item name="area" label="地址" rules={[{ required: true, message: 'Missing area' }]}>
                            <Input style={{ width: 220 }} onChange={() => { }} />
                        </Form.Item>
                        <Form.Item name="area" label="accessKey" rules={[{ required: true, message: 'Missing area' }]}>
                            <Input style={{ width: 220 }} onChange={() => { }} />
                        </Form.Item>
                        <Form.Item name="area" label="secretKey" rules={[{ required: true, message: 'Missing area' }]}>
                            <Input style={{ width: 220 }} onChange={() => { }} />
                        </Form.Item>
                    </Form>

                </div>
            </div>),
        },
    ];

    return (
        <div className="station-plan-content">
            <Steps current={current}>
                {steps.map(item => (
                    <Step key={item.title} title={item.title} />
                ))}
            </Steps>
            <div className="steps-content">{steps[current].content}</div>
            <div className="steps-action">
                {current < steps.length - 1 && (
                    <Button type="primary" onClick={() => next()}>
                        下一步
                    </Button>
                )}
                {current === steps.length - 1 && (
                    <Button type="primary" onClick={() => message.success('Processing complete!')}>
                        提交
                    </Button>
                )}
                {current > 0 && (
                    <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                        上一步
                    </Button>
                )}
            </div>
        </div>
        
    )
}