import React, { useMemo, useState, useEffect } from 'react';
import { Select, Descriptions, Tabs, DatePicker, Space } from 'antd';
import PageContainer from '@/components/page-container';
import { ContentCard } from '@/components/vc-page-content';
import './index.less';
import { Form, Button, Table, message } from 'antd';
// import { listSchema } from './schema';
import VCPermission from '@/components/vc-permission';
import { history, useLocation, Outlet } from 'umi';
import { parse, stringify } from 'query-string';
import ModifyApp from './component/modify-app';
import ContentList from './component/content-list';
import ModifyConfig from './component/modify-config';
import ModifySql from './component/modify-sql';
import { useAppGroupData, useVersion } from '../hook'
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

export default function VersionDetail() {
    const query: any = parse(location.search);
    const { key, version, groupName, groupCode } = query || {};
    const [seletAppType, setSelectAppType] = useState<any>({})
    const [data, setData] = useState<any>([]);
    const [visible, setVisible] = useState<boolean>(false);
    const [appGroup, setAppGroup] = useState<any>({ value: groupCode || '', label: groupName || '' });
    const [appGroupOptions] = useAppGroupData({});
    const [activeTab, setActiveTab] = useState<string>(key || 'list');
    const [selectVersion, setSelectVersion] = useState<string>(version || '');
    const [versionOptions] = useVersion({});

    useEffect(() => {
        if (versionOptions && !selectVersion) {
            setSelectVersion(versionOptions[0].value)
        }
    }, [versionOptions])

    useEffect(() => {

    }, [appGroupOptions])

    const TabList = [
        { label: '内容列表', key: 'list', component: ContentList },
        { label: '变更应用', key: 'app', component: ModifyApp },
        { label: '变更配置', key: 'config', component: ModifyConfig },
        { label: '变更SQL', key: 'sql', component: ModifySql },
    ]

    const GetComponent = useMemo(() => TabList.find((e: any) => e.key === activeTab)?.component, [activeTab]) as any

    const keyChange = (key: string) => {
        setActiveTab(key);
        history.push({
            pathname: '/matrix/version-manage/detail',
            search: stringify({ key })
        })
    }
    // const tableColumns = useMemo(() => {
    //     return listSchema() as any;
    // }, [data]);
    return (
        <PageContainer className='version-detail-page'>
            <ContentCard>
                <div className="page-top-search">
                    <Space>
                        <div>
                            应用分类：
                         <Select
                                style={{ width: 180 }}
                                size="small"
                                value={appGroup}
                                options={appGroupOptions}
                                labelInValue
                                showSearch
                                onChange={(v) => {
                                    setAppGroup({ label: v.label, value: v.value });
                                }}
                            ></Select>
                        </div>
                        <div>
                            版本号：
                         <Select
                                style={{ width: 160 }}
                                size="small"
                                options={versionOptions}
                                value={selectVersion}
                            ></Select>
                        </div>
                    </Space>
                    <div>
                        <span>当前版本：<span>--</span></span>
                        <span style={{ fontWeight: '600', fontSize: '16px', marginRight: '10px' }}>
                            {seletAppType?.value || '---'}
                        </span>
                        <span style={{ color: '#776e6e', fontSize: '13px' }}>{seletAppType?.label || '---'}</span>
                    </div>
                </div>
                <Descriptions title="概述" bordered column={4}>
                    <Descriptions.Item label="版本号">1.2.1</Descriptions.Item>
                    <Descriptions.Item label="应用分类">HBOS</Descriptions.Item>
                    <Descriptions.Item label="版本负责人">XXX</Descriptions.Item>
                    <Descriptions.Item label="版本状态">关联需求</Descriptions.Item>
                    <Descriptions.Item label="创建时间">2022-11-02</Descriptions.Item>
                    <Descriptions.Item label="计划发版本时间">2022-11-02</Descriptions.Item>
                    <Descriptions.Item label="发版时间">--</Descriptions.Item>
                    <Descriptions.Item label="下载次数">$60.00</Descriptions.Item>
                    <Descriptions.Item label="简述" >这是一个简述</Descriptions.Item>
                    <Descriptions.Item label="备注" >这是一个备注</Descriptions.Item>
                </Descriptions>
                <div className='tab-container'>
                    <Tabs
                        activeKey={activeTab}
                        onChange={keyChange}
                    >
                        {TabList.map((item: any) => (
                            <TabPane tab={item.label} key={item.key} />
                        ))}
                    </Tabs>
                    <GetComponent />
                </div>

            </ContentCard>
        </PageContainer>
    )
}