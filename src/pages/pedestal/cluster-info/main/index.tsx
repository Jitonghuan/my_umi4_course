import React, { useEffect, useRef, useState } from "react";
import { Form, Button, Input, Pagination, Select, Tabs } from "antd";
import type { PaginationProps } from 'antd';
import DetailContext from './context';
import PageContainer from '@/components/page-container';
import { FilterCard, ContentCard } from '@/components/vc-page-content';
import './index.less';
import { history } from 'umi';
import VCPermission from '@/components/vc-permission';
const { TabPane } = Tabs;

const TabList = [
    { label: '机器列表', key: 'node-list' },
    { label: '资源详情', key: 'resource-detail' },
]

const path = '/matrix/pedestal/cluster-detail'

export default function Main(props: any) {
    const { location, children } = props;
    const { clusterInfo } = location?.state || {};
    const [visible, setVisble] = useState(false);
    const [clusterOption, setClusterOption] = useState([]);
    const [activeTab, setActiveTab] = useState<string>(location?.query?.key || 'node-list')
    const clusterChange = () => {

    }

    return (
        <PageContainer className='cluster-main'>
            <ContentCard>
                <div className='search-wrapper'>
                    <div> 选择集群：<Select style={{ width: 240 }} onChange={clusterChange} options={clusterOption}></Select></div>
                    <div>
                        <span style={{ fontWeight: '600', fontSize: '18px', marginRight: '10px' }}>{clusterInfo?.code || '---'}</span>
                        <span style={{ color: '#776e6e' }}>{clusterInfo?.name || '---'}</span>
                    </div>
                </div>

                <Tabs
                    activeKey={activeTab}
                    onChange={(key) => {
                        setActiveTab(key);
                        history.replace({
                            pathname: `/matrix/pedestal/cluster-detail/${key}`,
                            query: { key: key },
                        });
                    }}
                >
                    {TabList.map((item: any) => (
                        <TabPane tab={item.label} key={item.key} />
                    ))}
                </Tabs>
                <DetailContext.Provider value={{ type: '11' }}>
                    <VCPermission code={window.location.pathname} isShowErrorPage>
                        {children}
                    </VCPermission>
                </DetailContext.Provider>
            </ContentCard>
        </PageContainer>
    );
}
