import { Drawer, Select, Input, Button, Table, Popconfirm } from 'antd';
import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import {
    EditableProTable,
} from '@ant-design/pro-table';
import type { ProFormInstance } from '@ant-design/pro-form';
import ProForm from '@ant-design/pro-form';
import { PlusOutlined } from '@ant-design/icons';
import { columns, commonColumns } from '../../columns';

const data = [
    { id: 1, result: '个人编号', medicalIns: '个人编号', detail: '个人编号' },
    { id: 2, result: '创建时间', medicalIns: '创建时间', detail: '创建时间' },

]


const options = commonColumns.map((item) => ({ label: item.title, value: item.title }))

const ETable = React.forwardRef((props: any, ref) => {
    const { deleteSuccess, addSuccess } = props;
    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
    const [dataSource, setDataSource] = useState<any>(data)
    const formRef = useRef<ProFormInstance<any>>();
    const actionRef = useRef(null) as any;
    useImperativeHandle(
        ref,
        () => ({
            reset: () => {
                // function name
                editableKeys.forEach((k) => actionRef.current.cancelEditable(k));
            },
        }),
        [editableKeys],
    );
    const waitTime = (time: number) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
                addSuccess();
            }, time);
        });
    };
    const column: any = [
        {
            title: '结果列名',
            dataIndex: 'result'
        },
        {
            title: '医保上传',
            dataIndex: 'medicalIns',
            valueType: 'select',
            renderFormItem: () => {
                return <Select options={options}></Select>
            }
        },
        {
            title: '校验详情',
            dataIndex: 'detail',
            valueType: 'select',
            renderFormItem: () => {
                return <Select options={options}></Select>
            }

        },
        {
            title: '操作',
            valueType: 'option',
            width: 200,
            render: (text: string, record: any, _: any, action: any) => [
                <a
                    key="editable"
                    onClick={() => {
                        action?.startEditable?.(record.id);
                    }}
                >
                    编辑
              </a>,
                <Popconfirm
                    title='确定删除吗？'
                    onConfirm={() => {
                        setDataSource(dataSource.filter((item: any) => item.id !== record.id));
                        deleteSuccess()
                    }}
                    okText="确定"
                    cancelText="取消"
                >
                    <a style={{ marginLeft: '10px' }}>删除</a>
                </Popconfirm>,
                //     <a
                //         key="delete"
                //         onClick={() => {
                //             setDataSource(dataSource.filter((item: any) => item.id !== record.id));
                //         }}
                //     >
                //         删除
                //   </a>,
            ],
        },
    ]


    return (
        <>
            <div className='buttom-wrapper'>
                <Button
                    type="primary"
                    onClick={() => {
                        actionRef.current?.addEditRecord?.({
                            id: (Math.random() * 1000000).toFixed(0),
                            title: '新的一行',
                        });
                    }}
                    size='small'
                    icon={<PlusOutlined />}
                >
                    新建一行
        </Button>
            </div>
            <ProForm
                formRef={formRef}
                initialValues={{
                    table: dataSource,
                }}
                submitter={false}
                validateTrigger="onBlur"
            >
                <EditableProTable
                    rowKey="id"
                    actionRef={actionRef}
                    columns={column}
                    // 关闭默认的新建按钮
                    recordCreatorProps={false}
                    value={dataSource}
                    onChange={setDataSource}
                    editable={{
                        // editableKeys,
                        onSave: async (rowKey, data, row) => {
                            await waitTime(1000);
                        },
                        onChange: (key) => {
                            setEditableRowKeys(key);
                        },
                        actionRender: (row, config, defaultDom) => {
                            return [defaultDom.save, defaultDom.delete, defaultDom.cancel];
                        },
                    }}
                />
            </ProForm>
        </>
    );
});
export default ETable;