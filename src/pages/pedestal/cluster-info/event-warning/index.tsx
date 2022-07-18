import React, { useEffect, useRef, useState, useMemo, useContext } from "react";
import { Form, Button, Input, Tag, Table, Select, message } from "antd";
import type { PaginationProps } from 'antd';
import { history } from 'umi';
import './index.less'
import { warningTableSchema, eventSchema } from '../schema';

import { useResourceListData } from '../hook';
import './index.less';
const mockData: any = []
const statusColor: any = { Etcd: '#2fce4b', Controller: '#2fce4b', Scheduler: '#dccc43', ApiServer: '#c12726' }
export default function EventWarning(props: any) {
    const { location, children } = props;
    const [visible, setVisble] = useState(false);
    const [pageSize, setPageSize] = useState(20);
    const [pageIndex, setPageIndex] = useState(1);
    const [eventPageSize, setEventPageSize] = useState(20);
    const [eventPageIndex, setEventPageIndex] = useState(1);

    return (
        <div className='cluster-event-warning'>
            <p>控制平面组件状态</p>
            <div className='flex-row'>
                {Object.keys(statusColor).map((item: any) => {
                    return <div className={`flex-row status-item flex-center`}>
                        <div className='status-circle' style={{ backgroundColor: statusColor[item] || 'green' }}></div>
                        {item}
                    </div>
                })}
            </div>
            <div className='table-warpper'>
                <div className='table-section'>
                    <div className='title'>集群告警</div>
                    <Table
                        dataSource={mockData}
                        // loading={loading}
                        bordered
                        rowKey="id"
                        pagination={{
                            pageSize: pageSize,
                            total: 50,
                            current: pageIndex,
                            showSizeChanger: true,
                            onShowSizeChange: (_, next) => {
                                setPageSize(next)
                            },
                            onChange: (next) =>
                                setPageIndex(next)
                        }}
                        columns={warningTableSchema()}
                    ></Table>
                </div>
                <div className='table-section'>
                    <div className='title'>集群事件</div>
                    <Table
                        dataSource={mockData}
                        // loading={loading}
                        bordered
                        rowKey="id"
                        pagination={{
                            pageSize: eventPageSize,
                            total: 50,
                            current: eventPageIndex,
                            showSizeChanger: true,
                            onShowSizeChange: (_, next) => {
                                setEventPageSize(next)
                            },
                            onChange: (next) =>
                                setEventPageIndex(next)
                        }}
                        columns={eventSchema()}
                    ></Table>
                </div>
            </div>
        </div >
    );
}
