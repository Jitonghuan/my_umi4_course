import React, { useContext, useState, useEffect, useMemo } from 'react';
import { Modal, Table, Space, Tooltip, Tag, Button, message } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import AceEditor from '@/components/ace-editor';
import { downloadSource } from '@/pages/application/service';
import moment from 'moment';
import { history } from 'umi';
import { debounce } from 'lodash';
import detailContext from '../../context';
import './index.less'
interface Iprops {
    activeTab: string;
    detailInfo: any;
    infoLoading: boolean;
    count: number
    originData: any
    dataSource: any
    setDataSource: any
    releaseVersion?: any
}

export default function ModifyApp(props: Iprops) {
    const { activeTab, detailInfo, infoLoading, count, dataSource, originData, setDataSource, releaseVersion } = props;
    const { categoryCode, releaseId, categoryName } = useContext(detailContext);
    const [mode, setMode] = useState<string>('hide');
    const [curRecord, setCurRecord] = useState<any>({});
    const [modalData, setModalData] = useState<any>([]);
    const filter = debounce((value) => filterData(value), 500)

    const filterData = (value: string) => {
        if (!value) {
            setDataSource(originData);
            return;
        }
        const data = JSON.parse(JSON.stringify(originData));
        const afterFilter: any = [];
        data?.forEach((item: any) => {
            if (item.appCode?.indexOf(value) !== -1) {
                afterFilter.push(item);
            }
        });

        setDataSource(afterFilter);
    }
    const mapDo = (params: any) => {
        let data: any = []
        if (typeof (params) === "object" && Object.keys(params)?.length > 0) {
            for (const key in params) {
                if (Object.prototype.hasOwnProperty.call(params, key)) {
                    const element = params[key];
                    data.push({
                        label: key,
                        value: element
                    })

                }
            }

        }
        setModalData(data)

    }
    // const getDataSource = () => {
    //     setLoading(true)
    //     releaseAppRel({ releaseId }).then((res) => {
    //         if (res?.success) {
    //             let data: any = [];
    //             (res?.data)?.map((ele: any) => {
    //                 data.push({
    //                     ...ele,
    //                     configInfo: Object.keys(ele?.config)?.length,
    //                     sqlInfo: Object.keys(ele?.sql)?.length,
    //                     relationDemandsInfo: ele?.relationDemands?.length,

    //                 })

    //             })
    //             setDataSource(data)
    //             setOriginData(data)

    //         } else {
    //             setDataSource([])
    //             setOriginData([])

    //         }

    //     }).finally(() => {
    //         setLoading(false)

    //     })
    // }



    const frontTotal = useMemo(() => (dataSource || []).filter((item: any) => item.appType !== 'backend').length, [JSON.stringify(dataSource)])
    const backendTotal = useMemo(() => (dataSource || []).filter((item: any) => item.appType === 'backend').length, [JSON.stringify(dataSource)])


    const columns = [
        {
            title: '应用CODE',
            dataIndex: 'appCode',
            width: 120,
            render: (value: string) => <a onClick={() => {
                history.push({
                    pathname: "/matrix/application/detail/overview",
                    search: `appCode=${value}`

                })
            }}>{value}</a>
        },
        {
            title: '应用类型',
            dataIndex: 'appType',
            width: 80,
            render: (value: string) => <span>{value === 'backend' ? '后端' : '前端'}</span>
        },
        {
            title: '变更内容',
            dataIndex: 'relationDemandsInfo',
            width: 100,
            render: (value: any, record: any) => <a onClick={() => {
                clickRow('content', record)
            }}>{value}</a>
        },
        {
            title: '变更配置',
            dataIndex: 'configInfo',
            width: 100,
            render: (value: string, record: any) => <a onClick={() => {
                clickRow('config', record)
                mapDo(record?.config)
            }}>{value}</a>
        },
        {
            title: '变更SQL',
            dataIndex: 'sqlInfo',
            width: 100,
            render: (value: string, record: any) => <a onClick={() => {
                clickRow('sql', record)
                mapDo(record?.sql)
            }}>{value}</a>
        },
        {
            title: '应用版本状态',
            dataIndex: 'appStatus',
            width: 130,
            render: (value: string, record: any) => <span style={{ color: value === "内容开发" ? "#209EA5" : value === "出包完成" ? "#58A55C" : "gray" }}>
                {value}
                {value === '出包完成' &&
                    <Button
                        download
                        target="_blank"
                        size="small"
                        style={{ marginLeft: 5, fontSize: 13 }}
                        href={`${downloadSource}?id=${record?.deployId[releaseVersion]}&envCode=release-env`}
                        // disabled={downLoadStatus}
                        onClick={() => {
                            message.info('开始下载');
                        }}
                    >
                        下载
                </Button>}
            </span>
        },
        {
            title: '版本Tag',
            dataIndex: 'tag',
            width: 120,
        },
        {
            title: '出包时间',
            dataIndex: 'publishTime',
            width: 120,
            render: (value: string) => <span>{value ? moment(value).format("YYYY-MM-DD HH:mm:ss") : '--'}</span>
        },
        {
            title: '出包人',
            dataIndex: 'publishUser',
            width: 120,
        },
    ]

    const modalColumns = [
        {
            title: 'ID',
            dataIndex: 'entryCode',
            width: 160,
            render: (value: string, record: any) => <a href={record?.url} target="_blank">{value}</a>
        },
        {
            title: '类型',
            dataIndex: 'relatedPlat',
            width: 120,
            render: (value: string) => <span><Tag color={value === 'demandPlat' ? 'green' : 'blue'}>{value === 'demandPlat' ? '需求' : 'bug'}</Tag></span>


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
            render: (value: string, record: any) => <span>
                {record?.branchInfos?.map((ele: any) => {
                    return <p>{ele?.branchName}</p>

                })}

            </span>
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
                        <span>应用总数：{dataSource?.length}</span>
                        <span>前端应用：{frontTotal}</span>
                        <span>后端应用：{backendTotal}</span>
                    </Space>
                    <div>
                        <Tooltip title='请输入应用CODE进行搜索' placement="top">
                            <QuestionCircleOutlined style={{ marginLeft: '5px' }} />
                        </Tooltip>
                        查询：
                        <input
                            style={{ width: 200 }}
                            placeholder='输入内容进行查询过滤'
                            className="ant-input ant-input-sm"
                            onChange={(e) => {
                                filter(e.target.value)
                            }}
                        ></input>
                    </div>
                </div>
            </div>
            <Table
                dataSource={dataSource}
                loading={infoLoading}
                bordered
                rowKey="id"
                pagination={false}
                columns={columns}
            ></Table>

            <Modal
                visible={mode !== 'hide'}
                title={<div className="modal-title">
                    <span>{curRecord?.appCode}</span>
                    {mode === 'content' &&
                        <span>
                            <Space>
                                <span>当前版本：<span><Tag color="green">{detailInfo?.releaseNumber}</Tag></span></span>
                                <span className='black-text'>{categoryCode || '---'}</span>
                                <span className='grey-text'>{categoryName || '---'}</span>
                            </Space>
                        </span>
                    }
                </div>}
                onCancel={() => { setMode('hide') }}
                width={900}
                footer={null}
                destroyOnClose
            >
                <div className='modify-app-modal'>
                    {mode === 'content' &&
                        <Table
                            dataSource={curRecord?.relationDemands || []}
                            // loading={loading || updateLoading}
                            bordered
                            rowKey="id"
                            pagination={false}
                            columns={modalColumns}
                        ></Table>}
                    {mode === 'config' &&
                        <div className="config-content">
                            {modalData?.map((item: any) => {
                                return (
                                    <div>
                                        <p className="version-title-content"><label>版本号：</label><Tag color="cyan">{item?.label}</Tag></p>
                                        <div>
                                            <AceEditor mode="yaml" defaultValue={item?.value} height={200} readOnly />

                                        </div>

                                    </div>
                                )

                            })}
                        </div>


                    }
                    {mode === 'sql' &&
                        <div className="sql-content">
                            {modalData?.map((item: any) => {
                                return (
                                    <div>
                                        <p className="version-title-content"><label>版本号：</label><Tag color="cyan">{item?.label}</Tag></p>
                                        <div>
                                            <AceEditor mode="sql" defaultValue={item?.value} height={200} readOnly />

                                        </div>

                                    </div>
                                )

                            })}
                        </div>}
                </div>
            </Modal>
        </>
    )
}