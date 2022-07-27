import { eventTableSchema, podsTableSchema, envVarTableSchema } from '../schema';
import React, { useEffect, useCallback, useState, useMemo, useContext } from "react";
import { Table, Tag, Tooltip, Button, Empty, message, Spin } from 'antd'
import { history } from 'umi';
import DownLoadFile from './download-file';
import AddModal from './add-modal'
import './index.less';
import { getResourceList, resourceUpdate } from '../service';
import { LoadingOutlined, RedoOutlined } from '@ant-design/icons';
import clusterContext from '../context'

const obj: any = {
    namespace: '命名空间',
    image: '镜像',
    type: '资源类型',
    restart: '容器重启次数',
    fuben: '副本数',
    createTime: '创建时间'
}

export default function LoadDetail(props: any) {
    const { location, children } = props;
    const { type, kind, name, namespace } = location.query || {};
    const { clusterCode, cluseterName } = useContext(clusterContext);
    const [loading, setLoading] = useState<boolean>(false);
    const [visible, setVisible] = useState<boolean>(false);
    const [podData, setPodData] = useState([]);
    const [podLoading, setPodLoading] = useState<boolean>(false);
    const [eventData, setEventData] = useState([]);
    const [eventLoading, setEventLoading] = useState<boolean>(false);
    const [addTag, setAddTag] = useState<boolean>(false);//新增标签modal
    const [mode, setMode] = useState<string>('tag');
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
    const [subLoading, setSubLoading] = useState<boolean>(false);//-号loading
    const [addLoading, setAddLoading] = useState<boolean>(false);//+号loading
    const [count, setCount] = useState<number>(1)

    const [data, setData] = useState<any>({})
    useEffect(() => {
        queryData()
    }, [])

    useEffect(() => {
        if (clusterCode && data?.info) {
            queryEvent();
            queryPods()
        }
    }, [clusterCode, data])

    const restart = useMemo(() => podData.length ? podData.reduce((pre, cur: any) => pre + cur?.info?.restarts || 0, 0) : 0, [podData]);
    const containerOption = useMemo(() => (data?.info?.containersEnv || []).map((item: any) => ({ label: item?.containerName, value: item?.containerName })), [data?.info?.containersEnv])

    // 表格列配置
    const tableColumns = useMemo(() => {
        return podsTableSchema({
            toPodsDetail: (record: any, index: any) => {
                history.push({ pathname: '/matrix/pedestal/cluster-detail/pods', query: { ...location.query }, state: { pods: record?.info?.containers || [], containersEnv: data?.info?.container } })
            },
            viewLog: (record: any, index: any) => {
                history.push({ pathname: '/matrix/pedestal/view-log' })
            },
            shell: (record: any, index: any) => {
                history.push({ pathname: '/matrix/pedestal/cluster-detail/login-shell', state: { record: record } })
            },
            download: (record: any, index: any) => {
                setVisible(true)
            },
            handleDelete: (record: any, index: any) => {

            },
        }) as any;
    }, [podData]);
    const queryData = () => {
        getResourceList({ clusterCode, resourceName: name, resourceType: type, namespace: namespace }).then((res: any) => {
            if (res?.success) {
                const { items } = res?.data || [];
                if (items && items[0]) {
                    setData(items[0])
                }
            } else {
                setData({})
            }
        }).finally(() => { })
    }

    // 环境变量表格列配置
    const envVarColumns = useCallback((item: any) => {
        return envVarTableSchema({
            handleDelete: async (record: any, index: any) => {
                const info = JSON.parse(JSON.stringify(data?.info))
                info.containersEnv = info.containersEnv.map((e: any) => {
                    if (e.containerName === item.containerName) {
                        // return { ...e, env: e?.env?.filter((ele: any) => ele != record) }
                        e.env.splice(index, 1)
                        return { ...e }
                    } else {
                        return { ...e }
                    }
                })
                const res: any = await resourceUpdate({ resourceType: type, namespace: namespace, clusterCode, resourceName: name, updateBody: JSON.stringify(info) });
                if (res?.success) {
                    message.success('操作成功！');
                    queryData();
                }
            },
        }) as any;
    }, [data?.info?.containersEnv]);

    // 获取pods列表
    const queryPods = () => {
        setPodLoading(true)
        getResourceList({ clusterCode, resourceType: 'pods', namespace: namespace || '', labelSelector: data?.info?.labelSelector || '' }).then((res) => {
            if (res?.success) {
                setPodData(res?.data?.items || [])
            }
        }).finally(() => { setPodLoading(false) })
    }

    // 获取event列表
    const queryEvent = () => {
        setEventLoading(true)
        getResourceList({ clusterCode, resourceType: 'events', involvedObjectName: name, namespace: namespace || '', involvedObjectKind: kind || '' }).then((res) => {
            if (res?.success) {
                setEventData(res?.data?.items || [])
            }
        }).finally(() => { setEventLoading(false) })
    }
    // 新增标签/新增环境变量
    const onSave = async (params: any) => {
        const requstParams = JSON.parse(JSON.stringify(data?.info));
        const value = params['tags'];
        // 新增环境变量
        if (params.container) {
            for (const i of requstParams?.containersEnv) {
                if (params.container === i.containerName) {
                    requstParams?.containersEnv?.forEach((item: any) => {
                        if (params.container === item.containerName) {
                            item.env = item.env || []
                            value.forEach((e: any) => { item.env.push({ name: e.key, value: e.value }) })
                        }
                    })
                    // const nameList = i.env.map((ele: any) => ele.name)
                    // value.forEach((e: any) => {
                    //     if (nameList.includes(e.key)) {
                    //         message.error('存在重复的name！');
                    //         return false
                    //     }
                    //     i.env.push({
                    //         name: e.key, value: e.value
                    //     })
                    // })
                }
            }

        } else {
            // 新增标签
            requstParams.labels = requstParams?.labels || {};
            for (const item of value) {
                if (Object.keys(requstParams.labels).includes(item.key)) {
                    message.error('存在重复的key！');
                    return false
                }
                requstParams.labels[item.key] = item.value
            }
            // value.forEach((item: any) => {
            //     if (Object.keys(requstParams.labels).includes(item.key)) {
            //         message.error('存在重复的key！');
            //         return false
            //     }
            //     requstParams.labels[item.key] = item.value
            // })
        }
        setButtonLoading(true);
        const res: any = await resourceUpdate({ resourceType: type, namespace: namespace, clusterCode, resourceName: name, updateBody: JSON.stringify(requstParams) });
        if (res?.success) {
            message.success('操作成功！');
            queryData();
            setAddTag(false);
        }
        setButtonLoading(false)
    }
    // 点击+/-号
    const clickSign = async (sign: string) => {
        if (data?.info?.replicas === 0 && sign === 'sub') {
            message.error('该数值无法操作！');
            return;
        }
        sign === 'add' ? setAddLoading(true) : setSubLoading(true);
        const infoData = JSON.parse(JSON.stringify(data?.info))
        const { replicas } = infoData;
        infoData.replicas = sign === 'add' ? replicas + 1 : replicas - 1
        const res: any = await resourceUpdate({ resourceType: type, namespace: namespace, clusterCode, resourceName: name, updateBody: JSON.stringify(infoData) });
        if (res?.success) {
            message.success('操作成功！');
            queryData();
        }
        sign === 'add' ? setAddLoading(false) : setSubLoading(false);
    }
    // 删除标签
    const handleClose = async (tagName: any) => {
        const infoData = JSON.parse(JSON.stringify(data?.info))
        infoData.labels[tagName] = undefined;
        const res: any = await resourceUpdate({ resourceType: type, namespace: namespace, clusterCode, resourceName: name, updateBody: JSON.stringify(infoData) });
        if (res?.success) {
            message.success('操作成功！');
            queryData();
        }
    }

    return <div className='load-detail-wrapper'>
        <DownLoadFile visible={visible} onCancel={() => { setVisible(false) }} ></DownLoadFile>
        <AddModal visible={addTag} onCancel={() => { setAddTag(false) }} type={mode} onSave={onSave} containerOption={containerOption} loading={buttonLoading}></AddModal>
        <div className='flex-wrapper'>
            <p className="title">工作负载：<span style={{ color: 'green' }}>{data?.name || '---'}</span></p>
            <div>
                <Button icon={<RedoOutlined />} onClick={() => { queryData() }} style={{ marginRight: '10px' }} size='small'>
                    刷新
              </Button>
                <Button type="primary" size='small' onClick={() => { history.push({ pathname: `/matrix/pedestal/cluster-detail/resource-detail`, query: { ...props.location.query } }) }}>返回</Button>
            </div>
        </div>
        <div className='grid-wrapper'>
            {Object.keys(obj).map((item: any) => {
                if (item === 'fuben') {
                    return <div className='grid-wrapper-item'>
                        {/* // <Spin indicator={antIcon} /> */}
                        <Spin indicator={antIcon} spinning={subLoading}><a className='sign' style={{ color: '#e74848' }} onClick={() => { clickSign('sub') }}>-</a></Spin>
                        {obj[item]}：{data?.info?.availableReplicas || '0'}/{data?.info?.replicas || '0'}
                        <Spin indicator={antIcon} spinning={addLoading}><a className='sign' style={{ color: 'green' }} onClick={() => { clickSign('add') }}>+</a></Spin>
                    </div>
                } if (item === 'image') {
                    return <div className='grid-wrapper-item'>{obj[item]}：{
                        data?.info?.images?.length ?
                            <Tooltip placement="topLeft"
                                overlayStyle={{ maxWidth: 'unset' }}
                                overlayClassName="my-tooltip"
                                title={<div style={{ whiteSpace: 'nowrap' }}>{(data?.info?.images || []).map((item: string) => <div>{item}</div>)}</div>}>
                                {data?.info?.images[0]}
                                {data?.info?.images?.length > 1 ? '...' : ''}
                            </Tooltip> : '---'
                    }</div>
                } if (item === 'restart') {
                    return <div className='grid-wrapper-item'>{obj[item]}：{restart}</div>
                }
                else {
                    return <div className='grid-wrapper-item'>{obj[item]}：{data && data[item] ? data[item] : '---'}</div>
                }
            })}
        </div>
        {/* pods */}
        <p className='title'>Pods</p>
        <Table
            dataSource={podData}
            loading={podLoading}
            bordered
            rowKey="id"
            pagination={false}
            columns={tableColumns}
        ></Table>
        {/* 事件 */}
        <p className='title'>事件：</p>
        <div className='event-wrapper'>
            <Table
                dataSource={eventData}
                loading={eventLoading}
                bordered
                rowKey="id"
                pagination={false}
                columns={eventTableSchema()}
            ></Table>
        </div>
        {/* 标签管理 */}
        <div className='flex-wrapper' style={{ marginTop: '10px' }}>
            <span className='title'>标签</span>
            <Button type='primary' size='small' onClick={() => { setMode('tag'); setAddTag(true) }}>新增标签</Button>
        </div>
        <div className='tag-wrapper'>
            {Object.keys(data?.info?.labels || {}).map((item: string) => {
                return <Tag color="green" closable onClose={(e) => { e.preventDefault(); handleClose(item) }}>{item}:{data?.info?.labels[item]}</Tag>
            })}
        </div>
        <div className='flex-wrapper'>
            <span className='title'>环境变量</span>
            <Button type='primary' size='small' onClick={() => { setMode('var'); setAddTag(true) }}>新增环境变量</Button>
        </div>
        {/* 环境变量 */}
        {data?.info?.containersEnv && data?.info?.containersEnv.length ?
            <>
                {data?.info?.containersEnv.map((item: any) => (
                    <div className='var-table'>
                        <div style={{ marginBottom: '5px', fontSize: '12px' }}>当前容器：<Tag color='blue'>{item.containerName || '--'}</Tag></div>
                        <Table
                            dataSource={item?.env || []}
                            loading={loading}
                            bordered
                            pagination={false}
                            rowKey="id"
                            columns={envVarColumns(item)}
                        ></Table>
                    </div>
                ))}
            </> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />}
    </div>
}