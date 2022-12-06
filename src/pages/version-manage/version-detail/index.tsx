import React, { useMemo, useState, useEffect, useContext, useRef } from 'react';
import { Select, Descriptions, Tabs, DatePicker, Space, Spin } from 'antd';
import PageContainer from '@/components/page-container';
import { ContentCard } from '@/components/vc-page-content';
import './index.less';
import { Form, Button, Table, message } from 'antd';
// import { listSchema } from './schema';
import { FeContext } from '@/common/hooks';
import { history, useLocation, Outlet } from 'umi';
import { parse, stringify } from 'query-string';
import ModifyApp from './component/modify-app';
import ContentList from './component/content-list';
import ModifyConfig from './component/modify-config';
import ModifySql from './component/modify-sql';
import detailContext from './context';
import { useReleaseOption } from '../hook';
import { getReleaseList, releaseDemandRel, releaseAppRel } from '../service';
import OperateModal from '../version-list/operate-modal';
import { RedoOutlined } from '@ant-design/icons';
import { statusMap } from '../type';
import moment from 'moment';
import { debounce } from 'lodash';
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const getLocalCategory = () => (sessionStorage.getItem('version-detail-category') ? JSON.parse(sessionStorage.getItem('version-detail-category') as any) : {})
const getLocalVersion = () => (sessionStorage.getItem('version-detail-version') ? JSON.parse(sessionStorage.getItem('version-detail-version') as any) : {})
export default function VersionDetail() {
    const query: any = parse(location.search);
    const { key, version, releaseId, categoryName, categoryCode } = query || {};
    const { categoryData } = useContext(FeContext);
    const [data, setData] = useState<any>([]);
    const [visible, setVisible] = useState<boolean>(false);
    const [appCategory, setAppCategroy] = useState<any>(Object.assign(getLocalCategory(), categoryCode ? { value: categoryCode, label: categoryName } : {}));
    const [activeTab, setActiveTab] = useState<string>(key || 'list');
    const [selectVersion, setSelectVersion] = useState<any>(Object.assign(getLocalVersion(), version ? { label: version, value: releaseId } : {}));
    const [versionOptions, versionOptionsLoading, loadVersionOption] = useReleaseOption({ categoryCode: appCategory.value });
    const [initData, setInitData] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [tableData, setTableData] = useState<any>([]);
    const [tableLoading, setTableLoading] = useState<boolean>(false);
    const [originData, setOriginData] = useState<any>([]);
    const tableRef = useRef<any>(null)

    const versionChange = (v: any) => {
        if (!v) {
            setSelectVersion({ label: '', value: '' });
            sessionStorage.removeItem('version-detail-version');
        } else {
            setSelectVersion({ label: v.label, value: v.value });
            sessionStorage.setItem('version-detail-version', JSON.stringify({ label: v.label, value: v.value }));
        }
    }
    const categoryChange = (v: any) => {
        setAppCategroy({ label: v.label, value: v.value });
        sessionStorage.setItem('version-detail-category', JSON.stringify({ label: v.label, value: v.value }));
        loadVersionOption({ categoryCode: v.value })
        versionChange(null)
    }

    useEffect(() => {
        if (versionOptions.length && !selectVersion?.value) {
            versionChange(versionOptions[0]);
        }
        if (!selectVersion?.value) {
            setData([])
        }
    }, [versionOptions])

    useEffect(() => {
        if (categoryData.length && !appCategory.value) {
            categoryChange(categoryData[0])
        }
    }, [categoryData])

    useEffect(() => {
        if (selectVersion?.value && appCategory?.value) {
            queryData(selectVersion.label, appCategory.value)
            queryTableData()
        }
    }, [appCategory, selectVersion])

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
    // 获取版本信息
    const queryData = (releaseNumber = selectVersion.label, categoryCode = appCategory.value) => {
        setLoading(true);
        getReleaseList({ releaseNumber, categoryCode }).then((res) => {
            if (res?.success) {
                setData(res?.data[0] || {});
            }
        }).finally(() => { setLoading(false) })
    }
    // 获取表格数据
    const queryTableData = async () => {
        setTableLoading(true)
        const res = await (activeTab === 'list' ? releaseDemandRel({ releaseId: selectVersion.value }) : releaseAppRel({ releaseId: selectVersion.value }));
        if (res?.success) {
            setTableData(res?.data || [])
            setOriginData(res?.data || [])
        }
        setTableLoading(false)
    }

    const filter = debounce((value) => filterData(value), 500)

    const filterData = (value: string) => {
        if (!value) {
            setTableData(originData);
            return;
        }
        const data = JSON.parse(JSON.stringify(tableData));
        const afterFilter: any = [];
        data.forEach((item: any) => {
            if (item.title?.indexOf(value) !== -1) {
                afterFilter.push(item);
            }
        });

        setTableData(afterFilter);
    }

    return (
        <PageContainer className='version-detail-page'>
            <ContentCard>
                <OperateModal
                    action='downloadList'
                    visible={visible}
                    onClose={() => { setVisible(false) }}
                    initData={initData}
                    appCategory={appCategory}
                />
                <div className="page-top-search">
                    <Space>
                        <div>
                            应用分类：
                         <Select
                                style={{ width: 180 }}
                                size="small"
                                value={appCategory}
                                options={categoryData}
                                labelInValue
                                showSearch
                                onChange={(v) => categoryChange(v)}
                            ></Select>
                        </div>
                        <div>
                            版本号：
                         <Select
                                style={{ width: 160 }}
                                size="small"
                                options={versionOptions}
                                value={selectVersion}
                                labelInValue
                                onChange={(v) => versionChange(v)}
                            ></Select>
                        </div>
                    </Space>
                    <div className='right-text-container'>
                        <div>
                            <span className='grey-text'>当前版本：</span>
                            <span className='black-text'>{selectVersion.label || '---'}</span>
                        </div>
                        <div>
                            <span className='black-text' style={{ fontSize: 18 }}>{appCategory?.value || '---'}</span>
                            <span className='grey-text'>{appCategory?.label || '---'}</span>
                        </div>
                    </div>
                </div>
                <Spin spinning={loading}>
                    <Descriptions title="概述" bordered column={4} extra={
                        <Button
                            icon={<RedoOutlined />}
                            onClick={() => {
                                queryData();
                                queryTableData()
                                // tableRef.current.getTableData();
                            }}
                            size="small"
                        >
                            刷新
                  </Button>
                    }>
                        <Descriptions.Item label="版本号">{data?.releaseNumber || '--'}</Descriptions.Item>
                        <Descriptions.Item label="应用分类">{data?.categoryCode || '--'}</Descriptions.Item>
                        <Descriptions.Item label="版本负责人">{data?.owner || '--'}</Descriptions.Item>
                        <Descriptions.Item label="版本状态">{data.status ? statusMap[data?.status].label : '--'}</Descriptions.Item>
                        <Descriptions.Item label="创建时间">{moment(data?.gmtCreate).format("YYYY-MM-DD HH:mm:ss") || '--'}</Descriptions.Item>
                        <Descriptions.Item label="计划发版本时间">{data?.planTime || '--'}</Descriptions.Item>
                        <Descriptions.Item label="发版时间">{data?.finshTime || '--'}</Descriptions.Item>
                        <Descriptions.Item label="下载次数"><a onClick={() => { setVisible(true) }}>{data?.downloadCount || 0}</a></Descriptions.Item>
                        <Descriptions.Item label="简述" >{data?.sketch || ''}</Descriptions.Item>
                        <Descriptions.Item label="备注" >{data?.desc || ''}</Descriptions.Item>
                    </Descriptions>
                </Spin>
                <div className='tab-container'>
                    <Tabs
                        activeKey={activeTab}
                        onChange={keyChange}
                    >
                        {TabList.map((item: any) => (
                            <TabPane tab={item.label} key={item.key} />
                        ))}
                    </Tabs>
                    <detailContext.Provider
                        value={{ releaseId: selectVersion?.value || '', categoryCode: appCategory?.value || '', categoryName: appCategory?.label || '' }}
                    >
                        <GetComponent tableData={tableData} tableLoading={tableLoading} filter={filter} onSave={queryTableData} />
                    </detailContext.Provider>
                </div>

            </ContentCard>
        </PageContainer >
    )
}