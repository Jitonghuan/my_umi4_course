import React, { useState, useEffect, useMemo, useRef, forwardRef, useImperativeHandle, } from 'react';
import { Tabs, message, Table, Card, Button, Popover,Tooltip } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { createTableColumns } from './schema';
import MonacoSqlEditor from '@/components/monaco-sql-editor';
import { useQueryLogsList } from '../../../common-hook';
import { exportResultApi } from '../../../service'
import { history } from 'umi'
import './index.less'
const { TabPane } = Tabs;
interface Iprops {
    tableFields: any;
    querySqlResult: (params: { sqlContent: string, sqlType: string }) => any
    sqlLoading: boolean;
    initSqlValue: string;
    firstInitSqlValue: string;
    implementDisabled: boolean
    onAdd: () => any;
    addCount: number;
    sqlResult: any;
    errorMsg: string;
    formRef: any;
    costTime: string;
    queryTableFields: (params: any) => any;
    //  queryTableFieldsMethods:(params:any)=>any;
    copyAdd: (sqlContent: string, tableCode?: string) => any;
    relayInfo: any;
    // instanceOptions:any

}
export default forwardRef(function RightContent(props: Iprops, ref: any) {
    const { tableFields, querySqlResult, relayInfo, initSqlValue, firstInitSqlValue, implementDisabled, onAdd, addCount } = props
    const { sqlResult, sqlLoading, formRef, queryTableFields, copyAdd, errorMsg, costTime } = props;
    const [logsloading, pageInfo, logsSource, setLogsSource, setPageInfo, queryLogsList] = useQueryLogsList();
    const [resultErrorMsg, setResultErrorMsg] = useState<string>("")
    const [resultCountTime, setResultCountTime] = useState<string>("")
    const [dataSource, setDataSource] = useState<any>([])
    const [downLoadDisabled, setDownLoadDisabled] = useState<boolean>(false);
    const [sql, setSql] = useState<string>("")
    const newTabIndex = useRef(0);
    const nextTabIndex = useRef(1);


    const exportAction = () => {

        return (
            <Popover placement="bottomRight" content={<div>
                <p >
                    <a
                        target="_blank"
                        onClick={() => {
                            console.log("---encodeURIComponent(sql)-----", encodeURIComponent(sql),)

                            message.info('开始导出...');
                            setDownLoadDisabled(true);
                            setTimeout(() => {
                                setDownLoadDisabled(false);
                            }, 3000);
                        }}
                        href={`${exportResultApi}?instanceId=${relayInfo?.instance}&sqlContent=${encodeURIComponent(sql)}&dbCode=${relayInfo?.dbCode}&tableCode=${relayInfo?.tableCode}&exportType=excel&envCode=${relayInfo?.envCode}`}
                    >Excel</a></p>
                <p><a
                    target="_blank"
                    onClick={() => {
                        message.info('开始导出...');
                        setDownLoadDisabled(true);
                        setTimeout(() => {
                            setDownLoadDisabled(false);
                        }, 3000);
                    }}
                    href={`${exportResultApi}?instanceId=${relayInfo?.instance}&sqlContent=${encodeURIComponent(sql)}&dbCode=${relayInfo?.dbCode}&tableCode=${relayInfo?.tableCode}&exportType=sql&envCode=${relayInfo?.envCode}`}
                >Sql</a></p>
            </div>} title="导出格式" trigger="click">
                <Button
                    type="primary"
                    disabled={downLoadDisabled}
                    className="downloadButton"

                >
                    导出查询数据
              </Button>
            </Popover>
        )
    }
    /* ----------------------------------------SQL Console--------------------------------------------- */
    const defaultPanes = useMemo(() => {

        return (
            new Array(1).fill(null).map((_, index) => {
                const id = String(index + 1);
                return {
                    label: `SQL console `,
                    children:
                        <MonacoSqlEditor
                            isSqlExecuteBtn={true}
                            isSqlBueatifyBtn={true}
                            isSqlExecutePlanBtn={true}
                            tableFields={tableFields}
                            initValue={firstInitSqlValue || "select * from user limit 10"}

                            subChange={(params: { sqlContent: string, sqlType: string }) => {
                                querySqlResult(params)
                                setSql(params?.sqlContent)
                                if (localStorage.getItem("_dbms_sql_console_tab")) {
                                    let key = localStorage.getItem("_dbms_sql_console_tab") || "1"
                                    let resultKey = Number(key.substring(6)) + 1
                                    if (key === "1") {
                                        setResultActiveKey(`newTab0`)
                                    }
                                    if (key !== "1") {
                                        setResultActiveKey(`newTab${resultKey}`)
                                    }

                                }


                            }}
                            implementDisabled={implementDisabled}
                        />,
                    key: id
                };
            })
        )
    }, [tableFields, firstInitSqlValue, implementDisabled]);
    useEffect(() => {
        if (sqlItems?.length === 1) {

            setSqlConsoleActiveKey(defaultPanes[0].key)
            localStorage.setItem('_dbms_sql_console_tab', defaultPanes[0].key);

            setSqlItems(defaultPanes)
        }


    }, [tableFields])

    const [sqlConsoleActiveKey, setSqlConsoleActiveKey] = useState(defaultPanes[0].key);
    const [sqlItems, setSqlItems] = useState(defaultPanes);
    const [curFirstInitSqlValue, setCurFirstInitSqlValue] = useState<string>("")

    useEffect(() => {
        // if (curFirstInitSqlValue) {
        const newSqlItems = [...sqlItems]
        const content = () => {
            return (
                {
                    label: `SQL console `,
                    children:
                        <MonacoSqlEditor
                            isSqlExecuteBtn={true}
                            isSqlBueatifyBtn={true}
                            isSqlExecutePlanBtn={true}
                            tableFields={tableFields}
                            initValue={firstInitSqlValue || "select * from user limit 10"}
                            subChange={(params: { sqlContent: string, sqlType: string }) => {
                                querySqlResult(params);
                                setSql(params?.sqlContent)
                                if (localStorage.getItem("_dbms_sql_console_tab")) {
                                    let key = localStorage.getItem("_dbms_sql_console_tab") || "1"
                                    let resultKey = Number(key.substring(6)) + 1
                                    if (key === "1") {
                                        setResultActiveKey(`newTab0`)
                                    }
                                    if (key !== "1") {
                                        setResultActiveKey(`newTab${resultKey}`)
                                    }

                                }

                            }}
                            implementDisabled={implementDisabled}
                        />,
                    key: "1"
                }
            )
        }
        newSqlItems[0] = content()
        setSqlItems(newSqlItems)
        // }
    }, [curFirstInitSqlValue, implementDisabled])

    const onSqlChange = (key: string) => {

        setSqlConsoleActiveKey(key);
        localStorage.setItem('_dbms_sql_console_tab', key);
        let resultKey = Number(key.substring(6)) + 1
        if (key === "1") {
            setResultActiveKey(`newTab0`)
        }
        if (key !== "1") {
            setResultActiveKey(`newTab${resultKey}`)
        }

    };

    useEffect(() => {
        const newPanes = [...resultItems];
        const content = () => {
            return (
                {
                    label: '查询历史',
                    children: <div>
                        <Table
                            columns={columns}
                            dataSource={logsSource}
                            loading={logsloading}
                            scroll={{ x: '100%',y:"calc(50vh - 190px) " }}
                            bordered
                            pagination={{
                                current: pageInfo.pageIndex,
                                total: pageInfo.total,
                                pageSize: pageInfo.pageSize,
                                showSizeChanger: true,
                                showTotal: () => `总共 ${pageInfo.total} 条数据`,
                            }}
                            onChange={pageSizeClick}
                        />

                    </div>,
                    key: '1',
                    closable: false,
                }
            )
        }
        newPanes[0] = content();
        setResultItems(newPanes)
    }, [logsSource, logsloading, pageInfo])


    const pageSizeClick = (pagination: any) => {
        setPageInfo({
            pageIndex: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
        });
        let obj = {
            pageIndex: pagination.current,
            pageSize: pagination.pageSize,
        };

        queryLogsList({ ...obj });
    };
    const columns = useMemo(() => {
        return createTableColumns(
            {
                onCopy: (record, index) => {
                    if (formRef) {

                        formRef.current.setFieldsValue({
                            ...record
                        })
                        queryTableFields({
                            ...record
                        })
                        // queryTableFieldsMethods({
                        //     ...record
                        // })
                    }

                    copyAdd(record?.sqlContent, record?.tableCode)
                },

            }
        ) as any;
    }, [])
    const initialItems = [

        {
            label: '查询历史',
            children: <div>
                <Table
                    columns={columns}
                    dataSource={logsSource}
                    loading={logsloading}
                    scroll={{ x: '100%',y:"calc(50vh - 190px) " }}
                    bordered
                    pagination={{
                        current: pageInfo.pageIndex,
                        total: pageInfo.total,
                        pageSize: pageInfo.pageSize,
                        showSizeChanger: true,
                        showTotal: () => `总共 ${pageInfo.total} 条数据`,
                    }}
                    onChange={pageSizeClick}
                />

            </div>,
            key: '1',
            closable: false,
        },
        {
            label: '查询结果', children:
                errorMsg ? <div>

                    <Card title="Error" size="small">
                        <p>{errorMsg}</p>
                    </Card>

                </div> :
                    <div>
                        <p style={{ paddingLeft: 10, display: "flex", justifyContent: "space-between" }}>
                            <span>
                                查询时间：{`${costTime} sec`} {!costTime && <span style={{ marginLeft: 10, color: "rgb(39,93,124)", }}>请输入条件并点击<i><b>执行按钮</b></i>进行结果查询</span>}

                            </span>
                            <span>
                                {dataSource?.length > 0 && exportAction()}

                            </span>
                        </p>
                        <Table dataSource={dataSource}
                        

                         loading={logsloading} bordered scroll={{ y:"calc(50vh - 190px) ",x: '100%'  }} pagination={{

                            showTotal: () => `总共 ${dataSource?.length || 0} 条数据`,
                        }} >
                            {dataSource?.length > 0 && (
                                Object.keys(dataSource[0])?.map((item: any) => {
                                    return (
                                        <Table.Column title={item} width={item&&item?.length<7?100:item&&item?.length>6?item?.length*10:100} dataIndex={item} ellipsis key={item} render={(value) => (
                                            <Tooltip placement="topLeft" title={value}>
                                              {value==="(null)"?<span style={{color:"#A9A9A9"}}>{value}</span>:<span>{value}</span>}
                                            </Tooltip>
                                          )} />
                                    )
                                })

                            )}
                        </Table>
                    </div>, key: `newTab0`, closable: false,
        }
    ];

    const [resultActiveKey, setResultActiveKey] = useState(initialItems[1].key);
    const [resultItems, setResultItems] = useState(initialItems);
    const onResultChange = (key: string) => {


        setResultActiveKey(key);

        if (key === "1") {
            queryLogsList()


        }
        let sqlKey = Number(key.substring(6)) - 1
        if (key === "newTab0") {
            setSqlConsoleActiveKey("1")
            localStorage.setItem('_dbms_sql_console_tab', "1");


        }
        if (key !== "newTab0" && key !== "1") {
            setSqlConsoleActiveKey(`newTab${sqlKey}`)
            localStorage.setItem('_dbms_sql_console_tab', `newTab${sqlKey}`);

        }

    };
    const getFirstInitSqlValue = (value: string) => {
        setCurFirstInitSqlValue(value)
        setSqlConsoleActiveKey(defaultPanes[0].key || "1")
        localStorage.setItem('_dbms_sql_console_tab', defaultPanes[0].key || "1");
        if (resultItems.length === 1 || resultItems[1].key !== "newTab0") {
            const newPanes = [...resultItems];
            const content = () => {
                return (
                    {
                        label: '查询结果', children:

                            <div>
                                <p style={{ paddingLeft: 10, display: "flex", justifyContent: "space-between" }}>
                                    <span>  查询时间：{`${costTime} sec`} {!costTime && <span style={{ marginLeft: 10, color: "rgb(39,93,124)", }}>请输入条件并点击<i><b>执行按钮</b></i>进行结果查询</span>}</span>
                                    <span>
                                        {dataSource?.length > 0 && exportAction()}

                                    </span>
                                </p>
                                <Table dataSource={dataSource}  loading={logsloading} pagination={{

                                    showTotal: () => `总共 ${dataSource?.length || 0} 条数据`,
                                }} bordered scroll={{ y:"calc(50vh - 190px) " ,x: '100%' }} >
                                    {dataSource?.length > 0 && (
                                        Object.keys(dataSource[0])?.map((item: any) => {
                                            return (
                                                <Table.Column title={item} dataIndex={item}  width={item&&item?.length<7?100:item&&item?.length>6?item?.length*10:100} ellipsis key={item}  render={(value) => (
                                                    <Tooltip placement="topLeft" title={value}>
                                                       {value==="(null)"?<span style={{color:"#A9A9A9"}}>{value}</span>:<span>{value}</span>}
                                                    </Tooltip>
                                                  )}/>
                                            )
                                        })

                                    )}
                                </Table>
                            </div>, key: `newTab0`, closable: false,
                    }

                )
            }
            newPanes[1] = content()
            setResultItems(newPanes)
            setResultActiveKey(`newTab0`)

        } else {
            setResultActiveKey(initialItems[1].key || `newTab0`)

        }

    }


    const addResult = () => {

        const newPanes = [...resultItems];
        const newActiveKey = `newTab${nextTabIndex.current++}`;
        newPanes.push(
            {
                label: '查询结果', children:
                    errorMsg ? <div>

                        <Card title="Error" size="small">
                            <p>{errorMsg}</p>
                        </Card>

                    </div> :
                        <div>
                            <p style={{ paddingLeft: 10, display: "flex", justifyContent: "space-between" }}>
                                <span>查询时间：{`${costTime} sec`} {!costTime && <span style={{ marginLeft: 10, color: "rgb(39,93,124)", }}>请输入条件并点击<i><b>执行按钮</b></i>进行结果查询</span>}</span>
                                <span>
                                    {dataSource?.length > 0 && exportAction()}

                                </span>
                            </p>
                            <Table dataSource={dataSource}  loading={logsloading} pagination={{

                                showTotal: () => `总共 ${dataSource?.length || 0} 条数据`,
                            }} bordered scroll={{y:"calc(50vh - 190px) ",x: '100%'  }} >
                                {dataSource?.length > 0 && (
                                    Object.keys(dataSource[0])?.map((item: any) => {
                                        return (
                                            <Table.Column title={item} dataIndex={item} key={item}  width={item&&item?.length<7?100:item&&item?.length>6?item?.length*10:100} ellipsis render={(value) => (
                                                <Tooltip placement="topLeft" title={value}>
                                                  {value==="(null)"?<span style={{color:"#A9A9A9"}}>{value}</span>:<span>{value}</span>}
                                                </Tooltip>
                                              )}/>
                                        )
                                    })

                                )}
                            </Table>
                        </div>, key: newActiveKey, closable: false,
            });
        setResultItems(newPanes);
        setResultActiveKey(newActiveKey);


    };



    const addSql = useMemo(() => {


        if (initSqlValue && initSqlValue !== "") {
            setDataSource([])
            setResultCountTime("")
            setResultErrorMsg("")
            const newActiveKey = `newTab${newTabIndex.current++}`;
            let tabArry = [...sqlItems, { label: 'SQL console ', children: 'New Tab Pane', key: newActiveKey }]
            if (tabArry.length < 11) {
                setSqlItems([...sqlItems, {
                    label: 'SQL console ', children:
                        <MonacoSqlEditor
                            isSqlExecuteBtn={true}
                            isSqlBueatifyBtn={true}
                            isSqlExecutePlanBtn={true}
                            tableFields={tableFields}
                            initValue={initSqlValue}
                            implementDisabled={implementDisabled}
                            subChange={(params: { sqlContent: string, sqlType: string }) => {
                                querySqlResult(params);
                                setSql(params?.sqlContent)
                                if (localStorage.getItem("_dbms_sql_console_tab")) {
                                    let key = localStorage.getItem("_dbms_sql_console_tab") || "1"
                                    let resultKey = Number(key.substring(6)) + 1
                                    if (key === "1") {
                                        setResultActiveKey(`newTab0`)
                                    }
                                    if (key !== "1") {
                                        setResultActiveKey(`newTab${resultKey}`)
                                    }

                                }


                            }}
                        />, key: newActiveKey
                }]);
                setSqlConsoleActiveKey(newActiveKey);
                localStorage.setItem("_dbms_sql_console_tab", newActiveKey)
                addResult()
            } else if (tabArry.length > 10) {
                message.info("您已经打开太多页面，请关闭一些吧！")
            }
        }
    }, [initSqlValue, addCount, relayInfo?.envCode, relayInfo?.instance, relayInfo?.dbCode,])

    const removeSql = (targetKey: string) => {
        const targetIndex = sqlItems.findIndex(pane => pane.key === targetKey);
        const newPanes = sqlItems.filter(pane => pane.key !== targetKey);
        if (newPanes.length && targetKey === sqlConsoleActiveKey) {
            const { key } = newPanes[targetIndex === newPanes.length ? targetIndex - 1 : targetIndex];

            setSqlConsoleActiveKey(key);
            localStorage.setItem("_dbms_sql_console_tab", key)

        }


        setSqlItems(newPanes);
        if (targetKey === "1") {
            removeResult(`newTab0`)
        }
        if (targetKey !== "1") {
            let key = Number(targetKey.substring(6)) + 1
            removeResult(`newTab${key}`)
        }

    };

    const onSqlEdit = (targetKey: any, action: 'add' | 'remove') => {
        if (action === 'add') {
            addSql;
        } else {
            removeSql(targetKey);
        }
    };
    /* --------------------------------------------------请求查询结果---------------------------------------------- */
    useEffect(() => {
        queryLogsList()
    }, [])

    const { TabPane } = Tabs;




    const removeResult = (targetKey: string) => {

        const targetIndex = resultItems.findIndex(pane => pane.key === targetKey);
        const newPanes = resultItems.filter(pane => pane.key !== targetKey);

        if (newPanes.length && targetKey === resultActiveKey) {
            const { key } = newPanes[targetIndex === newPanes.length ? targetIndex - 1 : targetIndex];
            setResultActiveKey(key);
        }

        setResultItems(newPanes);
    };

    const onResultEdit = (targetKey: any, action: 'add' | 'remove') => {
        if (action === 'add') {

            addResult();
        } else {
            removeResult(targetKey);
        }
    };

    const updateData = (value: any, error?: string, time?: string) => {
        setDataSource(value)
        setResultErrorMsg(error || "")
        setResultCountTime(time || '')
    }
    useImperativeHandle(ref, () => ({
        addSqlConsole: addSql,
        sqlConsoleItems: sqlItems,
        updateData: (value: any, error?: string, time?: string) => updateData(value, error, time),
        getFirstInitSqlValue: (value: string) => getFirstInitSqlValue(value)

    }))
    useEffect(() => {

        const newPanes = [...resultItems];
        let currentItem: any = []
        newPanes?.map((element: any, index: number) => {
            if (element?.key === resultActiveKey) {
                currentItem = [element?.key, index]
            }
        })
        const content = () => {
            return (
                {
                    label: '查询结果', children:
                        resultErrorMsg ? (<div>

                            <Card title={<><span>Error</span>
                                {resultErrorMsg === `你没有[${relayInfo?.tableCode}]表的查询权限` && <a onClick={() => {
                                    history.push({
                                        pathname: "/matrix/DBMS/authority-manage/authority-apply",
                                    }, {
                                        applyDetail: true,
                                        noPowerData: {
                                            ...relayInfo
                                        }
                                    })
                                }}>点击快速申请权限</a>}</>} size="small">
                                <p>{resultErrorMsg}<span></span></p>
                            </Card>

                        </div>) :
                            <div>
                                <p style={{ paddingLeft: 10, display: "flex", justifyContent: "space-between" }}>
                                    <span>查询时间：{`${resultCountTime} sec`} {!resultCountTime && <span style={{ marginLeft: 10, color: "rgb(39,93,124)", background: "#E1FFFF", padding: 5, borderRadius: 4 }}>请输入条件并点击<i><b>执行按钮</b></i>进行结果查询</span>}</span>
                                    <span>
                                        {dataSource?.length > 0 && exportAction()}

                                    </span>
                                </p>
                                <Table dataSource={dataSource}  pagination={{

                                    showTotal: () => `总共 ${dataSource?.length || 0} 条数据`,
                                }} loading={logsloading} bordered scroll={{ y:"calc(50vh - 190px) ",x: '100%'   }} >
                                    {dataSource?.length > 0 && (
                                        Object.keys(dataSource[0])?.map((item: any) => {
                                            return (
                                                <Table.Column title={item}   width={item&&item?.length<7?100:item&&item?.length>6?item?.length*10:100}  dataIndex={item} key={item} ellipsis  render={(value) => (
                                                    <Tooltip placement="topLeft" title={value}>
                                                       {value==="(null)"?<span style={{color:"#A9A9A9"}}>{value}</span>:<span>{value}</span>}
                                                    </Tooltip>
                                                  )} />
                                            )
                                        })

                                    )}
                                </Table>
                            </div>, key: currentItem[0], closable: false,
                }

            )
        }

        for (let i = 0, len = newPanes.length; i < len; i++) {
            if (newPanes[i].key === currentItem[0]) {
                newPanes[i] = content();
            }
        }

        setResultItems(newPanes)

        // }
    }, [dataSource, resultCountTime, resultErrorMsg])


    return (
        <>
            <div className="container-top">
                <div style={{ height: '100%' }}>
                    <Tabs
                        size="small"
                        hideAdd
                        onChange={onSqlChange}
                        activeKey={sqlConsoleActiveKey}
                        type="editable-card"
                        className="sql-console-tabs"
                        onEdit={onSqlEdit}
                        tabBarExtraContent={
                            <span className="add-btn" ><a><PlusCircleOutlined style={{ fontSize: 20 }} onClick={onAdd} /></a></span>}
                    >
                        {sqlItems?.map((item: any) => (
                            <TabPane tab={item.label} key={item.key} >
                                {item.children}
                            </TabPane>
                        ))}
                    </Tabs>
                </div>

            </div>
            <div className="container-bottom">
                <div style={{ paddingBottom: 38 }}>
                    <Tabs
                        size="small"
                        hideAdd
                        onChange={onResultChange}
                        activeKey={resultActiveKey}
                        type="editable-card"
                        className="query-result-tabs"
                        onEdit={onResultEdit}
                        // items={items}
                        tabBarExtraContent={
                            <div className="tabs-extra">
                                {resultActiveKey === "1" && <a onClick={() => {
                                    queryLogsList()
                                }}>刷新历史</a>}
                            </div>}
                    >
                        {resultItems?.map((item: any) => (
                            <TabPane tab={item?.label} key={item?.key} closable={item?.closable} >
                                {item?.children}
                            </TabPane>
                        ))}
                    </Tabs>
                </div>

            </div>

        </>
    )
})