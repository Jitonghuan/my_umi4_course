import React, { useEffect, useRef, useState } from "react";
import { Form, Button, Input, Pagination, Select, Tabs, Empty } from "antd";
import type { PaginationProps } from 'antd';
import clusterContext from './context';
import PageContainer from '@/components/page-container';
import { FilterCard, ContentCard } from '@/components/vc-page-content';
import './index.less';
import { history, Link } from 'umi';
import { useClusterListData } from '../cluster-info/hook'
import VCPermission from '@/components/vc-permission';
const { TabPane } = Tabs;

const TabList = [
    { label: '节点列表', key: 'node-list' },
    { label: '资源详情', key: 'resource-detail' },
    // { label: '资源统计', key: 'resource-statistics' },
    // { label: '事件告警', key: 'event-warning' },
    // { label: '任务管理', key: 'task-manage' }
]

const path = '/matrix/pedestal/cluster-detail'
// /pedestal/cluster-detail/node-list
const temp = [{ label: '集群1', value: 'code1' }, { label: '集群2', value: 'code2' },]
export default function ClusterDetail(props: any) {
    const { location, children } = props;
    const { clusterCode, clusterName } = location.query || {};
    const [visible, setVisble] = useState(false);
    const [clusterOption, setClusterOption] = useState<any>([]);
    const [selectCluster, setSelectCluster] = useState<any>({ value: clusterCode || '', label: clusterName || '' });
    const [activeTab, setActiveTab] = useState<string>(location?.query?.key || 'node-list')
    const [data, total] = useClusterListData({ pageSize: -1, pageIndex: -1 });
    // // 默认重定向到节点列表路由下
    // if (location.pathname === path) {
    //     return (
    //         history.replace({
    //             pathname: `${location.pathname}/node-list`,
    //             query: { key: 'node-list' },
    //         }),
    //         null
    //     );
    // }
    useEffect(() => {
        if (data && data.length) {
            const res = data.map((item: any) => ({ value: item.clusterCode, label: item.clusterName }))
            setClusterOption(res)
        }
    }, [data])

    useEffect(() => {
        console.log(111)
    }, [])

    useEffect(() => {
        setActiveTab(location?.query?.key || 'node-list')
        history.push({ query: { ...props.location.query, clusterCode: selectCluster?.value, clusterName: selectCluster?.label } });
    }, [location?.pathname])

    useEffect(() => {
        if (!clusterCode) {
            setSelectCluster(clusterOption && clusterOption[0])
        }
    }, [clusterOption])

    useEffect(() => {
        history.push({ query: { ...props.location.query, clusterCode: selectCluster?.value, clusterName: selectCluster?.label } });
    }, [selectCluster])

    const selectChange = (v: any) => {
        setSelectCluster({ label: v.label, value: v.value });
    }

    return (
        <PageContainer className='cluster-main'>
            <ContentCard>
                <div className='search-wrapper'>
                    <div> 选择集群：<Select style={{ width: 200 }} size='small' value={selectCluster} onChange={selectChange} options={clusterOption} labelInValue></Select></div>
                    <div>
                        <span style={{ fontWeight: '600', fontSize: '16px', marginRight: '10px' }}>{selectCluster?.value || '---'}</span>
                        <span style={{ color: '#776e6e', fontSize: '13px' }}>{selectCluster?.label || '---'}</span>
                    </div>
                </div>

                <Tabs
                    activeKey={activeTab}
                    // type='card'
                    onChange={(key) => {
                        setActiveTab(key);
                        history.replace({
                            pathname: `/matrix/pedestal/cluster-detail/${key}`,
                            query: { clusterName, clusterCode, key: key, },
                        });
                    }}
                >
                    {TabList.map((item: any) => (
                        <TabPane tab={item.label} key={item.key} />
                    ))}
                </Tabs>
                <clusterContext.Provider value={{ clusterCode: selectCluster?.value || '', clusterName: selectCluster?.label || '' }}>
                    <VCPermission code={window.location.pathname} isShowErrorPage>
                        {selectCluster?.value ? children : <div className='tip-wrapper'>请先选择集群</div>}
                    </VCPermission>
                </clusterContext.Provider>
            </ContentCard>
        </PageContainer>
    );
}
