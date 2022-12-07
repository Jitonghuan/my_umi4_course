import React, { useEffect, useState, useContext, useMemo, forwardRef,} from 'react';
import { Tag, Button, Table, Space, Tooltip, Popconfirm, message, Spin } from 'antd';
import { QuestionCircleOutlined, CloseCircleFilled } from '@ant-design/icons';
import RealteDemandBug from './relate-demand-bug';
import detailContext from '../../context';
import { debounce } from 'lodash';
import { releaseDemandRel, deleteDemand, updateRelease } from '../../../service';
import { demandStatusTypes } from './type'
import { UpdateItems } from '../../../type'

interface Iprops {
    activeTab: string;
    detailInfo: any
    onReload: any;
    infoLoading: boolean
    count:number


}
export default forwardRef(function ContentList(props: Iprops) {
    const { activeTab, detailInfo, onReload, infoLoading,count } = props;
    const [type, setType] = useState<string>('hide');
    const { categoryCode, releaseId } = useContext(detailContext);
    const [dataSource, setDataSource] = useState<any>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [originData, setOriginData] = useState<any>([]);
    const filter = debounce((value) => filterData(value), 500)
    const demandTotal = useMemo(() => (dataSource || []).filter((item: any) => item.relatedPlat === 'demandPlat')?.length, [JSON.stringify(dataSource)])
    const bugTotal = useMemo(() => (dataSource || []).filter((item: any) => item.relatedPlat !== 'demandPlat')?.length, [JSON.stringify(dataSource)])

    const filterData = (value: string) => {
        if (!value) {
            setDataSource(originData);
            return;
        }
        try {
            const data = JSON.parse(JSON.stringify(dataSource));
            const afterFilter: any = [];
            data?.forEach((item: any) => {
                if (item.title?.indexOf(value) !== -1) {
                    afterFilter.push(item);
                }
                if(item?.entryCode?.indexOf(value) !== -1){
                    afterFilter.push(item);
    
                }
            });
    
            setDataSource(afterFilter);
            
        } catch (error) {
            
        }
       
    }
    const getDataSource = () => {
        setLoading(true)
        releaseDemandRel({ releaseId }).then((res) => {
            if (res?.success) {
                setDataSource(res?.data)
                setOriginData(res?.data)
            }else{
                setDataSource([])
                setOriginData([])

            }
        }).finally(() => {
            setLoading(false)
        })
    }
    useEffect(() => {
        if(releaseId){
            getDataSource()

        }else{
            setDataSource([])
            setOriginData([])

        }
       

    }, [releaseId, activeTab,categoryCode,count])


    const columns: any = [
        {
            title: 'ID',
            dataIndex: 'entryCode',
            width: 160,
            render: (value: string, record: any) =>
                <a onClick={() => {
                    if (record?.url) { window.open(record.url, '_blank') }
                }}>{value}</a>
        },
        {
            title: '标题',
            dataIndex: 'title',
            width: 200,
        },
        {
            title: '类型',
            dataIndex: 'relatedPlat',
            width: 80,
            render: (value: string) => <span><Tag color={value === 'demandPlat' ? 'green' : 'blue'}>{value === 'demandPlat' ? '需求' : 'bug'}</Tag></span>
        },
        {
            title: '版本需求状态',
            dataIndex: 'demandStatus',
            width: 120,
            render: (value: string) => <span style={{ color: demandStatusTypes[value]?.color || "gray" }}>

                {value}</span>
        },
        {
            title: '关联应用',
            dataIndex: 'relationApps',
            width: 300,
            render: (value: any, record: any) => <div>{value?.map((item: any) => <Tag> <span style={{ color: '#4169E1' }}>{item?.appCode} </span> <span style={{ color: item.appStatus === '未出包' ? 'gray' : 'green' }}>{item?.appStatus}</span> </Tag>)}</div>
        },
        {
            title: '操作',
            fixed: 'right',
            width: 40,
            align: 'center',
            render: (_: any, record: any, index: number) => (
                <div className="action-cell">
                    <Popconfirm
                        title="确定要移除吗？"
                        onConfirm={() => {
                            handleDelete(record.id);
                        }}
                    >
                        <a>
                            <CloseCircleFilled style={{ color: '#d10a0a', fontSize: 18 }} />
                        </a>
                    </Popconfirm>
                </div>
            ),
        },
    ]

    const handleDelete = async (id: any) => {
        const res = await deleteDemand({ ids: [id] })
        if (res?.success) {
            //onSave();
            onReload()
            getDataSource()
        }
    }
    const [lockLoading, setLockLoading] = useState<boolean>(false)
    const updateReleaseAction = (params: UpdateItems) => {
        setLockLoading(true)
        updateRelease({ ...params }).then((res) => {
            if (res?.success) {
                message.success("操作成功！")
                getDataSource()
                onReload()



            }

        }).finally(() => {
            setLockLoading(
                false
            )

        })

    }

    return (
        <>
            <RealteDemandBug type={type} onClose={() => { setType('hide') }} releaseId={releaseId} onSave={() => {
                 onReload()
                 getDataSource()

            }} />
            <div className='table-top'>
                <div className='flex-space-between'>
                    <Space>
                        <span>内容总数：{dataSource?.length}</span>
                        <span>需求：{demandTotal}</span>
                        <span>bug：{bugTotal}</span>
                    </Space>
                    <div>
                        <Tooltip title='请根据ID或标题进行搜索 ' placement="top">
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
                bordered
                rowKey="id"
                loading={loading}
                pagination={false}
                columns={columns}
            ></Table>
            <div className='flex-end'>
                <Spin spinning={infoLoading}>
                    <Space>


                        <Button type='primary' disabled={detailInfo?.locked === 1} onClick={() => { setType('demand') }}>
                            关联需求
                        </Button>
                        <Button type='primary' disabled={detailInfo?.locked === 1} onClick={() => { setType('bug') }}>
                            关联bug
                         </Button>



                        {detailInfo?.locked === 1 ? <Button type='primary' loading={lockLoading} onClick={() => {
                            updateReleaseAction({ ...detailInfo, locked: 0 })
                        }}>
                            解除锁定
                       </Button> : <Button type='primary' loading={lockLoading} onClick={() => {
                            updateReleaseAction({ ...detailInfo, locked: 1 })
                        }}>
                            锁定需求
                     </Button>}

                    </Space>

                </Spin>

            </div>
        </>
    )
})