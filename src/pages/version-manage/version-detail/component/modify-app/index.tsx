import React, { useMemo, useState } from 'react';
import { Form, Modal, Table, Space, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import MonacoSqlEditor from '@/components/monaco-sql-editor';
import AceEditor from '@/components/ace-editor';
import './index.less'

export default function ModifyApp() {
    const [data, setData] = useState<any>([{ content: '10', code: 'hbos-dtc' }]);
    const [visible, setVisible] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string>('');
    const [mode, setMode] = useState<string>('hide');
    const [curRecord, setCurRecord] = useState<any>({});
    const [form] = Form.useForm();
    const columns = [
        {
            title: '应用CODE',
            dataIndex: 'code',
            width: 120,
        },
        {
            title: '应用类型',
            dataIndex: 'id',
            width: 80,
        },
        {
            title: '变更内容',
            dataIndex: 'content',
            width: 100,
            render: (value: string, record: any) => <a onClick={() => { clickRow('content', record) }}>{value}</a>
        },
        {
            title: '变更配置',
            dataIndex: 'content',
            width: 100,
            render: (value: string, record: any) => <a onClick={() => { clickRow('config', record) }}>{value}</a>
        },
        {
            title: '变更SQL',
            dataIndex: 'content',
            width: 100,
            render: (value: string, record: any) => <a onClick={() => { clickRow('sql', record) }}>{value}</a>
        },
        {
            title: '应用版本状态',
            dataIndex: 'id',
            width: 120,
        },
        {
            title: '版本Tag',
            dataIndex: 'id',
            width: 120,
        },
        {
            title: '出包时间',
            dataIndex: 'id',
            width: 120,
        },
        {
            title: '出包人',
            dataIndex: 'id',
            width: 120,
        },
    ]

    const modalColumns = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 160,
        },
        {
            title: '类型',
            dataIndex: 'type',
            width: 120,
        },
        {
            title: '标题',
            dataIndex: 'title',
            width: 220,
        },
        {
            title: '关联分支',
            dataIndex: 'feature',
            width: 220,
        },

    ]

    const clickRow = (type: string, record: any) => {
        setCurRecord(record);
        setMode(type);
    }
    return (
        <>
            <div className='table-top'>
                <div className='flex-space-between'>
                    <Space>
                        <span>应用总数：7</span>
                        <span>前端应用：7</span>
                        <span>后端应用：3</span>
                    </Space>
                    <div>
                        <Tooltip title='ceshi ceshi ' placement="top">
                            <QuestionCircleOutlined style={{ marginLeft: '5px' }} />
                        </Tooltip>
                        搜索：
                        <input
                            style={{ width: 200 }}
                            placeholder='输入内容进行查询过滤'
                            className="ant-input ant-input-sm"
                            onChange={(e) => {
                                //   filter(e.target.value)
                            }}
                        ></input>
                    </div>
                </div>
            </div>
            <Table
                dataSource={data}
                // loading={loading || updateLoading}
                bordered
                rowKey="id"
                pagination={false}
                columns={columns}
            ></Table>

            <Modal
                visible={mode !== 'hide'}
                title={curRecord?.code || ''}
                onCancel={() => { setMode('hide') }}
                width={900}
                footer={null}
            >
                <div className='modify-app-modal'>
                    {mode === 'content' &&
                        <Table
                            dataSource={[]}
                            // loading={loading || updateLoading}
                            bordered
                            rowKey="id"
                            pagination={false}
                            columns={modalColumns}
                        ></Table>}
                    {mode === 'config' &&
                        <Form form={form}>
                            <Form.Item name="values">
                                <AceEditor mode="yaml" height={500} />
                            </Form.Item>
                        </Form>
                    }
                    {mode === 'sql' &&
                        <div className='modal-sql-container'>
                            <MonacoSqlEditor
                                isSqlExecuteBtn={false}
                                isSqlBueatifyBtn={false}
                                isSqlExecutePlanBtn={false}
                                tableFields={{}}
                                initValue={'initData'}
                                implementDisabled={false}
                            />
                        </div>}
                </div>
            </Modal>
        </>
    )
}