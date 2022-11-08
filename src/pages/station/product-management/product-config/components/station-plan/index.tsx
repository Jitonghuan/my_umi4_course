import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Divider, Button, Table, Steps, message, Row, Col, Switch, Form, Input, Select, Spin, Popconfirm } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { nodesSchema, DbUsageOptions } from './schema';
import { saveBasicInfo, saveDatabaseInfo, getNodeList, useDeleteServer, useGetDatabaseInfo } from './hook';
import EditNodeDraw from './edit-node-draw';
import { useBelongList } from '../../../../product-list/version-detail/components/editor-table-pro/hook'
import './index.less'

interface Iprops {
    indentId: number;
    onUpdate: () => void;
}

export default function StationPlan(props: Iprops) {
    const { indentId, onUpdate } = props;
    const [databaseData, setDatabaseData] = useState<any>([])
    const [basicInfoData, setBasicInfoData] = useState<any>([])
    const [dataBaseLoading, setDataBaseLoading] = useState<boolean>(false)
    const [loading, options, queryBelongList] = useBelongList()
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const { Step } = Steps;
    const [form] = Form.useForm();
    const [baseInfoForm] = Form.useForm();
    const [delLoading, deleteServer] = useDeleteServer()
    const [current, setCurrent] = useState(0);
    const [disabled, setDisabled] = useState<boolean>(false);
    const [nodeMode, setNodeMode] = useState<EditorMode>("HIDE");
    const [curRecord, setCurRecord] = useState<any>({});
    const [dataSource, setDataSource] = useState<any>([]);
    const [isClusterChecked, setIsClusterChecked] = useState<boolean>(false);
    useEffect(() => {
        if (!indentId) return;
        getNodeListData();
        queryBelongList();

        getListBasicInfo(indentId,)
        getDatabaseInfo(indentId,)
    }, [indentId]);
    const getDatabaseInfo = (indentId: number) => {
        setDataBaseLoading(true)
        useGetDatabaseInfo(indentId, 'database').then((result) => {
            setDatabaseData(result);
            if (result?.length > 0) {
                let databaseDataOne = result[0];
                //深拷贝
                let data: any = JSON.parse(JSON.stringify(result)) || []
                data.shift();//26
                form.setFieldsValue({
                    ...databaseDataOne,
                    more: data

                })

            }
        }).finally(() => {
            setDataBaseLoading(false)
        })
    }
    const getListBasicInfo = (indentId: number) => {
        useGetDatabaseInfo(indentId, 'basic').then((result) => {
            setBasicInfoData(result);
            if (Object.keys(result)?.length > 0) {
                baseInfoForm.setFieldsValue({
                    ...result
                })
                setIsClusterChecked(result?.enableMutiCluster ? true : false)

            }
        })
    }

    const getNodeListData = useCallback(() => {
        getNodeList(indentId, 'server').then((res) => {
            if (res?.success) {
                let dataSource = []
                if (res?.data?.length > 0) {
                    dataSource = res?.data?.map((ele: any, index: number) => ({
                        key: index,
                        ...ele
                    })

                    )

                }
                setDataSource(dataSource || [])
            }


        })

    }, [indentId])
    const onClusterSwitchChange = (checked: boolean) => {
        if (checked === true) {
            setIsClusterChecked(true);

        } else {
            setIsClusterChecked(false);

        }

    }


    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };


    const onSelectChange = (newSelectedRowKeys: React.Key[], selectedRows: any) => {

        setSelectedRowKeys(newSelectedRowKeys);
        setSelectedRows(selectedRows)
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
                setNodeMode("EDIT");
                setCurRecord(record)
            },
        }) as any;
    }, []);
    const steps = [
        {
            title: '基础配置',
            content: (
                <div style={{ padding: 10 }}>
                    <Form layout="horizontal" form={baseInfoForm} labelCol={{ flex: '150px' }}>
                        <Row gutter={12} >
                            <Col >
                                <Form.Item name="projectCode" label="项目Code" >
                                    <Input style={{ width: 260 }} />
                                </Form.Item>
                            </Col >
                            <Col >
                                <Form.Item name="sshUser" label="ssh用户" >
                                    <Input style={{ width: 260 }} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col >
                                <Form.Item name="projectDomain" label="项目domian" >
                                    <Input style={{ width: 260 }} />
                                </Form.Item>
                            </Col >
                            {/* <Col  > */}
                            <Form.Item name="sshPassword" label="ssh密码" >
                                <Input style={{ width: 260 }} />
                            </Form.Item>

                            {/* </Col>  */}
                        </Row>
                        <Row gutter={16}>
                            <Col >
                                <Form.Item name="k8sVersion" label="k8s版本" >
                                    <Input style={{ width: 260 }} />
                                </Form.Item>
                            </Col >
                            <Col style={{ marginLeft: 38 }}>
                                <Form.Item name="enableMutiCluster" label="部署双集群"  >
                                    <Switch checked={isClusterChecked} onChange={onClusterSwitchChange} />
                                </Form.Item>

                            </Col>
                        </Row>
                        <Row>
                            <Form.Item name="vip" label="VIP" >
                                <Input style={{ width: 260 }} />
                            </Form.Item>

                        </Row>
                        <Row>
                            <Form.Item name="dns" label="DNS" >
                                <Input style={{ width: 260 }} />
                            </Form.Item>

                        </Row>
                        <Row>
                            <Form.Item name="ntpServer" label="NTP" >
                                <Input style={{ width: 260 }} />
                            </Form.Item>
                        </Row>
                    </Form>
                </div>
            )
        },
        {
            title: '节点列表',
            content: (
                <div style={{ padding: 10 }}>
                    <div style={{ marginBottom: 16, display: "flex", justifyContent: 'space-between' }}>
                        <div >
                            <Popconfirm
                                title="确定要删除吗？"
                                onConfirm={() => {

                                    let ips: any = []

                                    selectedRows?.map((ele: any) => {
                                        ips.push(ele?.serverIp)

                                    })
                                    deleteServer(indentId, ips).then(() => {
                                        getNodeListData();
                                        setSelectedRowKeys([])
                                        setSelectedRows([])
                                    })
                                }}
                            >
                                <Button type="primary" onClick={() => {

                                }} disabled={!hasSelected} loading={delLoading} >
                                    删除选中
                             </Button>
                            </Popconfirm>
                            <span style={{ marginLeft: 8 }}>
                                {hasSelected ? `选中 ${selectedRowKeys.length} 条数据` : ''}
                            </span>

                        </div>
                        <div>
                            <Button type="primary" onClick={() => { setNodeMode("ADD") }}>新增节点</Button>
                        </div>

                    </div>
                    <Table style={{ paddingBottom: 10 }} pagination={false} scroll={{ y: window.innerHeight - 545 }} rowSelection={rowSelection} columns={nodesTableColumns} dataSource={dataSource} />
                </div>


            ),
        },
        {
            title: '数据设施',
            content: (<div style={{ display: 'flex', width: '100%', justifyContent: "center", height: "100%", overflow: "scroll" }}>
                <div>
                    <Spin spinning={dataBaseLoading}>
                        <p><b>数据库信息</b></p>
                        <p className="third-step-content">
                            <Form form={form} layout="horizontal" labelCol={{ flex: '120px' }} name="dynamic_form_nest_item" onFinish={() => { }} >
                                <Form.Item name="dbType" label="数据库类型" rules={[{ required: true, message: '请填写' }]}>
                                    <Select options={DbUsageOptions} style={{ width: 220 }} onChange={() => { }} />
                                </Form.Item>
                                <Form.Item name="dbAddress" label="地址" rules={[{ required: true, message: '请填写' }]}>
                                    <Input style={{ width: 220 }} onChange={() => { }} />
                                </Form.Item>
                                <Form.Item name="dbPort" label="端口" rules={[{ required: true, message: '请填写' }]}>
                                    <Input style={{ width: 220 }} onChange={() => { }} />
                                </Form.Item>
                                <Form.Item name="dbUser" label="用户名" rules={[{ required: true, message: '请填写' }]}>
                                    <Input style={{ width: 220 }} onChange={() => { }} />
                                </Form.Item>
                                <Form.Item name="dbPassword" label="密码" rules={[{ required: true, message: '请填写' }]}>
                                    <Input style={{ width: 220 }} onChange={() => { }} />
                                </Form.Item>
                                <Form.Item name="dbUsage" label="类别" rules={[{ required: true, message: '请填写' }]}>
                                    <Select options={options} loading={loading} style={{ width: 220 }} />
                                </Form.Item>
                                < Divider />
                                <Form.List name="more" >
                                    {(fields, { add, remove }) => (
                                        <>
                                            {fields.map(field => (
                                                // <Space key={field.key} align="start">
                                                <>
                                                    <Form.Item
                                                        {...field}
                                                        label="数据库类型"
                                                        name={[field.name, 'dbType']}
                                                        rules={[{ required: true, message: '请填写' }]}
                                                    >
                                                        <Select options={DbUsageOptions} style={{ width: 242 }} onChange={() => { }} />
                                                    </Form.Item>
                                                    <Form.Item
                                                        {...field}
                                                        label="地址"
                                                        name={[field.name, 'dbAddress']}
                                                        rules={[{ required: true, message: '请填写' }]}
                                                    >
                                                        <Input />
                                                    </Form.Item>
                                                    <Form.Item
                                                        {...field}
                                                        label="端口"
                                                        name={[field.name, 'dbPort']}
                                                        rules={[{ required: true, message: '请填写' }]}
                                                    >
                                                        <Input />
                                                    </Form.Item>
                                                    <Form.Item
                                                        {...field}
                                                        label="用户名"
                                                        name={[field.name, 'dbUser']}
                                                        rules={[{ required: true, message: '请填写' }]}
                                                    >
                                                        <Input />
                                                    </Form.Item>
                                                    <Form.Item
                                                        {...field}
                                                        label="密码"
                                                        name={[field.name, 'dbPassword']}
                                                        rules={[{ required: true, message: '请填写' }]}
                                                    >
                                                        <Input />
                                                    </Form.Item>

                                                    <div style={{ display: "flex" }}>
                                                        <Form.Item
                                                            {...field}
                                                            label="类别"
                                                            name={[field.name, 'dbUsage']}
                                                            rules={[{ required: true, message: '请填写' }]}
                                                        >
                                                            <Select options={options} style={{ width: 220 }} onChange={() => { }} />
                                                        </Form.Item>
                                                        <Form.Item style={{ marginLeft: 80 }}><MinusCircleOutlined onClick={() => remove(field.name)} /></Form.Item>
                                                    </div>
                                                    < Divider />
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

                    </Spin>

                </div>

            </div>),
        },
    ];

    return (
        <div className="station-plan-content">
            <EditNodeDraw
                indentId={indentId}
                mode={nodeMode}
                curRecord={curRecord}
                onSave={() => {
                    setNodeMode("HIDE")
                    getNodeListData();
                }}
                onClose={() => {
                    setNodeMode("HIDE")
                }}
            />
            <Steps current={current}>
                {steps.map(item => (
                    <Step key={item.title} title={item.title} />
                ))}
            </Steps>
            <div className="steps-content">{steps[current].content}</div>
            <div className="steps-action">
                {current < steps.length - 1 && (
                    <Button type="primary" onClick={async () => {
                        if (current === 0) {
                            const params = await baseInfoForm.validateFields()
                            //enableMutiCluster
                            saveBasicInfo({ ...params, indentId: indentId, enableMutiCluster: params?.enableMutiCluster === true ? true : false }).then((res) => {
                                if (res?.code === 1000) {
                                    next()
                                }

                            })

                        }
                        if (current === 1) {
                            next()
                        }

                    }}>
                        下一步
                    </Button>
                )}
                {current === steps.length - 1 && (
                    <Button type="primary" onClick={async () => {
                        if (current === 2) {
                            const params = await form.validateFields()
                            let dataParams: any = []
                            let objectData: any = {};
                            for (const key in params) {
                                if (Object.prototype.hasOwnProperty.call(params, key)) {
                                    const element = params[key];
                                    if (key !== "more") {
                                        objectData[key] = element

                                    }
                                    if (key === "dbPort") {
                                        objectData[key] = Number(element)

                                    }

                                }
                            }
                            dataParams = [objectData]
                            if (params?.more?.length > 0) {
                                const paramsData = params?.more?.map((ele: any) => (
                                    {
                                        ...ele,
                                        dbPort: Number(ele?.dbPort)
                                    }
                                )


                                )
                                dataParams = [objectData].concat(paramsData)
                            }

                            saveDatabaseInfo({ indentId: indentId, databases: dataParams }).then((res) => {
                                if (res?.success) {
                                    message.success(res?.data)
                                    setDisabled(true)
                                    // onUpdate()

                                }


                            })

                        }
                    }}>
                        提交
                    </Button>
                )}
                {current > 0 && (
                    <Button style={{ margin: '0 8px' }} onClick={() => prev()} disabled={disabled}>
                        上一步
                    </Button>
                )}
            </div>
        </div>

    )
}