import React, { useMemo, useState, useEffect } from 'react';
import { Select, DatePicker, Space, Input } from 'antd';
import PageContainer from '@/components/page-container';
import { ContentCard } from '@/components/vc-page-content';
import './index.less';
import { Form, Button, Table, message } from 'antd';
import { listSchema } from './schema';
import CreateVersion from './create-version';
import VCPermission from '@/components/vc-permission';
import { history, useLocation, Outlet } from 'umi';
import { parse, stringify } from 'query-string';
import { useAppGroupData } from '../hook'

export default function VersionList() {
    const [data, setData] = useState<any>([{ content: 'ceshi', version: '1.2.1' }]);
    const [visible, setVisible] = useState<boolean>(false);
    const [appGroup, setAppGroup] = useState<any>({});
    const [form] = Form.useForm();
    const [selectTime, setSelectTime] = useState<string>('');
    const [appGroupOptions] = useAppGroupData({});
    useEffect(() => {
        if (appGroupOptions?.length && !appGroup.value) {
            form.setFieldsValue({ appGroup: appGroupOptions[0].value })
            // setAppGroup(appGroupOptions[0])
        }
    }, [appGroupOptions])

    const tableColumns = useMemo(() => {
        return listSchema({
            toDetail: (version: string, toTab: string) => {
                // 跳转到版本详情
                history.push({
                    pathname: '/matrix/version-manage/detail',
                    search: stringify({ key: toTab, version, groupName: appGroup.label, groupCode: appGroup.value })
                })
            },
        }) as any;
    }, [data, appGroup]);

    const formChange = (changedValues: any, allValues: any) => {
        console.log(allValues, 'all')
    }

    return (
        <PageContainer className='version-list-page'>
            <ContentCard>
                <CreateVersion visible={visible} onClose={() => { setVisible(false) }} />
                <div className="search-wrapper">
                    <Form
                        layout="inline"
                        form={form}
                        onValuesChange={formChange}
                    >
                        <Form.Item label="应用分类：" name="appGroup">
                            <Select
                                style={{ width: 180 }}
                                size="small"
                                showSearch
                                options={appGroupOptions}
                                // value={appGroup}
                                // onChange={(v) => {
                                //     setAppGroup({ label: v.label, value: v.value });
                                // }}
                                labelInValue
                            ></Select>
                        </Form.Item>
                        <Form.Item label="版本号" name="version">
                            <Input placeholder='请输入版本号' />
                        </Form.Item>
                        <Form.Item label="发版时间" name="time">
                            <DatePicker
                                showTime
                                // onChange={(v: any) => { setSelectTime(v.format('YYYY-MM-DD HH:mm:ss')) }}
                                format="YYYY-MM-DD HH:mm:ss"
                            />
                        </Form.Item>
                        {/* <Form.Item>
          <Button type="primary" htmlType="submit">
            搜索
          </Button>
        </Form.Item>
        <Form.Item>
          <Button type="ghost" htmlType="reset">
            重置
          </Button>
        </Form.Item> */}
                    </Form>
                    {/* <Space>
                        应用分类：
                         <Select
                            style={{ width: 180 }}
                            size="small"
                            showSearch
                            options={appGroupOptions}
                            value={appGroup}
                            onChange={(v) => {
                                setAppGroup({ label: v.label, value: v.value });
                            }}
                            labelInValue
                        ></Select>
                        版本号：
                        <Input placeholder='请输入版本号' />
                         发版时间：
                         <DatePicker
                            showTime
                            onChange={(v: any) => { setSelectTime(v.format('YYYY-MM-DD HH:mm:ss')) }}
                            format="YYYY-MM-DD HH:mm:ss"
                        />
                    </Space> */}
                    <div>
                        <span style={{ fontWeight: '600', fontSize: '18px', marginRight: '10px' }}>
                            {appGroup?.value || '---'}
                        </span>
                        <span style={{ color: '#776e6e', fontSize: '13px' }}>{appGroup?.label || '---'}</span>
                    </div>
                </div>
                <div className="flex-space-between">
                    <h3>节点列表</h3>
                    <Button
                        style={{ marginRight: '10px' }}
                        size="small"
                        type='primary'
                        onClick={() => { setVisible(true) }}
                    >
                        新增版本
                     </Button>
                    {/* <div className="caption-right">
                    <Button type="primary" onClick={() => { setVisble(true) }}>新增节点</Button>
                </div> */}
                </div>
                <Table
                    dataSource={data}
                    // loading={loading || updateLoading}
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
                    scroll={{ x: 1800 }}
                ></Table>
            </ContentCard>
        </PageContainer>
    )
}