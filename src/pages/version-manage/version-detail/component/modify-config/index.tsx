import React, { useState, useEffect, useMemo } from 'react';
import { Space, Tooltip, Spin, Tag, Input, Button } from 'antd';
import { QuestionCircleOutlined, EditOutlined, EditFilled } from '@ant-design/icons';
import AceEditor from '@/components/ace-editor';
import EditModal from '../edit-config-sql';
import { debounce } from 'lodash';
interface Iprops {
    dataSource: any;
    originData: any;
    infoLoading: boolean
    setDataSource: any;
    configSqlData?: any;
    onSave?: any;
    releaseId?: any
}


export default function ModifyConfig(props: Iprops) {
    const { dataSource, originData, infoLoading, setDataSource, configSqlData = [], onSave, releaseId } = props;
    const [pageTotal, setPageTotal] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(2);
    // const [total, setTotal] = useState<number>(0)
    const [modalData, setModalData] = useState<any>([]);
    const filter = debounce((value) => filterData(value), 800);
    const [configData, setConfigData] = useState<any>([]);
    const [finalData, setFinalData] = useState<any>([]);
    const [type, setType] = useState<any>('');
    const [initData, setInitData] = useState<any>({});

    useEffect(() => {
        const res = modalData.concat(configData)
        console.log(res, 'res')
        setFinalData(res);
    }, [modalData, configData])

    const total = useMemo(() => finalData.length, [finalData])

    const filterData = (value: string) => {
        const res = modalData.concat(configData)
        if (!value) {
            setFinalData(res);
            return;
        }
        try {
            const data = JSON.parse(JSON.stringify(finalData));
            const afterFilter: any = [];
            data?.forEach((item: any) => {
                if (item.appCode?.indexOf(value) !== -1) {
                    afterFilter.push(item);
                }
            });
            setFinalData(afterFilter);
        } catch (error) {

        }

    }

    useEffect(() => {
        if (dataSource?.length > 0) {
            let sum = 0
            let data: any = []
            dataSource?.map((item: any) => {
                sum = sum + item?.configInfo;
                if (Object.keys(item?.config)?.length > 0) {

                    for (const key in item?.config) {
                        if (Object.prototype.hasOwnProperty.call(item?.config, key)) {
                            const element = item?.config[key];
                            data.push({
                                label: key,
                                value: element,
                                appCode: item?.appCode
                            })
                        }
                    }
                }
            })
            // setTotal(sum)
            setPageTotal(sum)
            setModalData(data)
        } else {
            // setTotal(0)
            setModalData([])
            setPageTotal(0)
        }
    }, [JSON.stringify(dataSource)])

    useEffect(() => {
        if (configSqlData?.length) {
            let data: any = [];
            configSqlData.map((item: any) => {
                data.push({
                    label: item.releaseNumber,
                    value: item.config,
                    appCode: item?.appCode
                })
            })
            setConfigData(data)
        } else {
            setConfigData([])
        }
    }, [configSqlData])


    return (
        <>
            <EditModal
                type={type}
                onClose={() => { setType('') }}
                initData={initData}
                onSave={onSave}
                releaseId={releaseId}
            />
            <div className='content-top'>
                <div className='flex-space-between'>
                    <Space>
                        <span>配置总数：{total}</span>
                    </Space>
                    <div>
                        <Tooltip title='请根据应用CODE或版本号进行搜索 ' placement="top">
                            <QuestionCircleOutlined style={{ marginLeft: '5px' }} />
                        </Tooltip>
                        搜索：
                        <Input
                            style={{ width: 220 }}
                            placeholder='输入应用code进行查询'
                            className="ant-input ant-input-sm"
                            onChange={(e: any) => {
                                filter(e.target.value)

                            }}
                        />
                    </div>
                </div>
            </div>
            <div className="sql-content">
                <Spin spinning={infoLoading}>
                    {finalData?.map((item: any) => {
                        return (
                            <div style={{ marginTop: 10 }}>
                                <p className="version-title-content flex-space-between">
                                    <Space size="large">

                                        <span><label>版本号：</label><Tag color="cyan">{item?.label}</Tag></span>
                                        <span> <label>应用CODE：</label><Tag color="green">{item?.appCode}</Tag></span>

                                    </Space>
                                    <Space>
                                        <EditFilled onClick={() => { setInitData(item); setType('config'); }} style={{ color: '#3591ff' }} />
                                    </Space>
                                </p>
                                <div>
                                    <AceEditor mode="yaml" value={item?.value} height={200} readOnly />

                                </div>
                            </div>
                        )

                    })}

                </Spin>

            </div>
        </>
    )
}