import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Form, Input, Modal, Button, Space, Table, Spin, Empty, Tooltip, message, Select, Popconfirm, Divider } from 'antd';
import { UploadOutlined, CloseOutlined, InfoCircleOutlined } from '@ant-design/icons';
import DetailContext from '../context';
import { getSubscribers } from '../service';
import { parse, stringify } from 'query-string';
import { history, useLocation } from 'umi';

export default function SubscriberList() {
    let sessionData: any = sessionStorage.getItem('registry_subscriber_params') || '{}';
    let location: any = useLocation();
    const query: any = parse(location.search);
    const { serviceName, groupName, type } = query || {}
    const [form] = Form.useForm();
    const [pageSize, setPageSize] = useState<number>(20);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);
    const { envCode, tabKey, clickNamespace, loading } = useContext(DetailContext);
    const [tabelLoading, setTableLoading] = useState<boolean>(false);
    const [tableSource, setTableSource] = useState<any>([]);
    const pageData = useMemo(() => tableSource.slice((pageIndex - 1) * pageSize, pageIndex * pageSize), [pageIndex, pageSize, tableSource])

    useEffect(() => {
        if (envCode && clickNamespace?.namespaceShowName) {
            const data = JSON.parse(sessionData)
            form.setFieldsValue(data);
            if (data?.serviceName) {
                getList();
            }
        }
    }, [envCode, clickNamespace])

    useEffect(() => {
        // 跳转过来的时候请求 但是数据只保留一次 之后不再回填
        if (serviceName) {
            form.setFieldsValue({ serviceName, groupName });
            getList();
        }
        history.push({
            pathname: location.pathname,
            search: stringify({ ...query, serviceName: undefined, groupName: undefined })
        })
    }, [serviceName, groupName])

    const columns = [
        {
            title: '地址',
            dataIndex: 'addrStr',
            key: 'addrStr',
            width: '30%',
            ellipsis: true,
            render: (text: string) => <Tooltip title={text}>{text}</Tooltip>,
        },
        {
            title: '客户端版本',
            dataIndex: 'agent',
            key: 'agent',
            width: '30%',
            ellipsis: true,
            render: (text: string) => <Tooltip title={text}>{text}</Tooltip>,
        },
        {
            title: '应用名',
            dataIndex: 'app',
            key: 'app',
            width: '30%',
            ellipsis: true,
            render: (text: string) => <Tooltip title={text}>{text}</Tooltip>,
        },
    ]

    const getList = async () => {
        const values = await form.validateFields();
        getSubscribers({ namespaceId: clickNamespace?.namespaceId, envCode, ...values }).then((res) => {
            if (res?.success) {
                setTableSource(res?.data?.subscriberInfo?.subscribers || []);
                setTotal(res?.data?.subscriberInfo?.count || 0)
            }
        })
    }

    const pageSizeClick = (pagination: any) => {
        setPageIndex(pagination.current);
        getList();
    }

    const initSearch = () => {
        setPageIndex(1);
        getList()
    }

    const goBack = () => {
        history.push({
            pathname: `/matrix/config/registry/${type}`,
            search: stringify({ key: type, envCode, namespaceId: clickNamespace?.namespaceId || '' })
        })
    }

    return (<>
        <div className="provider-wrapper">
            <>
                <div className='flex-space-between' style={{ alignItems: 'center' }}>
                    <div className="search-form">
                        <Form layout="inline" form={form} onFinish={(value: any) => {
                            getList();
                            sessionStorage.setItem('registry_subscriber_params', JSON.stringify(value || {}));
                        }}>
                            <Form.Item label="服务名称" name="serviceName" rules={[{ required: true, message: '请输入服务名称再查询' }]}>
                                <Input placeholder="请输入服务名称" style={{ width: 200 }} />
                            </Form.Item >
                            <Form.Item label="分组名称" name="groupName">
                                <Input placeholder="请输入分组名称" style={{ width: 200 }} />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">查询</Button>
                            </Form.Item>
                        </Form>
                    </div>
                    {(type === 'provider' || type === 'consumer') && <div>
                        <Button onClick={goBack}>返回</Button>
                    </div>}
                </div>
                <div className="registry-table">
                    <Table
                        rowKey="id"
                        columns={columns}
                        dataSource={pageData || []}
                        loading={tabelLoading || loading}
                        bordered
                        scroll={{ y: window.innerHeight - 440 }}
                        pagination={{
                            current: pageIndex,
                            total,
                            pageSize,
                            showSizeChanger: true,
                            onShowSizeChange: (_, size) => {
                                setPageSize(size);
                                setPageIndex(1); //
                            },
                            showTotal: () => `总共 ${total} 条数据`,
                        }}
                        onChange={pageSizeClick}
                    />

                </div>
            </>
        </div>
    </>)
}