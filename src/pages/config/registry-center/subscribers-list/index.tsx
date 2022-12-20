import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Form, Input, Modal, Button, Space, Table, Spin, Empty, Tooltip, message, Select, Popconfirm, Divider } from 'antd';
import { UploadOutlined, CloseOutlined, InfoCircleOutlined } from '@ant-design/icons';
import DetailContext from '../context';
import { tableColumns } from '../schema';
export default function SubscriberList() {
    const [form] = Form.useForm();
    const [pageSize, setPageSize] = useState<number>(20);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);
    const { envCode, tabKey } = useContext(DetailContext);
    const [loading, setLoading] = useState<boolean>(false);
    const [mode, setMode] = useState<EditorMode>('HIDE');
    const [curRecord, setcurRecord] = useState<any>({});//当前table一行数据
    const [tabelLoading, setTableLoading] = useState<boolean>(false);
    const [tableSource, setTableSource] = useState<any>([]);

    const columns = useMemo(() => {
        return tableColumns({
            toDetail: () => { },
            toSubscriber: () => { },
            handleDel: () => { }
        })
    }, [])

    const pageSizeClick = () => {

    }

    return (<>
        <div className="provider-wrapper">
            <>
                <div className="search-form">
                    <Form layout="inline" form={form} onFinish={(values) => {
                        setPageIndex(pageIndex);
                    }}>
                        <Form.Item label="服务名称" name="dataId">
                            <Input placeholder="请输入服务名称" style={{ width: 200 }} />

                        </Form.Item >
                        <Form.Item label="请输入分组名称" name="groupId">
                            <Input placeholder="添加通配符'*'进行模糊查询" style={{ width: 200 }} />

                        </Form.Item>
                        <Form.Item label="应用名称" name="appName">
                            <Input placeholder="请输入应用名称" style={{ width: 200 }} />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">查询</Button>
                        </Form.Item>

                    </Form>

                </div>
                <div className="table">
                    <Table
                        rowKey="nacosId"
                        columns={columns}
                        dataSource={tableSource}
                        loading={tabelLoading}
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