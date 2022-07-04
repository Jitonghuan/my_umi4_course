import React, { useEffect, useRef, useState, useMemo } from "react";
import { Form, Button, Input, Pagination, Table } from "antd";
import type { PaginationProps } from 'antd';
import PageContainer from '@/components/page-container';
import { FilterCard, ContentCard } from '@/components/vc-page-content';
import { nodeListTableSchema } from '../schema';
import AddNode from './add-node'
import SetTag from './set-tag'
import './index.less'
const mockdata = [{ disk: '11', ip: '12.12.12' }]
export default function Main() {
    const [visible, setVisble] = useState(false);
    const [tagVisible, setTagVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState(mockdata);
    const [pageInfo, setPageInfo] = useState<any>({ pageSize: 10, pageIndex: 1, total: 0 })
    // 表格列配置
    const tableColumns = useMemo(() => {
        return nodeListTableSchema({
            clickTag: (record: any, index: any) => {
                setTagVisible(true)
            },
            diaodu: (record: any, index: any) => {

            },
            paikong: (record: any, index: any) => {

            },
            handleDelete: (record: any, index: any) => {

            },
        }) as any;
    }, [dataSource]);

    return (
        <div className='cluster-node-list'>
            <AddNode visible={visible} onClose={() => { setVisble(false) }}></AddNode>
            <SetTag visible={tagVisible} onCancel={() => { setTagVisible(false) }}></SetTag>
            <div className="table-caption" >
                <div className="caption-left">
                    <h3>节点列表</h3>
                </div>
                <div className="caption-right">
                    <Button type="primary" onClick={() => { setVisble(true) }}>新增节点</Button>
                </div>
            </div>
            <Table
                dataSource={dataSource}
                loading={loading}
                bordered
                rowKey="id"
                pagination={{
                    pageSize: pageInfo.pageSize,
                    total: pageInfo.total,
                    current: pageInfo.pageIndex,
                    showSizeChanger: true,
                    onShowSizeChange: (_, next) => {
                        setPageInfo({
                            pageIndex: 1,
                            pageSize: next,
                        });
                    },
                    onChange: (next) =>
                        setPageInfo({
                            pageIndex: next,
                        }),
                }}
                columns={tableColumns}
                scroll={dataSource.length > 0 ? { x: 1800 } : undefined}
            ></Table>

        </div>
    );
}
