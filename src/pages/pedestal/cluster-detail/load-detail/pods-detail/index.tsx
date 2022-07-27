import React, { useEffect, useMemo, useState } from 'react';
import { Tag, Table, Empty, Button } from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import { PodsDetailColumn, envVarTable } from '../schema';
import { history } from 'umi';
import './index.less';

export default function PodsDetail(props: any) {
    const { location, children } = props;
    const { pods, containersEnv } = location.state || {};
    const [podsData, setPodsData] = useState([])
    useEffect(() => {
        if (pods && pods.length) {
            setPodsData(pods)
        }
    }, [pods])
    return (
        <div className="pods-detail">
            <div className='flex-space-between'>
                <h3 className="descriptions-title">实例（Pod）事件：</h3>
                <Button type="primary" size='small' onClick={() => { history.goBack() }}>返回</Button>
            </div>
            <Table
                columns={PodsDetailColumn()}
                pagination={false}
                bordered
                // scroll={{ y: window.innerHeight - 564 }}
                dataSource={podsData}
                // loading={podLoading}
                locale={{ emptyText: <Empty description="暂无数据" image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}
            />
            <h3 className="descriptions-title" style={{ marginTop: '10px' }}>环境变量</h3>
            {containersEnv ?
                <>
                    {containersEnv.map((item: any) => (
                        <div>
                            <div style={{ marginBottom: '5px', fontSize: '12px' }}>当前容器：<Tag color='blue'>{item.containerName || '--'}</Tag></div>
                            <Table
                                dataSource={item?.env || []}
                                bordered
                                pagination={false}
                                rowKey="id"
                                columns={envVarTable()}
                                locale={{ emptyText: <Empty description="暂无数据" image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}

                            ></Table>
                        </div>
                    ))}
                </> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />}
        </div>
    );
}
