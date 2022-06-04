import React, { useState, useEffect, useRef } from 'react';
import { Form, Select, Input, Button, Table, Popconfirm } from 'antd';
import { FilterCard, ContentCard } from '@/components/vc-page-content';
import PageContainer from '@/components/page-container';
import Konva from './components/konva'
import DetailDraw from './components/draw'
import { columns, tableData } from './columns'
import './index.less';


export default function DomainConfigs() {
    const [dataSource, setDataSource] = useState(tableData);
    const [visible, setVisible] = useState(true)
    const onJoin = (l: any, right: any) => {

        console.log(l, right);

    }

    const onRelative = (l: any, right: any) => {
        console.log(l, right);

        setVisible(true);
    }

    return (
        <PageContainer className="display">
            <ContentCard className='display-wrapper'>
                <DetailDraw visible={visible} setVisible={setVisible} ></DetailDraw>
                {/* <div className='display-wrapper'> */}
                <div className='konva-wrapper'>
                    <Konva onJoin={onJoin}
                        onRelative={onRelative} />
                </div>
                <div className='table-wrapper'>
                    <Table
                        columns={columns}
                        dataSource={dataSource}
                    // pagination={{
                    //     current: pageIndex,
                    //     total,
                    //     pageSize,
                    //     showSizeChanger: true,
                    //     onShowSizeChange: (_, size) => {
                    //         setPageSize(size);
                    //         setPageIndex(1); //
                    //     },
                    //     showTotal: () => `总共 ${total} 条数据`,
                    // }}
                    // onChange={pageSizeClick}
                    />
                </div>
                {/* </div> */}
            </ContentCard>
        </PageContainer>
    );
}
