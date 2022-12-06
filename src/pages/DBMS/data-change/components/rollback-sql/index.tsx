// article editor
// @author JITONGHUAN <muxi@come-future.com>
// @create 2022/06/15 14:50

import React, { useState, useEffect,} from 'react';
import { Modal, Table,Typography,Form,Drawer } from 'antd';
import AceEditor from '@/components/ace-editor';
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
    const [sqlForm] =Form.useForm()
    const [showSql,setShowSql]=useState<boolean>(false)
    const columns=[
        {
            title: 'originalSQL',
            dataIndex: 'originalSQL',
            key: 'originalSQL',
            width:500,
            ellipsis:true,
            render:(value:string)=><span >
                 {/* <Paragraph copyable> {value?.replace(/\\n/g, '<br/>')}</Paragraph> */}
                 {/* style={{display:"inline-block",whiteSpace:"pre-line"}} */}
                <a onClick={()=>{
                      setShowSql(true)
                      sqlForm.setFieldsValue({
                        showSql:value?.replace(/\\n/g, '<br/>')
                      })
                    }}> {value?.replace(/\\n/g, '<br/>')}</a>
               
                </span>
          },
          {
            title: 'rollbackSQL',
            dataIndex: 'rollbackSQL',
            key: 'rollbackSQL',
            width:500,
            ellipsis:true,
            render:(value:string)=><span >
                 {/* <Paragraph copyable> {value?.replace(/\\n/g, '<br/>')}</Paragraph> */}
                 <a onClick={()=>{
                      setShowSql(true)
                      sqlForm.setFieldsValue({
                        showSql:value?.replace(/\\n/g, '<br/>')
                      })
                    }}> {value?.replace(/\\n/g, '<br/>')}</a>
                 </span>
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
        <>
          <Drawer title="sql详情" visible={showSql} footer={false} width={"70%"} onClose={()=>{setShowSql(false)}} destroyOnClose>
        <Form form={sqlForm} preserve={false}>
          <Form.Item name="showSql">
          <AceEditor mode="sql" height={900} readOnly={true} />
          </Form.Item>

        </Form>
       

      </Drawer>
        <Modal title="回滚sql语句" visible={visiable} destroyOnClose width={"80%"} footer={false} onCancel={onClose}>
            <Table columns={columns} loading={loading}  scroll={{ x: '100%' }} dataSource={dataSource} />  
        </Modal>
        </>

    );
}
