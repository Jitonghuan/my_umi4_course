import React, { useMemo, useState } from 'react';
import { Input, Button, Table, Space, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

export default function ModifyApp() {
    const [data, setData] = useState<any>([]);
    const [visible, setVisible] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string>('')
    const columns = [
        {
            title: '应用CODE',
            dataIndex: 'id',
            width: 120,
        },
        {
            title: '应用类型',
            dataIndex: 'id',
            width: 120,
        },
        {
            title: '变更内容',
            dataIndex: 'id',
            width: 120,
        },
        {
            title: '变更配置',
            dataIndex: 'id',
            width: 120,
        },
        {
            title: '变更SQL',
            dataIndex: 'id',
            width: 120,
        },
        {
            title: '应用版本状态',
            dataIndex: 'id',
            width: 120,
        },
        {
            title: '版本Tag',
            dataIndex: 'id',
            width: 120,
        },
        {
            title: '出包时间',
            dataIndex: 'id',
            width: 120,
        },
        {
            title: '出包人',
            dataIndex: 'id',
            width: 120,
        },
    ]
    return (
        <>
            <div className='table-top'>
                <div className='flex-space-between'>
                    <Space>
                        <span>应用总数：7</span>
                        <span>前端应用：7</span>
                        <span>后端应用：3</span>
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
        </>
    )
}