import React, { useEffect, useRef, useState } from "react";
import { Form, Button, Input, Pagination, Select, Tabs } from "antd";
import type { PaginationProps } from 'antd';
import DetailContext from './context';
import PageContainer from '@/components/page-container';
import { FilterCard, ContentCard } from '@/components/vc-page-content';
import './index.less';
import { history } from 'umi';
import { useClusterListData } from '../hook'
import VCPermission from '@/components/vc-permission';
import { set } from "_@types_lodash@4.14.182@@types/lodash";
const { TabPane } = Tabs;

const TabList = [
    { label: '节点列表', key: 'node-list' },
    { label: '资源详情', key: 'resource-detail' },
]

const path = '/matrix/pedestal/cluster-detail'
const temp = [{ label: '集群1', value: 'code1' }, { label: '集群2', value: 'code2' },]
export default function Main(props: any) {
    const { location, children } = props;
    const { code, name } = location.query || {};
    const { clusterInfo } = location?.state || {};
    const [visible, setVisble] = useState(false);
    const [clusterOption, setClusterOption] = useState(temp);
    const [selectCluster, setSelectCluster] = useState('');
    const [activeTab, setActiveTab] = useState<string>(location?.query?.key || 'node-list')
    const [data, total] = useClusterListData({ pageSize: -1, pageIndex: -1 });
    useEffect(() => {
        if (data.length) {
            setSelectCluster(code)
        }
    }, [data])

    return (
        <PageContainer className='cluster-main'>
            <ContentCard>
                <div className='search-wrapper'>
                    <div> 选择集群：<Select style={{ width: 240 }} value={selectCluster} onChange={(v) => { setSelectCluster(v) }} options={clusterOption}></Select></div>
                    <div>
                        <span style={{ fontWeight: '600', fontSize: '18px', marginRight: '10px' }}>{code || '---'}</span>
                        <span style={{ color: '#776e6e' }}>{name || '---'}</span>
                    </div>
                </div>

                <Tabs
                    activeKey={activeTab}
                    onChange={(key) => {
                        setActiveTab(key);
                        history.replace({
                            pathname: `/matrix/pedestal/cluster-detail/${key}`,
                            query: { ...location.query, key: key, },
                        });
                    }}
                >
                    {TabList.map((item: any) => (
                        <TabPane tab={item.label} key={item.key} />
                    ))}
                </Tabs>
                <DetailContext.Provider value={{ code, name, selectCluster }}>
                    <VCPermission code={window.location.pathname} isShowErrorPage>
                        {children}
                    </VCPermission>
                </DetailContext.Provider>
            </ContentCard>
        </PageContainer>
    );
}
