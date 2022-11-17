// 查看全部消息
// @author JITONGHUAN <muxi@come-future.com>
// @create 2022/06/16 12:16

import React, { useState, useEffect } from 'react';
import { Drawer, message, Popconfirm, Button, Select, Tag, Spin,Form ,Input} from 'antd';
// import EditTable from '@/components/edit-table';
import { typeOptions,editColumns} from '../schema';
import EditorTable from "@cffe/pc-editor-table";
import { createRuleSet,updateRuleSet } from "../hook";
import './index.less'


export interface IProps {
  mode?: EditorMode;
  onClose: () => any;
  curRecord:any;
  onSave:()=>any;
 
}


export default function AllMessage(props: IProps) {
  const { mode,  onClose,curRecord,onSave } = props;

  const [editForm]=Form.useForm();
  const [loading, setLoading] = useState(false);

  const [labelTableData, setLabelTableData] = useState<any[]>([]);

  useEffect(() => {
    if (mode === 'HIDE' ) return;
    if(mode==="ADD"){
        setLabelTableData([])

    }
    if(mode==="EDIT"){
        editForm.setFieldsValue({
            ...curRecord
        })
      
        try {
            let designFlow=[]
             designFlow=JSON.parse(curRecord?.designFlow||"{}")
             if(designFlow?.nodes?.length>0){
               let data=  designFlow?.nodes?.map((item:any,index:number)=>({
                   ...item,
                   id:index+1

                 }))
                 setLabelTableData(data)

             }else{
                setLabelTableData([]) 
             }
        } catch (error) {
            
        }
       

    }
    return ()=>{
        setLabelTableData([])
        editForm.resetFields()
    }
  }, [mode]);

  const labelFun = (value: any[]) => {
      let data:any=[]
      if(value?.length>0){
          value?.map((ele:any,index:number)=>{
          data.push({
              id:index+1,
              envType:ele?.envType,
              name:ele?.name,
             

           })

          })

      }
    setLabelTableData(data);
   
   // console.log(stepTableMap(data),'----')
  };
  const submit=()=>{
     
      const dataParam=editForm?.getFieldsValue()
      let designFlow=JSON.stringify({nodes:labelTableData})
      if(labelTableData?.length<1){
          message.warning("请填写研发流程！")
          return

      }
      setLoading(true)
      if(mode==="ADD"){
        createRuleSet({...dataParam,designFlow}).then((res)=>{
            if(res?.success){
                message.success("创建成功！")
                onSave()

            }

        }).finally(()=>{
            setLoading(false)
        })

      }
      if(mode==="EDIT"){
          updateRuleSet({...dataParam,designFlow,id:curRecord?.id}).then((res)=>{
            if(res?.success){
                message.success("更新成功！")
                onSave()

            }

        }).finally(()=>{
            setLoading(false)
        })

      }
  }

  return (
    <Drawer
      width={700}
      title={mode==="ADD"?"创建安全规则":"编辑安全规则"}
      placement="right"
      destroyOnClose
      visible={mode !== 'HIDE'}
      onClose={onClose}
      maskClosable={false}
      footer={
        <div className="drawer-footer">
          <Button type="primary" loading={loading} onClick={submit} >
            提交
          </Button>
          <Button type="default" onClick={onClose}>
            返回
          </Button>
        </div>
      }
    >
        <Form labelCol={{flex:"110px"}} form={editForm} preserve={false}>
            {mode==="EDIT"&&( <Form.Item label="ID" name="id">
                <Input  style={{width:380}} disabled={mode==="EDIT"}/>
            </Form.Item>)}
         
            <Form.Item label="规则集名称" name="ruleSetName"   rules={[{ required: true, message: '请输入',}]}>
                <Input style={{width:380}} />
            </Form.Item>
           
            <Form.Item label="引擎类型" name="engineType"  rules={[{ required: true, message: '请输入',}]}>
              
                <Select options={typeOptions} style={{width:380}} disabled={mode==="EDIT"} />
            </Form.Item>
            <Form.Item label="规则集备注" name="ruleSetRemark"  rules={[{ required: true, message: '请输入',}]}>
                <Input.TextArea style={{width:380}} />
            </Form.Item>
            <Form.Item label="研发流程" className="nesting-form-item"   rules={[{ required: true, message: '请输入',}]}>
            <EditorTable
              columns={editColumns}
              onChange={labelFun}
              value={labelTableData}
              style={{ width: '90%' }}
            />
            </Form.Item>
        </Form>
     
    </Drawer>
  );
}
