import React, { useMemo, useState } from 'react';
import { Select, DatePicker } from 'antd';
import PageContainer from '@/components/page-container';
import { ContentCard } from '@/components/vc-page-content';
import './index.less';
import { Form, Button, Table, message } from 'antd';
import { listSchema } from './schema';
import CreateVersion from './create-version';
import VCPermission from '@/components/vc-permission';
import { history, useLocation, Outlet } from 'umi';
import { parse, stringify } from 'query-string';

export default function VersionList() {
    const [seletAppType, setSelectAppType] = useState<any>({})
    const [data, setData] = useState<any>([]);
    const [visible, setVisible] = useState<boolean>(false);
    const tableColumns = useMemo(() => {
        return listSchema() as any;
    }, [data]);
    return (
        <PageContainer className='version-list-page'>
            <ContentCard>
                <CreateVersion visible={visible} onClose={() => { setVisible(false) }} />
                <div className="search-wrapper">
                    <div>
                        应用组：
                         <Select
                            style={{ width: 200 }}
                            size="small"
                            options={[]}
                            labelInValue
                        ></Select>
                         发版时间：
                         <DatePicker showTime />
                    </div>
                    <div>
                        <span style={{ fontWeight: '600', fontSize: '16px', marginRight: '10px' }}>
                            {seletAppType?.value || '---'}
                        </span>
                        <span style={{ color: '#776e6e', fontSize: '13px' }}>{seletAppType?.label || '---'}</span>
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