import React, { useState, useEffect, useMemo } from 'react';
import { Space, Tooltip, Spin, Tag } from 'antd';
import { QuestionCircleOutlined, EditOutlined } from '@ant-design/icons';
import AceEditor from '@/components/ace-editor';
import { debounce } from 'lodash';
import EditModal from '../edit-config-sql';
import './index.less'
interface Iprops {
    dataSource: any;
    originData: any;
    infoLoading: boolean
    setDataSource: any;
    configSqlData?: any;
    onSave?: any;
    releaseId?: any
}

export default function ModifySql(props: Iprops) {
    const { dataSource, originData, infoLoading, setDataSource, configSqlData = [], onSave, releaseId } = props;
    // const [total, setTotal] = useState<number>(0)
    const [modalData, setModalData] = useState<any>([]);
    const filter = debounce((value) => filterData(value), 500)
    const [sqlData, setSqlData] = useState<any>([]);
    const [finalData, setFinalData] = useState<any>([]);
    const [type, setType] = useState<any>('');
    const [initData, setInitData] = useState<any>({});

    useEffect(() => {
        const res = modalData.concat(sqlData)
        setFinalData(res);
    }, [modalData, sqlData])

    const total = useMemo(() => finalData.length, [finalData])

    const filterData = (value: string) => {
        const res = modalData.concat(sqlData);
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
                sum = sum + item?.sqlInfo;
                if (Object.keys(item?.sql)?.length > 0) {

                    for (const key in item?.sql) {
                        if (Object.prototype.hasOwnProperty.call(item?.sql, key)) {
                            const element = item?.sql[key];
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
            setModalData(data)



        } else {
            // setTotal(0)
            setModalData([])

        }


    }, [JSON.stringify(dataSource)])


    useEffect(() => {
        if (configSqlData?.length) {
            let data: any = [];
            configSqlData.map((item: any) => {
                data.push({
                    label: item.releaseNumber,
                    value: item.sql,
                    appCode: item?.appCode
                })
            })
            setSqlData(data)
        } else {
            setSqlData([])
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
                        <span>SQL总数：{total || 0}</span>
                    </Space>
                    <div>
                        <Tooltip title='请根据应用CODE或版本号进行搜索 ' placement="top">
                            <QuestionCircleOutlined style={{ marginLeft: '5px' }} />
                        </Tooltip>
                        搜索：
                        <input
                            style={{ width: 200 }}
                            placeholder='输入应用code进行查询'
                            className="ant-input ant-input-sm"
                            onChange={(e) => {
                                filter(e.target.value)
                            }}
                        ></input>
                    </div>
                </div>
            </div>

            <div className="sql-content">
                <Spin spinning={infoLoading}>
                    {(finalData || [])?.map((item: any) => {
                        return (
                            <div style={{ marginTop: 10 }}>
                                <p className="version-title-content flex-space-between">
                                    <Space size="large">
                                        <span> <span>版本号：</span><Tag color="cyan">{item?.label}</Tag></span>
                                        <span> <span>应用CODE：</span><Tag color="green">{item?.appCode}</Tag></span>

                                    </Space>
                                    <Space>
                                        <EditOutlined onClick={() => { setInitData(item); setType('sql'); }} style={{ color: '#3591ff' }} />
                                    </Space>

                                </p>
                                <div>
                                    <AceEditor mode="sql" value={item?.value} height={200} readOnly />

                                </div>

                            </div>
                        )

                    })}

                </Spin>

            </div>
            {/* </div> */}
            {/* <Table
                dataSource={[]}
                // loading={loading || updateLoading}
                bordered
                rowKey="id"
                // pagination={{
                //     pageSize: pageSize,
                //     total: total,
                //     current: pageIndex,
                //     showSizeChanger: true,
                //     onShowSizeChange: (_, next) => {
                //         setPageIndex(1);
                //         setPageSize(next);
                //     },
                //     onChange: (next) => {
                //         setPageIndex(next)
                //     }
                // }}
                pagination={false}
                columns={columns}
            ></Table> */}
        </>
    )
}