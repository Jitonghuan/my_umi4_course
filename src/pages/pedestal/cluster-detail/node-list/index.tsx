import React, { useEffect, useRef, useState, useContext, useMemo } from "react";
import { Form, Button, Table, message } from "antd";
import clusterContext from '../context'
import { nodeListTableSchema } from '../schema';
import { RedoOutlined } from '@ant-design/icons';
import { useNodeListData } from '../hook'
import { history } from 'umi'
import { nodeDrain, nodeUpdate, getNode } from '../service';
import AddNode from './add-node'
import SetTag from './set-tag'
import './index.less'
export default function NodeList() {
    const [visible, setVisble] = useState(false);
    const { clusterCode, cluseterName } = useContext(clusterContext);
    const [tagVisible, setTagVisible] = useState(false);
    const [cluster, setCluster] = useState({}) as any;
    const [dataSource, setDataSource] = useState([]);
    const [pageSize, setPageSize] = useState<number>(10);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [initData, setInitData] = useState<any>({});
    const [updateLoading, setUpdateLoading] = useState(false);
    const [baseData, total, loading, loadData] = useNodeListData({ clusterCode: clusterCode || '' });//表格的基础数据
    const [data, setData] = useState<any>([]);//表格的完整数据

    useEffect(() => {
        if (baseData && baseData.length) {
            setData(baseData);
            getNode({ clusterCode: clusterCode || '', needMetric: true }).then((res: any) => {
                if (res?.success) {
                    const { items } = res?.data || {};
                    setData(items || []);
                }
            })
        }
    }, [baseData])

    const tableColumns = useMemo(() => {
        return nodeListTableSchema({
            shell: (record: any, index: any) => {
                history.push({ pathname: '/matrix/pedestal/login-shell', query: { key: 'node-list', type: 'node', name: record.nodeName, clusterCode } })
            },
            // 设置标签
            clickTag: (record: any, index: any) => {
                const c = {
                    taints: record.taints || [],
                    labels: Object.keys(record.labels || {}).map(k => ({ key: k, value: record.labels[k] }))
                };
                setInitData(record);
                setCluster(c);
                setTagVisible(true);
            },
            // 调度
            updateNode: (record: any, index: any) => {
                setUpdateLoading(true)
                nodeUpdate({ unschedulable: !record.unschedulable, clusterCode, nodeName: record.nodeName, labels: record.labels, taints: record.taints }).then((res: any) => {
                    if (res?.success) {
                        message.success('操作成功');
                        loadData();
                    }
                }).finally(() => { setUpdateLoading(false) })
            },
            // 排空
            drain: (record: any, index: any) => {
                setUpdateLoading(true)
                nodeDrain({ nodeName: record.nodeName, clusterCode: clusterCode }).then((res: any) => {
                    if (res?.success) {
                        message.success('操作成功');
                        loadData();
                    }
                }).finally(() => { setUpdateLoading(false) })
            },
            // 删除
            // handleDelete: async (record: any, index: any) => {
            //     const res = await delRequest(`${appConfig.apiPrefix}/infraManage/node/delete/${record?.nodeName}`);
            //     if (res?.success) {
            //         loadData();
            //     }
            // },
        }) as any;
    }, [data]);

    return (
        <div className='cluster-node-list'>
            <AddNode visible={visible} onClose={() => { setVisble(false) }} onSubmit={() => { setVisble(false); loadData() }}></AddNode>
            <SetTag visible={tagVisible}
                onSubmit={(tag: any, data: any) => {
                    setTagVisible(false)
                    loadData()
                }}
                onCancel={() => { setTagVisible(false) }}
                dirtyTags={cluster.taints}
                baseTags={cluster.labels}
                initData={initData}
            ></SetTag>
            <div className='flex-space-between' >

                <h3>节点列表</h3>
                <Button icon={<RedoOutlined />} onClick={() => { loadData() }} style={{ marginRight: '10px' }} size='small'>
                    刷新</Button>
                {/* <div className="caption-right">
                    <Button type="primary" onClick={() => { setVisble(true) }}>新增节点</Button>
                </div> */}
            </div>
            <Table
                dataSource={data}
                loading={loading || updateLoading}
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
                columns={tableColumns}
                scroll={{ x: '100vw' }}
            ></Table>

        </div>
    );
}
