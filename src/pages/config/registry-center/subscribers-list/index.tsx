import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Form, Input, Modal, Button, Space, Table, Spin, Empty, Tooltip, message, Select, Popconfirm, Divider } from 'antd';
import { UploadOutlined, CloseOutlined, InfoCircleOutlined } from '@ant-design/icons';
import DetailContext from '../context';
import { getSubscribers } from '../service';
import { parse, stringify } from 'query-string';
import { history, useLocation } from 'umi';

export default function SubscriberList() {
    let location: any = useLocation();
    const query: any = parse(location.search);
    const { serviceName, groupName } = query || {}
    const [form] = Form.useForm();
    const [pageSize, setPageSize] = useState<number>(20);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);
    const { envCode, tabKey, clickNamespace, loading } = useContext(DetailContext);
    const [tabelLoading, setTableLoading] = useState<boolean>(false);
    const [tableSource, setTableSource] = useState<any>([]);
    const pageData = useMemo(() => tableSource.slice((pageIndex - 1) * pageSize, pageIndex * pageSize), [pageIndex, pageSize, tableSource])

    useEffect(() => {
        if (serviceName) {
            form.setFieldsValue({ serviceName, groupName });
            getList();
        }
        history.push({
            pathname: location.pathname,
            search: stringify({ ...query, serviceName: '', groupName: '' })
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

    return (<>
        <div className="provider-wrapper">
            <>
                <div className="search-form">
                    <Form layout="inline" form={form} onFinish={getList}>
                        <Form.Item label="服务名称" name="serviceName" rules={[{ required: true, message: '请输入服务名称再查询' }]}>
                            <Input placeholder="请输入服务名称" style={{ width: 200 }} />

                        </Form.Item >
                        <Form.Item label="分组名称" name="groupName">
                            <Input placeholder="请输入分组名称" style={{ width: 200 }} />

                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">查询</Button>
                        </Form.Item>
                        {/* <Form.Item>
                            <Button type="default" htmlType="reset" >重置</Button>
                        </Form.Item> */}

                    </Form>

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