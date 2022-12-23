import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Form, Input, Modal, Button, Space, Table, Descriptions, Spin, Tooltip, message, Select, Popconfirm, Divider } from 'antd';
import { RedoOutlined } from '@ant-design/icons';
import PageContainer from '@/components/page-container';
import { ContentCard } from '@/components/vc-page-content';
import { getServiceDetail, updateServiceInstance } from '../service';
import ServiceEdit from './edit-drawer';
import { parse, stringify } from 'query-string';
import { history, useLocation } from 'umi';
import debounce from 'lodash/debounce';
import './index.less';

export default function ServiceDetail() {
    let location: any = useLocation();
    const query: any = parse(location.search);
    const { serviceName, groupName, key, envCode, namespaceId } = query || {};
    const [tabelLoading, setTableLoading] = useState<boolean>(false);
    const [initData, setInitData] = useState<any>([]);
    const [tableSource, setTableSource] = useState<any>([]);
    const [visible, setVisible] = useState<boolean>(false);
    const [deployName, setDeployName] = useState<string>('');
    const [form] = Form.useForm();
    const [originData, setOriginData] = useState<any>([]);
    const searchValueInput = useRef(null) as any;

    useEffect(() => {
        if (serviceName && groupName && key && envCode) {
            getList();
        }
    }, [serviceName, groupName, key, envCode, namespaceId])

    const columns = [
        {
            title: 'IP',
            dataIndex: 'ip',
            key: 'ip',
            width: 120,
            ellipsis: true,
            render: (text: string) => <Tooltip title={text}>{text}</Tooltip>,
        },
        {
            title: '端口',
            dataIndex: 'port',
            key: 'port',
            width: 80,
            ellipsis: true,
            render: (text: string) => <Tooltip title={text}>{text}</Tooltip>,
        },
        {
            title: '临时实例',
            dataIndex: 'ephemeral',
            key: 'ephemeral',
            width: 80,
            ellipsis: true,
            render: (text: string) => <span>{text ? 'true' : 'false'}</span>
        },
        {
            title: '权重',
            dataIndex: 'weight',
            key: 'weight',
            width: 50,
            ellipsis: true,
            render: (text: string) => <Tooltip title={text}>{text}</Tooltip>,
        },
        {
            title: '健康状态',
            dataIndex: 'healthy',
            key: 'healthy',
            width: 80,
            ellipsis: true,
            render: (text: string) => <span>{text ? 'true' : 'false'}</span>
        },
        {
            title: '元数据',
            dataIndex: 'metadata',
            key: 'metadata',
            width: 400,
            ellipsis: true,
            render: (value: string) => {
                return Object.keys(value || {}).map((key: any) =>
                    <div>{key}={value[key]}</div>
                )
            }
        },
        {
            title: '操作',
            dataIndex: 'option',
            key: 'option',
            width: 120,
            render: (_: string, record: any) => (
                <Space>
                    <a onClick={() => { setInitData(record); setVisible(true) }}>编辑</a>
                    <Popconfirm
                        title={`确认要${record?.enabled ? '下线' : '上线'}吗?`}
                        onConfirm={() => { handleUpdate(record) }}
                    >
                        <a>{record?.enabled ? '下线' : '上线'}</a>
                    </Popconfirm>
                </Space>
            ),
        },
    ]

    const getList = () => {
        const value = form.getFieldsValue();
        setTableLoading(true)
        getServiceDetail({ serviceName, groupName, envCode, namespaceId, ...value }).then((res) => {
            if (res?.success) {
                setDeployName(res?.data?.deployName || '')
                setTableSource(res?.data?.instancesInfo?.list || []);
                setOriginData(res?.data?.instancesInfo?.list || [])
            }
        }).finally(() => { setTableLoading(false) })
    }

    const handleUpdate = (record: any) => {
        const data = JSON.parse(JSON.stringify(record || {}));
        data.metadata = JSON.stringify(data.metadata || {})
        setTableLoading(true)
        updateServiceInstance({ ...data, enabled: record.enabled ? false : true, serviceName, groupName, envCode, namespaceId }).then((res) => {
            if (res?.success) {
                message.success('操作成功');
                getList()
            }
        }).finally(() => { setTableLoading(false) })
    }

    const goBack = () => {
        history.go(-1);
    }

    const filter = debounce((value) => filterData(value), 500)

    const filterData = (value: string, update = true) => {
        if (!value) {
            setTableSource(originData);
            return;
        }
        const data = JSON.parse(JSON.stringify(originData));
        const afterFilter: any = [];
        data.forEach((item: any) => {
            if (item.ip?.indexOf(value) !== -1 || (item?.metadata?.application || '').indexOf(value) !== -1) {
                afterFilter.push(item);
            }
        });
        setTableSource(afterFilter);
    }

    return (
        <PageContainer className="service-detail-page main-container">
            <ServiceEdit
                visible={visible}
                onClose={() => { setVisible(false) }}
                onSave={getList}
                initData={initData}
                serviceName={serviceName}
                groupName={groupName}
                namespaceId={namespaceId}
                envCode={envCode}
            />
            <ContentCard>
                <Spin spinning={tabelLoading}>
                    <Descriptions
                        bordered
                        column={4}
                        title="服务详情"
                        extra={
                            <Space>
                                <Button type="primary" icon={<RedoOutlined />} onClick={() => {
                                    if (searchValueInput.current) {
                                        searchValueInput.current.value = ('');
                                    }
                                    getList()
                                }}>刷新</Button>
                                <Button onClick={goBack}>返回</Button>
                            </Space>
                        }
                    >
                        <Descriptions.Item labelStyle={{ width: '120px' }} label="应用部署名" span={6}>{deployName || ''}</Descriptions.Item>
                        <Descriptions.Item label="分组" span={6}>{groupName || ''}</Descriptions.Item>
                        <Descriptions.Item labelStyle={{ width: '120px' }} label="服务名" span={12}>{serviceName || ''}</Descriptions.Item>
                    </Descriptions>
                </Spin>
                <h2 style={{ marginTop: 15 }}>服务实例</h2>
                <div style={{ marginBottom: 10 }} className='flex-end'>
                    搜索：
                    <input
                        ref={searchValueInput}
                        style={{ width: 200 }}
                        className="ant-input ant-input-sm"
                        onChange={(e) => {
                            filter(e.target.value)
                        }}
                        disabled={!originData?.length}
                        placeholder='请输入IP/应用部署名搜索'
                    ></input>
                </div>

                <div className="table">
                    <Table
                        rowKey="id"
                        columns={columns}
                        dataSource={tableSource}
                        loading={tabelLoading}
                        bordered
                        pagination={false}
                    />

                </div>
            </ContentCard>
        </PageContainer>
    )
}