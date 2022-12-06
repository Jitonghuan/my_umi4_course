import React, { useEffect, useState, useContext, useMemo, forwardRef, useImperativeHandle } from 'react';
import { Tag, Button, Table, Space, Tooltip, Popconfirm } from 'antd';
import { QuestionCircleOutlined, CloseCircleFilled } from '@ant-design/icons';
import RealteDemandBug from './relate-demand-bug';
import detailContext from '../../context';
import {demandStatusTypes} from './type'
import { releaseDemandRel, deleteDemand } from '../../../service';
export default forwardRef(function ContentList(props: any) {
    const { tableData, tableLoading, onSave, filter } = props;
    const [type, setType] = useState<string>('hide');
    const { categoryCode, releaseId } = useContext(detailContext);
    const demandTotal = useMemo(() => (tableData || []).filter((item: any) => item.relatedPlat === 'demandPlat').length, [tableData])
    const bugTotal = useMemo(() => (tableData || []).filter((item: any) => item.relatedPlat !== 'demandPlat').length, [tableData])

    const columns: any = [
        {
            title: 'ID',
            dataIndex: 'entryCode',
            width: 160,
            render: (value: string, record: any) =>
                <a onClick={() => {
                    if (record?.url) { window.open(record.url, '_blank') }
                }}>{value}</a>
        },
        {
            title: '标题',
            dataIndex: 'title',
            width: 200,
        },
        {
            title: '类型',
            dataIndex: 'relatedPlat',
            width: 80,
            render: (value: string) => <span><Tag color={value === 'demandPlat' ? 'green' : 'blue'}>{value === 'demandPlat' ? '需求' : 'bug'}</Tag></span>
        },
        {
            title: '版本需求状态',
            dataIndex: 'demandStatus',
            width: 120,
            render:(value: string)=><span style={{color:demandStatusTypes[value]?.color ||"gray"}}>
                
                {value}</span>
        },
        {
            title: '关联应用',
            dataIndex: 'relationApps',
            width: 300,
            render: (value: any, record: any) => <div>{value?.map((item: any) => <Tag> <span style={{ color: '#4169E1' }}>{item?.appCode} </span> <span style={{ color: item.appStatus === '未出包' ? 'gray' : 'green' }}>{item?.appStatus}</span> </Tag>)}</div>
        },
        {
            title: '操作',
            fixed: 'right',
            width: 40,
            align: 'center',
            render: (_: any, record: any, index: number) => (
                <div className="action-cell">
                    <Popconfirm
                        title="确定要移除吗？"
                        onConfirm={() => {
                            handleDelete(record.id);
                        }}
                    >
                        <a>
                            <CloseCircleFilled style={{ color: '#d10a0a', fontSize: 18 }} />
                        </a>
                    </Popconfirm>
                </div>
            ),
        },
    ]

    const handleDelete = async (id: any) => {
        const res = await deleteDemand({ ids: [id] })
        if (res?.success) {
            onSave();
        }
    }
    return (
        <>
            <RealteDemandBug type={type} onClose={() => { setType('hide') }} releaseId={releaseId} onSave={onSave} />
            <div className='table-top'>
                <div className='flex-space-between'>
                    <Space>
                        <span>内容总数：{tableData?.length}</span>
                        <span>需求：{demandTotal}</span>
                        <span>bug：{bugTotal}</span>
                    </Space>
                    <div>
                        <Tooltip title='ceshi ceshi ' placement="top">
                            <QuestionCircleOutlined style={{ marginLeft: '5px' }} />
                        </Tooltip>
                        查询：
                        <input
                            style={{ width: 200 }}
                            placeholder='输入内容进行查询过滤'
                            className="ant-input ant-input-sm"
                            onChange={(e) => {
                                filter(e.target.value)
                            }}
                        ></input>
                    </div>
                </div>
            </div>
            <Table
                dataSource={tableData}
                bordered
                rowKey="id"
                loading={tableLoading}
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
                columns={columns}
            ></Table>
            <div className='flex-end'>
                <Space>
                    <Button type='primary' onClick={() => { setType('demand') }}>
                        关联需求
                </Button>
                    <Button type='primary' onClick={() => { setType('bug') }}>
                        关联bug
                </Button>
                    <Button type='primary'>
                        锁定需求
                </Button>
                </Space>
            </div>
        </>
    )
})