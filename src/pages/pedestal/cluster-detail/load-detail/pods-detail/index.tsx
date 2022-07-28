import React, { useEffect, useMemo, useState } from 'react';
import { Tag, Table, Empty, Button } from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import { PodsDetailColumn, envVarTable } from '../schema';
import { history } from 'umi';
import './index.less';

export default function PodsDetail(props: any) {
    // const { location } = props;
    const { location } = props;
    const { pods, containersEnv } = location.state || {};
    console.log(pods, containersEnv, 11)
    const [podsData, setPodsData] = useState([]);
    const [container, setContainer] = useState<any>([])
    useEffect(() => {
        if (pods && pods.length) {
            setPodsData(pods)
        }
        if (containersEnv && containersEnv.length) {
            setContainer(containersEnv)
        }
    }, [pods, containersEnv])
    return (
        <div className="pods-detail">
            <div className='flex-space-between'>
                <h3 className="descriptions-title">容器：</h3>
                <Button type="primary" size='small' onClick={() => { history.goBack() }}>返回</Button>
            </div>
            <Table
                columns={PodsDetailColumn()}
                pagination={false}
                bordered
                // scroll={{ y: window.innerHeight - 564 }}
                dataSource={podsData}
            // loading={podLoading}
            // locale={{ emptyText: <Empty description="暂无数据" image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}
            />
            <h3 className="descriptions-title" style={{ marginTop: '10px' }}>环境变量</h3>
            {container && container.length ?
                <>
                    {container.map((item: any) => (
                        <div>
                            <div style={{ marginBottom: '5px', fontSize: '12px' }}>当前容器：<Tag color='blue'>{item?.containerName || item?.name || '--'}</Tag></div>
                            <Table
                                dataSource={item?.env || []}
                                bordered
                                pagination={false}
                                rowKey="id"
                                columns={envVarTable()}
                            ></Table>
                        </div>
                    ))}
                </> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />}
        </div>
    );
}
