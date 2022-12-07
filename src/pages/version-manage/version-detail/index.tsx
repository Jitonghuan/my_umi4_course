import React, { useMemo, useState, useEffect, useContext, useRef } from 'react';
import { Select, Descriptions, Tabs, DatePicker, Space, Spin } from 'antd';
import PageContainer from '@/components/page-container';
import { ContentCard } from '@/components/vc-page-content';
import './index.less';
import { Form, Button, Table, message } from 'antd';
import { FeContext } from '@/common/hooks';
import { history, useLocation, Outlet } from 'umi';
import { parse, stringify } from 'query-string';
import ModifyApp from './component/modify-app';
import ContentList from './component/content-list';
import ModifyConfig from './component/modify-config';
import ModifySql from './component/modify-sql'
import detailContext from './context';
import { releaseAppRel } from '../service';
import { useReleaseOption } from '../hook';
import { getReleaseList} from '../service';
import OperateModal from '../version-list/operate-modal';
import { RedoOutlined } from '@ant-design/icons';
import { statusMap } from '../type';
import moment from 'moment';

const { TabPane } = Tabs;
const getLocalCategory = () => (sessionStorage.getItem('version-detail-category') ? JSON.parse(sessionStorage.getItem('version-detail-category') as any) : {})
const getLocalVersion = () => (sessionStorage.getItem('version-detail-version') ? JSON.parse(sessionStorage.getItem('version-detail-version') as any) : {})
export default function VersionDetail() {
    const query: any = parse(location.search);
    const { key, version, releaseId, categoryName, categoryCode } = query || {};
    const { categoryData } = useContext(FeContext);
    const [data, setData] = useState<any>({});
    const [visible, setVisible] = useState<boolean>(false);
    const [appCategory, setAppCategroy] = useState<any>(Object.assign(getLocalCategory(), categoryCode ? { value: categoryCode, label: categoryName } : {}));
    const [activeTab, setActiveTab] = useState<string>(key || 'list');
    const [selectVersion, setSelectVersion] = useState<any>(Object.assign(getLocalVersion(), version ? { label: version, value: releaseId } : {}));
    const [versionOptions, versionOptionsLoading, loadVersionOption] = useReleaseOption({ categoryCode: appCategory.value });
    const [initData, setInitData] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [tableLoading, setTableLoading] = useState<boolean>(false);
    const [count,setCount]=useState<number>(0)
    const [originData, setOriginData] = useState<any>([]);
    const [dataSource, setDataSource] = useState<any>([])

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
            setData({})
            setInitData({})
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
        }
        if(selectVersion?.value ){
            getDataSource(selectVersion.value)
        }
        
    }, [appCategory?.value, selectVersion?.label,selectVersion?.value])
    useEffect(()=>{
        return()=>{
            setCount(0)
        }
    },[])

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
                setInitData(res?.data[0] || {})
            }
        }).finally(() => { setLoading(false) })
    }
    const getDataSource = (releaseId = selectVersion.value) => {
        setTableLoading(true)
        releaseAppRel({ releaseId }).then((res) => {
            if (res?.success) {
                let data: any = [];
                (res?.data)?.map((ele: any) => {
                    data.push({
                        ...ele,
                        configInfo: Object.keys(ele?.config)?.length,
                        sqlInfo: Object.keys(ele?.sql)?.length,
                        relationDemandsInfo: ele?.relationDemands?.length,

                    })

                })
                setDataSource(data)
                setOriginData(data)

            } else {
                setDataSource([])
                setOriginData([])

            }

        }).finally(() => {
            setTableLoading(false)

        })
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
                                loading={versionOptionsLoading}
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
                          type="primary"
                            icon={<RedoOutlined />}
                            onClick={() => {
                                queryData();
                                getDataSource()
                                setCount(count=>count+1)
                            }}
                            size="small"
                        >
                            刷新
                  </Button>
                    }>
                        <Descriptions.Item label="版本号">{data?.releaseNumber || '--'}</Descriptions.Item>
                        <Descriptions.Item label="应用分类">{data?.categoryCode || '--'}</Descriptions.Item>
                        <Descriptions.Item label="版本负责人">{data?.owner || '--'}</Descriptions.Item>
                        <Descriptions.Item label="版本状态"><span style={{color:statusMap[data?.status]?.color||"gray"}}>{data.status ? statusMap[data?.status]?.label : '--'}</span></Descriptions.Item>
                        <Descriptions.Item label="创建时间">{moment(data?.gmtCreate).format("YYYY-MM-DD HH:mm:ss") || '--'}</Descriptions.Item>
                        <Descriptions.Item label="计划发版本时间">{data?.planTime || '--'}</Descriptions.Item>
                        <Descriptions.Item label="发版时间">{data?.finishTime || '--'}</Descriptions.Item>
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
                        <GetComponent 
                        activeTab={activeTab} 
                        detailInfo={data} 
                        infoLoading={tableLoading}
                        count={count}
                        dataSource={dataSource}
                        setDataSource={setDataSource}
                        originData={originData}
                        onReload={  queryData}/>
                    </detailContext.Provider>
                </div>

            </ContentCard>
        </PageContainer >
    )
}