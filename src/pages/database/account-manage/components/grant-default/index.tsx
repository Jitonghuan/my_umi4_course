/*
 * @Author: muxi.jth 2016670689@qq.com
 * @Date: 2022-07-07 17:24:55,2022-12-19 11:39
 * @LastEditors: muxi.jth 2016670689@qq.com
 * @LastEditTime: 2022-07-12 16:55:26
 * @FilePath: /fe-matrix/src/pages/database/account-manage/components/grant/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Modal, Space, Button, Form, Segmented, Table, Spin, message, Select, Tag } from 'antd';
import { useGetSchemaList } from '../../hook';
import { getPrivsDetail, getTableColumnList, modifyPrivs } from "./hook";
import GrantRecycle from '../grant-recycle';
import { columns, DataType, createEditColumns, createDatabseEditColumns, createTableEditColumns, } from "./schema";
import type { ProFormInstance } from '@ant-design/pro-form';
import { EditableProTable } from '@ant-design/pro-table';
import type { ActionType } from '@ant-design/pro-table';
import PreviewSql from "../preview-sql";
import { schemaDataTreeOption } from "./schema";
import { schemaStructOption, globalDataTreeOption, globalManageOption, } from '../../schema';
import './index.less';

export interface GrantProps {
    mode: string;
    clusterId: number;
    curRecord: any;
    onSave: () => void;
    onClose: () => void;
}

const options = [
    { label: "全局权限", value: "global" },
    { label: "库权限", value: "database" },
    { label: "表权限", value: "table" },
    { label: "列权限", value: "column" }
]
export default function ScriptEditor(props: GrantProps) {
    const { mode, curRecord, onSave, onClose, clusterId } = props;
    const [objectForm] = Form.useForm();
    const [loading, schemaOptions, getSchemaList] = useGetSchemaList();
    const [grantRecycleMode, setGrantRecycleMode] = useState<EditorMode>('HIDE');
    const [activeValue, setActiveValue] = useState<string>("global")
    const actionRef = useRef<ActionType>();
    const ref = useRef<ProFormInstance>();
    const databaseActionRef = useRef<ActionType>();
    const databaseRef = useRef<ProFormInstance>();
    const tableActionRef = useRef<ActionType>();
    const tableRef = useRef<ProFormInstance>();
    const [columnTableSource, setColumnTableSource] = useState<any>([])
    const [tableSource, setTableSource] = useState<any>([])
    const [databaseSource, setDataBaseSource] = useState<any>([])
    const [defaultData, setDefaultData] = useState<any>([])
    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
    const [tableEditableKeys, setTableEditableRowKeys] = useState<React.Key[]>([]);
    const [dataBaseEditableKeys, setDataBaseEditableRowKeys] = useState<React.Key[]>([]);
    const [type, setType] = useState<string>('');
    const [form] = Form.useForm();
    const [tableForm] = Form.useForm();
    const [databaseForm] = Form.useForm();
    const [globalPrivs, setGlobalPrivs] = useState<any>([])
    const [dbPrivs, setDbPrivs] = useState<any>([])
    const [tablePrivs, setTablePrivs] = useState<any>([])
    const [columnPrivs, setColumnPrivs] = useState<any>([])
    const [oldPrivs, setOldPrivs] = useState<any>({})
    const [infoLoading, setInfoLoading] = useState<boolean>(false)
    const [tableOptions, setTableOptions] = useState<any>([]);
    const [columnOptions, setCoumnOptions] = useState<any>([]);
    const [defaultRow, setDefaultRow] = useState<any>([])
    const [ensureLoading, setEnsureLoading] = useState<boolean>(false);
    const [previewSqlMode, setPreviewSqlMode] = useState<EditorMode>('HIDE');
    const [count, setCount] = useState<number>(0)

    const getTableColumnListData = (dbName?: string, tableName?: string) => {
        getTableColumnList({ clusterId, dbName, tableName }).then((res) => {
            if (res?.success) {
                let data = res?.data;
                let source = data?.map((ele: any) => ({
                    label: ele,
                    value: ele
                }))
                if (tableName) {
                    setCoumnOptions(source)
                } else {
                    setTableOptions(source)
                }


            }

        })
    }
    useEffect(() => {
        if (clusterId && mode !== "HIDE") {
            getPrivsDetailData()
            getSchemaList({ clusterId })
        }
        return () => {
            setActiveValue('global')
        }
    }, [clusterId, mode])
    const getPrivsDetailData = () => {
        setInfoLoading(true)
        setGlobalPrivs([])
        setDefaultRow([])
        setDbPrivs([])
        setDataBaseSource([])
        // setDefaultData([])
        setColumnTableSource([])
        setTableSource([])
        setTablePrivs([])
        setColumnPrivs([])
        getPrivsDetail({ clusterId, user: curRecord?.user, host: curRecord?.host }).then((res) => {
            if (res?.success) {
                let dataSource = res?.data;
                setOldPrivs(dataSource)
                const { globalPrivs = [], dbPrivs = [], tablePrivs = [], columnPrivs = [] } = dataSource;
                let globalPrivsDataSource: any = globalPrivs?.map((item: string, index: number) => (item.toLowerCase()));
                setGlobalPrivs(globalPrivsDataSource);
                setDefaultRow(globalPrivsDataSource)
                if (dbPrivs?.length > 0) {
                    let data = dbPrivs?.map((item: any, index: number) => ({
                        ...item,
                        id: index,
                        //   privs:item?.privs?.join(' ')
                    }))
                    setDbPrivs(dbPrivs);
                    setDataBaseSource(data)
                
                    // setDefaultData(data)
                }
                if (tablePrivs?.length > 0) {
                    let data = tablePrivs?.map((item: any, index: number) => ({
                        ...item,
                        id: index,
                        // privs:item?.privs?.join(',')
                    }))
                    setTablePrivs(tablePrivs);
                    setTableSource(data)
                }
                if (columnPrivs?.length > 0) {
                    let data = columnPrivs?.map((item: any, index: number) => ({
                        ...item,
                        id: index,
                        // privs:item?.privs?.join(',')
                    }))
                    setColumnPrivs(columnPrivs)
                    setColumnTableSource(data)
                }
            }

        }).finally(() => {
            setInfoLoading(false)
        })
    }

    //库
    const databseTableColumns = useMemo(() => {

        return createDatabseEditColumns({
            schemaOptions,
            onEdit: (record, action) => {
                action?.startEditable?.(record.id);
                setType('edit');
            },
            onDelete: (record: any) => {
                setDataBaseSource(databaseSource.filter((item: any) => item.id !== record.id))

            },
        }) as any

    }, [schemaOptions, databaseSource])
    //表
    const tableColumns = useMemo(() => {
        return createTableEditColumns({
            schemaOptions,
            tableOptions,
            onDataBaseChange: (value: string) => {
                getTableColumnListData(value)
            },
            onDelete: (record: any) => {
                setTableSource(tableSource.filter((item) => item.id !== record.id))

            }

        }) as any

    }, [schemaOptions, tableOptions, tableSource])
    //列
    const cloumnTableColumns = useMemo(() => {
        return createEditColumns({
            schemaOptions,
            tableOptions,
            columnOptions,
            onDataBaseChange: (value: string) => {
                getTableColumnListData(value)
            },
            onTableChange: (database, table) => {
                getTableColumnListData(database, table)
            },
            onDelete: (record: any) => {
                setColumnTableSource(columnTableSource.filter((item) => item.id !== record.id))

            }
        }) as any

    }, [schemaOptions, tableOptions, columnOptions, columnTableSource])

    useEffect(() => {
        if (mode !== 'HIDE') {

        }

        return () => {
            objectForm.resetFields();
            setCount(0)

        };
    }, [mode]);

    const rowSelection = useMemo(() => {
        return {
            selectedRowKeys: defaultRow,
            onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
                setDefaultRow(selectedRowKeys)
            },
        };
    }, [defaultRow])
    const handleSubmit = () => {
        setEnsureLoading(true)
        modifyPrivs({
            clusterId, id: curRecord?.id, oldPrivs, newPrivs: {
                globalPrivs: defaultRow,
                dbPrivs: databaseSource,
                tablePrivs: tableSource,
                columnPrivs: columnTableSource
            }
        }).then((res) => {
            if (res?.success) {
                message.success("提交成功！")
                onSave()
            }
        }).finally(() => {
            setEnsureLoading(false)
        })
    }
    return (
        <>
            <PreviewSql
                mode={previewSqlMode}
                onClose={() => { setPreviewSqlMode("HIDE") }}
                curRecord={curRecord}
                oldPrivs={oldPrivs}
                newPrivs={
                    {
                        globalPrivs: defaultRow,
                        dbPrivs: databaseSource,
                        tablePrivs: tableSource,
                        columnPrivs: columnTableSource
                    }
                }
                onSave={() => { 
                    setPreviewSqlMode("HIDE")
                   
                     }} />
            <GrantRecycle
                mode={grantRecycleMode}
                onClose={() => { setGrantRecycleMode("HIDE") }}
                clusterId={clusterId}
                curRecord={curRecord}
                onSave={() => { setGrantRecycleMode("HIDE") 
                onSave()
                }} />
            <Modal
                title={<Space><span>{"编辑权限"}</span><span>(当前用户：<span style={{ color: '#1E90FF' }}>{curRecord?.user}</span>)</span></Space>}
                width={'70%'}
                visible={mode !== 'HIDE'}
                maskClosable={false}
                onCancel={onClose}
                onOk={onSave}
                footer={[
                    <Button
                        key="getValue"
                        type="primary"
                        loading={ensureLoading}
                        disabled={count === 0}
                        onClick={() => {
                            handleSubmit()
                        }}
                    >
                        确认
                   </Button>,
                    <Button
                        key="getValue"
                        type="primary"
                        loading={ensureLoading}
                        onClick={() => {
                            setPreviewSqlMode("VIEW")
                            setCount(count => count + 1)
                        }}
                    >
                        预览SQL
                   </Button>,
                    <Button
                        key="cancel"
                        style={{ marginRight: 10 }}
                        danger
                        onClick={() => {
                            onClose();
                        }}
                    >
                        取消
                  </Button>,

                ]}
            >
                <div>
                    <div className="table-caption">
                        <div className="caption-left">

                            <Segmented options={options} onChange={(e: any) => { setActiveValue(e) }} value={activeValue} />
                        </div>
                        <div className="caption-right">
                            <a onClick={() => { setGrantRecycleMode("EDIT") }}>授权/回收</a>
                        </div>
                    </div>
                    <div>
                        {activeValue === "global" && <Table
                            rowSelection={{
                                type: "checkbox",
                                ...rowSelection,
                            }}
                            rowKey="key"
                            loading={infoLoading}
                            columns={columns}
                            dataSource={globalDataTreeOption.concat(schemaStructOption, globalManageOption)}
                            pagination={false}

                        />
                        }

                        {activeValue === "database" &&
                            <div>

                                <EditableProTable
                                    rowKey="id"
                                    loading={infoLoading}
                                    scroll={{ x: '100%' }}
                                    // actionRef={databaseActionRef}
                                    // formRef={databaseRef}
                                    recordCreatorProps={{
                                        position: 'bottom',
                                        // newRecordType: 'dataSource',
                                        creatorButtonText: '添加',
                                        record: { id: (Math.random() * 1000000).toFixed(0) },
                                    }}
                                    columns={databseTableColumns}

                                    value={databaseSource}
                                    onChange={setDataBaseSource}
                                    // controlled={type==="edit"?true:false}
                                    pagination={false}
                                    editable={{
                                        // form: databaseForm,
                                        editableKeys: dataBaseEditableKeys,
                                        onCancel: async () => { setType("") },
                                        onSave: async (rowKey, data, row) => {
                                            let dataArry = databaseSource.filter((item: any) => item.id !== rowKey)
                                            const tableDataSource = databaseForm.getFieldsValue() as any[];
                                            console.log("---", data)


                                            let source = [...dataArry, { ...tableDataSource[rowKey], id: rowKey }]
                                            setDataBaseSource(source)



                                        },
                                        onChange: setDataBaseEditableRowKeys,
                                        actionRender: (row, config, dom) => [dom.save, dom.cancel],

                                    }}
                                />
                            </div>
                        }
                        {activeValue === "table" &&
                            <Spin spinning={infoLoading}>
                                <EditableProTable
                                    rowKey="id"
                                    scroll={{ x: '100%' }}
                                    loading={infoLoading}
                                    actionRef={tableActionRef}
                                    // formRef={tableRef}
                                    recordCreatorProps={{
                                        position: 'bottom',
                                        // newRecordType: 'dataSource',
                                        creatorButtonText: '添加',
                                        record: { id: (Math.random() * 1000000).toFixed(0) },
                                    }}
                                    columns={tableColumns}
                                    value={tableSource}
                                    onChange={setTableSource}
                                    pagination={false}
                                    editable={{
                                        form: tableForm,
                                        editableKeys: tableEditableKeys,
                                        onCancel: async () => { },
                                        onSave: async () => {

                                        },
                                        onChange: setTableEditableRowKeys,
                                        actionRender: (row, config, dom) => [dom.save, dom.cancel],
                                    }}
                                />
                            </Spin>

                        }
                        {activeValue === "column" &&
                            <EditableProTable
                                rowKey="id"
                                loading={infoLoading}
                                scroll={{ x: '100%' }}
                                actionRef={actionRef}
                                // formRef={ref}
                                recordCreatorProps={{
                                    position: 'bottom',
                                    // newRecordType: 'dataSource',
                                    creatorButtonText: '添加',
                                    record: { id: (Math.random() * 1000000).toFixed(0) },
                                }}
                                columns={cloumnTableColumns}
                                value={columnTableSource}
                                onChange={setColumnTableSource}
                                pagination={false}
                                editable={{
                                    form,
                                    editableKeys,
                                    onCancel: async () => { },
                                    onSave: async () => {

                                    },
                                    onChange: setEditableRowKeys,
                                    actionRender: (row, config, dom) => [dom.save, dom.cancel],
                                }}
                            />
                        }
                    </div>

                </div>

            </Modal>
        </>
    );
}
