import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Form, Input, Modal, Button, message, Table, Switch } from 'antd';
import { UploadOutlined, CloseOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { tableColumns } from '../schema';
import DetailContext from '../context';
import { getConsumers, delService } from '../service';

export default function ConsumerList() {
    const [form] = Form.useForm();
    const [pageSize, setPageSize] = useState<number>(20);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);
    const { envCode, tabKey, clickNamespace, loading } = useContext(DetailContext);
    const [tabelLoading, setTableLoading] = useState<boolean>(false);
    const [tableSource, setTableSource] = useState<any>([]);
    const [switchValue, setSwitchValue] = useState<boolean>(true);
    const pageData = useMemo(() => tableSource.slice((pageIndex - 1) * pageSize, pageIndex * pageSize), [pageIndex, pageSize, tableSource])

    useEffect(() => {
        if (envCode && clickNamespace?.namespaceShowName) {
            getList();
        }
    }, [envCode, clickNamespace])

    const getList = (hasIpCount = switchValue) => {
        setTableLoading(true)
        const values = form.getFieldsValue();
        getConsumers({ namespaceId: clickNamespace?.namespaceId, envCode, ...values, hasIpCount }).then((res) => {
            if (res?.success) {
                setTableSource(res?.data?.serviceList || []);
                setTotal(res?.data?.count || 0)
            }
        }).finally(() => { setTableLoading(false) })
    }

    const columns = useMemo(() => {
        return tableColumns({
            tabKey,
            envCode,
            clickNamespace,
            handleDel: async (record: any) => {
                const { name, groupName } = record;
                const res = await delService({ namespaceId: clickNamespace?.namespaceId, envCode, serviceName: name, groupName });
                if (res?.success) {
                    message.success('删除成功！');
                    initSearch();
                }
            }
        })
    }, [pageData, envCode, clickNamespace, tabKey])

    const pageSizeClick = (pagination: any) => {
        setPageIndex(pagination.current);
        getList();
    }

    const initSearch = () => {
        setPageIndex(1);
        getList();
    }

    return (<>
        <div className="consumer-wrapper main-container">
            <>
                <div className="search-form">
                    <Form layout="inline" form={form} onFinish={() => { getList() }} onReset={() => { form.resetFields(); initSearch() }}>
                        <Form.Item label="服务名称" name="serviceName">
                            <Input placeholder="请输入服务名称" style={{ width: 180 }} />
                        </Form.Item >
                        <Form.Item label="请输入分组名称" name="groupName">
                            <Input placeholder="请输入分组名称" style={{ width: 180 }} />
                        </Form.Item>
                        {/* <Form.Item label="应用名称" name="deployName">
                            <Input placeholder="请输入应用名称" style={{ width: 180 }} />
                        </Form.Item> */}
                        <Form.Item label="隐藏空服务" name="hasIpCount">
                            <Switch checked={switchValue} onChange={(value: boolean) => { setSwitchValue(value); getList(value) }} />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">查询</Button>
                        </Form.Item>
                        <Form.Item>
                            <Button type="default" htmlType="reset" >重置</Button>
                        </Form.Item>

                    </Form>

                </div>
                <div className="registry-table">
                    <Table
                        rowKey="id"
                        columns={columns}
                        dataSource={pageData || []}
                        loading={tabelLoading || loading}
                        bordered
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