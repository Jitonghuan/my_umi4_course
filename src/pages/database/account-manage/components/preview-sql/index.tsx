// article editor
// @author JITONGHUAN <muxi@come-future.com>
// @create 2022/06/15 14:50

import React, { useState, useEffect,} from 'react';
import { Modal, Table,Form,Spin } from 'antd';
import AceEditor from '@/components/ace-editor';
import {previewGrantSql} from '../grant-default/hook'
export interface IProps {
    mode?: EditorMode;
    curRecord?: any;
    onClose: () => any;
    newPrivs:any;
    oldPrivs:any;
    onSave: () => any;
}

export default function CreateArticle(props: IProps) {
    const { mode,  onClose,curRecord,oldPrivs,newPrivs } = props;
    const [loading,setLoading]=useState<boolean>(false)
    const [dataSource,setDataSource]=useState<any>([])
    const [sqlForm] =Form.useForm()
    const [showSql,setShowSql]=useState<boolean>(false)
   
   useEffect(()=>{
       if(mode!=="HIDE"){
        previewGrantSqlAction()
       }

   },[mode])
   
    const previewGrantSqlAction=()=>{
        setLoading(true)
        previewGrantSql({oldPrivs,newPrivs,user:curRecord?.user,host:curRecord?.host}).then((res)=>{
            if(res?.success){
                let data=res?.data
                let source=[]
                if(data?.globalGrantsSql?.length>0){
                    source=data?.globalGrantsSql

                }
                if(data?.columnGrantsSql?.length>0){
                 
                    source=[...source,...data?.columnGrantsSql]
                }
                if(data?.dbGrantsSql?.length>0){
                   
                    source=[...source,...data?.dbGrantsSql]
                }
                if(data?.tableGrantsGql?.length>0){
                    source=[...source,...data?.tableGrantsGql]
                }
              
                    // debugger
                    let sql=source?.join(' \n')
                    setDataSource(data)
                    sqlForm.setFieldsValue({
                        showSql:sql
                    })
               
               

            }
           
        }).finally(()=>{
            setLoading(false)
        })
    }
   
    return (
        <>
          <Modal title="预览SQL" destroyOnClose width={"80%"} visible={mode!=="HIDE"} footer={false} onCancel={onClose}>
              <Spin spinning={loading}>
              <Form form={sqlForm} preserve={false}>
          <Form.Item name="showSql">
          <AceEditor mode="sql" height={900} readOnly={true} />
          </Form.Item>

        </Form>

              </Spin>
      
       

      </Modal>
     
        </>

    );
}
