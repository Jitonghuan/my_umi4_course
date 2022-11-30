import React, { useEffect, useState, useCallback } from 'react';
import { Modal, Select, Button, message, Empty,Form,Card,Divider,Table } from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import AddModal from './add-modal'
// import {diffConfig} from './hooks';
import { queryCommonEnvCode } from '../../dashboards/cluster-board/hook';
// import {syncOptions} from './type'
import AceDiff from '@/components/ace-diff';
import * as APIS from '../../service';
// import {data} from './mock';
import './index.less'
export default function SyncPolicy(){
    return(
        <>
        <AddModal />

        <ContentCard>

             <Card size="small" title={<><span>过滤应用</span><span className="title-tooltip">{`A->B:以下应用不会被同步!`}</span></>} extra={<a style={{fontSize:16}}>新增过滤应用</a>} headStyle={{background:"#d4e6f7"}} style={{ width: "100%" }}>
                <p>
                    <Table />
                </p>
               
             </Card>
             <Card size="small" title= {<><span>Nacos命名空间</span><span className="title-tooltip">{`A->B:以下命名空间下的配置将会被同步!`}</span></>} extra={<a style={{fontSize:16}}>新增命名空间</a>} headStyle={{background:"#d4e6f7"}} style={{ width: "100%" }}>
                <p>
                    <Table />
                </p>
               
             </Card>
             <Divider />
             <Card size="small" title= {<><span>配置项</span><span className="title-tooltip">{`A->B:以下Nacos配置项不会被替换!`}</span></>} extra={<a style={{fontSize:16}}>新增配置项</a>} headStyle={{background:"#d4e6f7"}} style={{ width: "100%" }}>
                <p>
                    <Table />
                </p>
             </Card>
             <Card size="small" title={<><span>配置项</span><span className="title-tooltip">{`A->B:以下JVM配置项不会被替换!`}</span></>} extra={<a style={{fontSize:16}}>新增JVM参数</a>} headStyle={{background:"#d4e6f7"}} style={{ width: "100%"}}>
                <p>
                    <Table />
                </p>
             </Card>

        </ContentCard>

     </>

    )
}