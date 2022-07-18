import React, { useEffect, useRef, useState } from "react";
import { Form, Button, Input, Pagination, Select, Tabs, Empty } from "antd";
import type { PaginationProps } from 'antd';
import DetailContext from './context';
import PageContainer from '@/components/page-container';
import { FilterCard, ContentCard } from '@/components/vc-page-content';
import './index.less';
import { history, Link } from 'umi';
import { useClusterListData } from '../hook'
import VCPermission from '@/components/vc-permission';
const { TabPane } = Tabs;

const TabList = [
    { label: '节点列表', key: 'node-list' },
    { label: '资源详情', key: 'resource-detail' },
    { label: '资源统计', key: 'resource-statistics' },
    { label: '事件告警', key: 'event-warning' },
    { label: '任务管理', key: 'task-manage' }
]

const path = '/matrix/pedestal/cluster-detail'
const temp = [{ label: '集群1', value: 'code1' }, { label: '集群2', value: 'code2' },]
export default function Main(props: any) {
    const { location, children } = props;
    const { clusterCode, clusterName } = location.query || {};
    const { clusterInfo } = location?.state || {};
    const [visible, setVisble] = useState(false);
    const [clusterOption, setClusterOption] = useState(temp);
    const [selectCluster, setSelectCluster] = useState<any>({ key: '', label: '' });
    const [activeTab, setActiveTab] = useState<string>(location?.query?.key || 'node-list')
    const [data, total] = useClusterListData({ pageSize: -1, pageIndex: -1 });
    useEffect(() => {
        if (data.length) {
        }
    }, [data])

    useEffect(() => {
        if (location.query) {
            const { clusterCode, clusterName } = location.query || {};
            if (clusterCode) {
                setSelectCluster({ label: clusterName, key: clusterCode })
            }
        }
    }, [location.query])

    if (!clusterCode) {
        return (
            <PageContainer>
                <div className="block-empty">
                    <Empty
                        description={
                            <span>
                                未找到集群，返回 <Link to="/matrix/pedestal/cluster-info">集群概览</Link>
                            </span>
                        }
                    />
                </div>
            </PageContainer>
        );
    }

    const selectChange = (v: any) => {
        setSelectCluster(v);
        history.push({ query: { ...props.location.query, clusterCode: v.value, clusterName: v.label } });
    }

    return (
        <PageContainer className='cluster-main'>
            <ContentCard>
                <div className='search-wrapper'>
                    <div> 选择集群：<Select style={{ width: 200 }} size='small' value={selectCluster} onChange={selectChange} options={clusterOption} labelInValue></Select></div>
                    <div>
                        <span style={{ fontWeight: '600', fontSize: '16px', marginRight: '10px' }}>{clusterCode || '---'}</span>
                        <span style={{ color: '#776e6e', fontSize: '13px' }}>{clusterName || '---'}</span>
                    </div>
                </div>

                <Tabs
                    activeKey={activeTab}
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
                <DetailContext.Provider value={{ clusterCode, clusterName }}>
                    <VCPermission code={window.location.pathname} isShowErrorPage>
                        {children}
                    </VCPermission>
                </DetailContext.Provider>
            </ContentCard>
        </PageContainer>
    );
}
