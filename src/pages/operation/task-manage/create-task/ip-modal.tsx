import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Modal, message, Form, Input, Popconfirm } from 'antd';
import {
    EditableProTable,
} from '@ant-design/pro-table';
import type { ProFormInstance } from '@ant-design/pro-form';
import ProForm from '@ant-design/pro-form';
import { PlusOutlined } from '@ant-design/icons';


export default function IpModal(props: any) {
    const { visible, handleCancel, data, handleSubmit } = props;
    const [dataSource, setDataSource] = useState<any>([]);
    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
    useEffect(() => {
        setDataSource(data)
    }, [data])
    const column: any = [
        {
            title: 'IP',
            dataIndex: 'ip',
            key: 'ip',
            width: 300,
        },
        {
            title: '操作',
            valueType: 'option',
            width: 200,
            render: (text: string, record: any, _: any, action: any) => [
                <Popconfirm
                    title='确定删除吗？'
                    onConfirm={() => {
                        setDataSource(dataSource.filter((item: any) => item.ip !== record.ip));
                    }}
                    okText="确定"
                    cancelText="取消"
                >
                    <a style={{ marginLeft: '10px' }}>删除</a>
                </Popconfirm>,

            ],
        },
    ]
    return (
        <Modal width={600} title="IP管理" visible={visible} onCancel={handleCancel} onOk={() => handleSubmit(dataSource)}>

            <EditableProTable
                rowKey="id"
                columns={column}
                recordCreatorProps={{
                    record: () => ({ id: (Math.random() * 1000000).toFixed(0) }),
                    creatorButtonText: '新增IP',
                }}
                value={dataSource}
                onChange={setDataSource}
                editable={{
                    // form,
                    editableKeys,
                    onSave: async (rowKey, data, row) => {
                    },
                    onChange: (key) => {
                        setEditableRowKeys(key);
                    },
                    actionRender: (row, config, defaultDom) => {
                        return [defaultDom.save, defaultDom.delete, defaultDom.cancel];
                    },
                }}
            />

        </Modal>
    )
}