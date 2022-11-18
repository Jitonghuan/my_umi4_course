// article editor
// @author JITONGHUAN <muxi@come-future.com>
// @create 2022/06/15 14:50

import React, { useState, useEffect,} from 'react';
import { Modal, Table,Typography } from 'antd';

import {useGetRollbackSQL} from './hook'
const { Paragraph } = Typography;




export interface IProps {
    visiable?: boolean;
    curId?: number;
    onClose: () => any;
}

export default function CreateArticle(props: IProps) {
    const { visiable,  onClose,curId } = props;
    const [loading,setLoading]=useState<boolean>(false)
    const [dataSource,setDataSource]=useState<any>([])
    const columns=[
        {
            title: 'originalSQL',
            dataIndex: 'originalSQL',
            key: 'originalSQL',
            width:500,
            render:(value:string)=><span style={{display:"inline-block",whiteSpace:"pre-line"}}>
                 <Paragraph copyable> {value?.replace(/\\n/g, '<br/>')}</Paragraph>
               
                </span>
          },
          {
            title: 'rollbackSQL',
            dataIndex: 'rollbackSQL',
            key: 'rollbackSQL',
            width:500,
            render:(value:string)=><span style={{display:"inline-block",whiteSpace:"pre-line"}}> <Paragraph copyable> {value?.replace(/\\n/g, '<br/>')}</Paragraph></span>
          },
    ]

    useEffect(()=>{
        if(curId&&visiable){
            getRollbackSQL() 

        }

    },[curId,visiable])
    const getRollbackSQL=()=>{
        setLoading(true)
        useGetRollbackSQL(curId).then((data)=>{
            setDataSource(data)

        }).finally(()=>{
            setLoading(false)
        })
    }
   
    return (
        <Modal title="回滚sql语句" visible={visiable} destroyOnClose width={"80%"} footer={false} onCancel={onClose}>
            <Table columns={columns} loading={loading} dataSource={dataSource} />  
        </Modal>

    );
}
