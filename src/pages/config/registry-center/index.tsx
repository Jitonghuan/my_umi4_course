import React, { useEffect, useState } from 'react';
import { Select, Tabs, Spin, Empty } from 'antd';
import PageContainer from '@/components/page-container';
import { ContentCard } from '@/components/vc-page-content';
import './index.less';
import VCPermission from '@/components/vc-permission';
import { history, useLocation, Outlet } from 'umi';
import { parse, stringify } from 'query-string';
import DetailContext from './context';
import { getNacosEnvs } from '../nacos-config/hook';
import { getNacosNamespaces } from '../nacos-config/components/namespace/hook';
import { namespace } from 'd3-selection';
const mockData = [{ namespaceShowName: 'test', namespaceId: 1 }]

const { TabPane } = Tabs;

const TabList = [
    { label: '生产者列表', key: 'provider' },
    { label: '消费者列表', key: 'consumer' },
    { label: '订阅实例列表', key: 'subscriber' }
];
const path = '/matrix/config/registry';

export default function ClusterDetail(props: any) {
    let location: any = useLocation();
    const query: any = parse(location.search);
    const [envOptions, setEnvOptions] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false)
    const [curEnvCode, setCurEnvCode] = useState<string>('')
    const [activeTab, setActiveTab] = useState<string>(query?.key || 'provider');
    const [namespaces, setNamespaces] = useState<any>([]);
    const [curNamespaceData, setCurNamespaceData] = useState<any>({});//当前选中的namespace数据

    useEffect(() => {
        getEnvOptions()
    }, [])

    useEffect(() => {
        if (curEnvCode) {
            getNamespace(curEnvCode);
        }
    }, [curEnvCode])

    const getEnvOptions = () => {
        setLoading(true)
        getNacosEnvs().then((res) => {
            setEnvOptions(res)
            setCurEnvCode(res[0]?.value)
        }).finally(() => {
            setLoading(false)
        })
    }

    // tab页切换
    const keyChange = (key: any) => {
        setActiveTab(key);
        const query: any = parse(location.search);
        const r = {
            pathname: `${path}/${key}`,
            search: stringify(Object.assign(query, {
                key: key || 'provider',
            })),
        }
        history.replace(r);
    }

    const getNamespace = (envCode = curEnvCode) => {
        setLoading(true)
        getNacosNamespaces(envCode || "").then((res) => {
            let data = [];
            //public的放第一位 且不能默认选中
            const publicNamespace = res.find((item: any) => item.type === 0);
            const otherNamespace = res.filter((item: any) => item.type !== 0);
            if (publicNamespace) {
                data.push(publicNamespace);
            }
            data = data.concat(otherNamespace);
            setNamespaces(data);
            setCurNamespaceData(otherNamespace[0])
        }).finally(() => {
            setLoading(false)
        })
    }

    return (
        <PageContainer className="registry-page">
            <ContentCard>
                <Tabs
                    activeKey={activeTab}
                    onChange={keyChange}
                    tabBarExtraContent={
                        <div style={{ display: 'flex', height: 24, alignItems: "center", }}>
                            <b>选择环境：</b> <Select style={{ width: 210 }} value={curEnvCode} showSearch loading={loading} options={envOptions} onChange={(value: string) => {
                                setCurEnvCode(value)
                            }} />
                        </div>
                    }
                >
                    {TabList.map((item: any) => (
                        <TabPane tab={item.label} key={item.key} />
                    ))}
                </Tabs>
                <DetailContext.Provider
                    value={{ envCode: curEnvCode, tabKey: activeTab, clickNamespace: curNamespaceData }}
                >
                    <VCPermission code={window.location.pathname} isShowErrorPage>
                        {/* 每个tab页下都有namespace */}
                        <div className="namespace-wrapper">
                            <Spin spinning={loading}>
                                {namespaces?.map((item: any, index: number) => {
                                    return (
                                        <>
                                            <span
                                                key={item?.namespaceShowName}
                                                className={curNamespaceData.namespaceId === item.namespaceId ? 'all-namespaces__onClick' : "all-namespaces__unClick"}
                                                onClick={() => {
                                                    setCurNamespaceData(item);
                                                }}
                                            >{item?.namespaceShowName}</span>
                                            {index !== namespaces?.length - 1 && <span style={{ marginLeft: 10 }}>|</span>}
                                        </>
                                    )

                                })}
                            </Spin>
                        </div>
                        {curNamespaceData.namespaceShowName ? <div className="namesapce-title">
                            <span>当前namespace：</span> <span>{curNamespaceData?.namespaceShowName}</span>{curNamespaceData?.namespaceId && <span style={{ marginLeft: 10, color: "gray" }}>|</span>} <span> {curNamespaceData?.namespaceId}</span>
                        </div> :
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={"请先选择namespace"} />
                        }
                        {curNamespaceData.namespaceShowName && <Outlet />}
                    </VCPermission>
                </DetailContext.Provider>
            </ContentCard>
        </PageContainer>
    );
}
