import React, { useMemo, useState } from 'react';
import { Input, Button, Table, Space, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

export default function ModifySql() {
    const [data, setData] = useState<any>([]);
    const [visible, setVisible] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string>('')
    const columns = [
        {
            title: '所属应用',
            dataIndex: 'id',
            width: 120,
        },
        {
            title: 'SQL内容',
            dataIndex: 'id',
        },
    ]
    return (
        <>
            <div className='table-top'>
                <div className='flex-space-between'>
                    <Space>
                        <span>SQL总数：7</span>
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