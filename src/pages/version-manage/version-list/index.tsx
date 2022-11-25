import React, { useMemo, useState, useEffect, useContext } from 'react';
import { Select, DatePicker, Input } from 'antd';
import PageContainer from '@/components/page-container';
import { ContentCard } from '@/components/vc-page-content';
import { Form, Button, Table, message } from 'antd';
import { listSchema } from './schema';
import CreateVersion from './create-version';
import VCPermission from '@/components/vc-permission';
import { history, useLocation, Outlet } from 'umi';
import { parse, stringify } from 'query-string';
import { FeContext } from '@/common/hooks';
import OperateModal from './operate-modal';
import { versionSortFn } from '@/utils';
import { getReleaseList } from '../service';
import './index.less';

export default function VersionList() {
    const [data, setData] = useState<any>([]);
    const [visible, setVisible] = useState<boolean>(false);
    const { categoryData } = useContext(FeContext);
    const [appCategory, setAppCategroy] = useState<any>({});
    const [form] = Form.useForm();
    const [action, setAction] = useState<string>('')
    const [selectTime, setSelectTime] = useState<string>('');
    const [operateVisible, setOperateVisible] = useState<boolean>(false);
    const [initData, setInitData] = useState<any>({});
    const [total, setTotal] = useState<number>(0);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(20);
    const [loading, setLoading] = useState<boolean>(false);

    // useEffect(() => {
    //     queryList({ pageSize, pageIndex });
    // }, [])

    const maxVersion = useMemo(() => {
        const versionList = (data || []).map((item: any) => item.version);
        const res = versionList.sort((a: any, b: any) => versionSortFn(a, b))
        return res.length ? res[0] : '';
    }, [data]);

    useEffect(() => {
        if (categoryData?.length && !appCategory.value) {
            form.setFieldsValue({ categoryCode: categoryData[0].value })
            setAppCategroy(categoryData[0])
        }
    }, [categoryData])

    const tableColumns = useMemo(() => {
        return listSchema({
            toDetail: (record: any, toTab: string) => {
                console.log(record, record.id, 'record')
                // 跳转到版本详情
                history.push({
                    pathname: '/matrix/version-manage/detail',
                    search: stringify({ key: toTab, version: record?.releaseNumber, releaseId: record.id, categoryName: appCategory.label, categoryCode: appCategory.value })
                })
            },
            downloadVersion: (record: any) => {
                openModal('downloadPackage', record)
            },
            downloadCountList: (record: any) => {
                openModal('downloadList', record)
            },
            mergeVersion: (record: any) => {
                openModal('merge', record)
            }
        }) as any;
    }, [data, appCategory]);

    // 获取列表
    const queryList = (params: any) => {
        setLoading(true);
        const value = form.getFieldsValue();
        getReleaseList({ ...value, categoryCode: value?.categoryCode?.value, ...params }).then((res) => {
            if (res?.success) {
                setData(res?.data || []);
                setTotal(res?.data.length)
            }
        }).finally(() => { setLoading(false) })
    }

    const initSearch = () => {
        setPageIndex(1);
        queryList({ pageSize, pageIndex: 1 })
    }

    const openModal = (actionType: string, record: any) => {
        setInitData(record);
        setAction(actionType);
        setOperateVisible(true)
    }

    const formChange = (changedValues: any, allValues: any) => {
        queryList({ pageSize, pageIndex })
    }

    return (
        <PageContainer className='version-list-page'>
            <ContentCard>
                <OperateModal
                    action={action}
                    visible={operateVisible}
                    onClose={() => { setOperateVisible(false) }}
                    initData={initData}
                    appCategory={appCategory}
                />
                <CreateVersion
                    visible={visible}
                    onClose={() => { setVisible(false) }}
                    categoryData={categoryData}
                    maxVersion={maxVersion || ''}
                    onSave={initSearch}
                />
                <div className="search-wrapper">
                    <Form
                        layout="inline"
                        form={form}
                        onValuesChange={formChange}
                    >
                        <Form.Item label="应用分类：" name="categoryCode">
                            <Select
                                style={{ width: 160 }}
                                size="small"
                                showSearch
                                options={categoryData}
                                value={appCategory}
                                onChange={(v) => {
                                    setAppCategroy({ label: v.label, value: v.value });
                                }}
                                labelInValue
                            ></Select>
                        </Form.Item>
                        <Form.Item label="版本号" name="releaseNumber">
                            <Input placeholder='请输入版本号' />
                        </Form.Item>
                        {/* <Form.Item label="发版时间" name="finishTime">
                            <DatePicker
                                showTime
                                // onChange={(v: any) => { setSelectTime(v.format('YYYY-MM-DD HH:mm:ss')) }}
                                format="YYYY-MM-DD HH:mm:ss"
                            />
                        </Form.Item> */}
                    </Form>

                    <div>
                        <span style={{ fontWeight: '600', fontSize: '18px', marginRight: '10px' }}>
                            {appCategory?.value || '---'}
                        </span>
                        <span style={{ color: '#776e6e', fontSize: '13px' }}>{appCategory?.label || '---'}</span>
                    </div>
                </div>
                <div className="flex-space-between">
                    <h3>版本列表</h3>
                    <Button
                        style={{ marginRight: '10px' }}
                        size="small"
                        type='primary'
                        onClick={() => { setVisible(true) }}
                    >
                        新增版本
                     </Button>
                </div>
                <Table
                    dataSource={data}
                    loading={loading}
                    bordered
                    rowKey="id"
                    pagination={{
                        pageSize: pageSize,
                        total: total,
                        current: pageIndex,
                        showSizeChanger: true,
                        onShowSizeChange: (_, next) => {
                            setPageIndex(1);
                            setPageSize(next);
                        },
                        onChange: (next) => {
                            setPageIndex(next)
                        }
                    }}
                    columns={tableColumns}
                    scroll={{ x: 1800 }}
                ></Table>
            </ContentCard>
        </PageContainer>
    )
}