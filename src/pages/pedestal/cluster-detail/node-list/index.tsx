import React, { useEffect, useRef, useState, useContext, useMemo } from "react";
import { Form, Button, Input, Pagination, Table, message } from "antd";
import { delRequest } from '@/utils/request';
import appConfig from '@/app.config';
import PageContainer from '@/components/page-container';
import clusterContext from '../context'
import { FilterCard, ContentCard } from '@/components/vc-page-content';
import { nodeListTableSchema } from '../schema';
import { useNodeListData } from '../hook'
import { history } from 'umi'
import { nodeDrain, nodeUpdate } from '../service'
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
    const [data, total, loading, loadData] = useNodeListData({ pageSize, pageIndex, clusterCode: clusterCode || '' });

    const tableColumns = useMemo(() => {
        return nodeListTableSchema({
            shell: (record: any, index: any) => {
                history.push({ pathname: '/matrix/pedestal/login-shell' })
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
            updateNode: async (record: any, index: any) => {
                const res = await nodeUpdate({ unschedulable: !record.unschedulable })
                if (res?.success) {
                    message.success('操作成功');
                    loadData();
                }
            },
            // 排空
            drain: async (record: any, index: any) => {
                // const res = await nodeDrain({ nodeName: record.nodeName, clusterCode: clusterCode || '' })
                // if (res?.success) {
                //     message.success('操作成功');
                //     loadData();
                // }
            },
            // 删除
            handleDelete: async (record: any, index: any) => {
                const res = await delRequest(`${appConfig.apiPrefix}/infraManage/node/delete/${record?.nodeName}`);
                if (res?.success) {
                    loadData();
                }
            },
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
            <div className="table-caption" >
                <div className="caption-left">
                    <h3>节点列表</h3>
                </div>
                <div className="caption-right">
                    <Button type="primary" onClick={() => { setVisble(true) }}>新增节点</Button>
                </div>
            </div>
            <Table
                dataSource={data}
                loading={loading}
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
