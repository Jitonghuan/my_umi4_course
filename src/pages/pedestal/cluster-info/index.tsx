import React, { useEffect, useRef, useState } from "react";
import { Form, Button, Input, Pagination } from "antd";
import type { PaginationProps } from 'antd';
import Count from './component/count';
import PageContainer from '@/components/page-container';
import { FilterCard, ContentCard } from '@/components/vc-page-content';
import ProgessComponent from './component/progress';
import { history } from 'umi';
import './index.less'

export default function Test() {
    const [visible, setVisble] = useState(false);
    const [searchValue, setSearchValue] = useState<string>('')
    const data = [
        {
            name: '集群测试1',
            count: '23',
            code: 'last-cluster1',
            cup: '102/203',
            version: '版本',
            neicun: '200G/256G',
            state: 'health',
            type: 'ower',
            disk: '1.2TB/5TB'
        }, {
            name: '集群测试2',
            count: '23',
            code: 'last-cluster2',
            cup: '102/203',
            version: '版本',
            neicun: '200G/256G',
            state: 'health',
            type: 'ower',
            disk: '1.2TB/5TB'
        }]
    const showTotal: PaginationProps['showTotal'] = total => `总共 ${total}条`;
    const valueChange = (value: any) => {
        setSearchValue(value)
    }
    return (
        <PageContainer className='cluster-info'>
            <ContentCard>
                <div className='search-wrapper'>
                    查询：<Input placeholder="请输入" allowClear value={searchValue} onChange={valueChange} style={{ width: 240 }} size='middle' />
                </div>
                <div className="table-caption" style={{ marginTop: '5px' }}>
                    <div className="caption-left">
                        <h3>集群概览</h3>
                    </div>
                    <div className="caption-right">
                        <Button type="primary" disabled>新增集群</Button>
                    </div>
                </div>
                {data.map((item: any) => (
                    <div className='list-wrapper'>
                        {/* 第一个单元格 */}
                        <div className='list-wrapper-item'>
                            <a
                                className='item-top'
                                style={{ color: '#5183e7' }}
                                onClick={() => {
                                    history.push({
                                        pathname: `/matrix/pedestal/cluster-detail/node-list`,
                                        state: {
                                            clusterInfo: item,
                                        },
                                    });
                                }}>{item.name || '----'}</a>
                            <div className="display-item" style={{ justifyContent: 'flex-start' }}>主机数：{item.count}<Count count={item.count}></Count></div>
                        </div>
                        {/* 第二个单元格 */}
                        <div className='list-wrapper-item'>
                            <div className='item-top'>CODE:{item.code}</div>
                            <div className="display-item">
                                <div>CPU:{item.cpu}</div>
                                <ProgessComponent percent={30} />
                            </div>
                        </div>
                        {/* 第三个单元格 */}
                        <div className='list-wrapper-item'>
                            <div className='item-top'>版本:{item.version}</div>
                            <div className="display-item">内存:
                                <span>{item.neicun}</span>
                                <ProgessComponent percent={30} />
                            </div>
                        </div>
                        {/* 第四个单元格 */}
                        <div className='list-wrapper-item-last'>
                            <div className='last-item' style={{ flex: '1' }}>集群状态：{item.state}</div>
                            <div className='last-item ' style={{ flex: '1' }}>集群类型：{item.type}</div>
                            <div className='last-item display-item' style={{ flex: '1' }}>
                                <span> 磁盘：</span>
                                <ProgessComponent percent={30} />
                            </div>
                        </div>
                    </div>
                ))}
                <div className='page-wrapper'>
                    <Pagination
                        size="small"
                        total={50}
                        showTotal={showTotal}
                        showSizeChanger
                        pageSize={10}
                    />
                </div>
            </ContentCard>
        </PageContainer>
    );
}
