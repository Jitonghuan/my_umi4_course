import React, { useMemo, useState } from 'react';
import { Input, Button, Table, Space, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

export default function ContentList() {
    const [data, setData] = useState<any>([]);
    const [visible, setVisible] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string>('')
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 120,
        },
        {
            title: '标题',
            dataIndex: 'id',
            width: 200,
        },
        {
            title: '类型',
            dataIndex: 'id',
            width: 120,
        },
        {
            title: '版本需求状态',
            dataIndex: 'id',
            width: 120,
        },
        {
            title: '关联应用',
            dataIndex: 'id',
            width: 120,
        },
    ]
    return (
        <>
            <div className='table-top'>
                <div className='flex-space-between'>
                    <Space>
                        <span>内容总数：7</span>
                        <span>需求：7</span>
                        <span>bug：3</span>
                    </Space>
                    <div>
                        <Tooltip title='ceshi ceshi ' placement="top">
                            <QuestionCircleOutlined style={{ marginLeft: '5px' }} />
                        </Tooltip>
                        搜索：
                        <input
                            style={{ width: 200 }}
                            placeholder='输入内容进行查询过滤'
                            className="ant-input ant-input-sm"
                            onChange={(e) => {
                                //   filter(e.target.value)
                            }}
                        ></input>
                    </div>
                </div>
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
                columns={columns}
            ></Table>
            <div className='flex-end'>
                <Space>
                    <Button type='primary'>
                        关联需求
                </Button>
                    <Button type='primary'>
                        关联bug
                </Button>
                    <Button type='primary'>
                        锁定需求
                </Button>
                </Space>
            </div>
        </>
    )
}