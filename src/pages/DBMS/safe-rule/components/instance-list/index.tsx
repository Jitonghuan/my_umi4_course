import React, { useMemo, useState,useEffect } from 'react';
import PageContainer from '@/components/page-container';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import TableSearch from '@/components/table-search';
import { createTableColumns,typeOptions,envTypeData} from './schema';
import useTable from '@/utils/useTable';
import { Modal, Space, Form,Select } from 'antd';
import { queryRuleSetList ,updateRuleSet} from "./hook";
import * as APIS from '../../../service';
export default function InstanceList(){
    const [mode, setMode] = useState<EditorMode>('HIDE');
    const [form] = Form.useForm();
    const [ruleForm] = Form.useForm();
    const [options,setOptions]=useState<any>([])
    const [curRecord,setCurRecord]=useState<any>({})
    useEffect(()=>{
      queryRuleSetList().then((res)=>{
        setOptions(res)
      })

    },[])


  const {
    tableProps,
    search: { submit, reset },
  } = useTable({
    url: APIS.getInstanceListApi,
    method: 'GET',
    form,
    formatter: (params) => {
      return {
        ...params,
      };
    },
    formatResult: (result) => {
        let  dataSource=result?.data?.ruleInstanceRel||[]
      return {
        //total: result.data?.pageInfo?.total,
        list: dataSource ,
      };
    },
  });
  const columns = useMemo(() => {
    return createTableColumns({
      onEdit: (record, index) => {
        setMode('EDIT');
        ruleForm.setFieldsValue({
          ruleSetId:record?.ruleSetId
        })
        setCurRecord(record)
      },
    
     
    }) as any;
  }, []);
    return(
        <>
         <div className="safe-list-content">
        <TableSearch
        form={form}
        bordered
        formOptions={[
            {
                key: '1',
                type: 'select',
                label: '引擎类型',
                dataIndex: 'engineType',
                width: '200px',
                placeholder: '请选择',
                option: typeOptions,
              },
              {
                key: '2',
                type: 'select',
                label: '环境类型',
                dataIndex: 'envType',
                width: '200px',
                placeholder: '请选择',
                option: envTypeData,
              },
         
        ]}
        formLayout="inline"
        columns={columns}
        {...tableProps}
        pagination={false}
        extraNode={
          <Space style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <h3>实例规则列表</h3>
           
          </Space>
        }
        className="table-form"
        onSearch={submit}
        reset={reset}
        scroll={tableProps.dataSource.length > 0 ? { y: '100%' } : {}}
        searchText="查询"
      />
        </div>
        <Modal title="编辑实例规则" visible={mode==="EDIT"} destroyOnClose onOk={()=>{
          updateRuleSet({ruleSetId:ruleForm.getFieldValue("ruleSetId"),instanceId:curRecord?.instanceId}).then((res)=>{
        if(res?.success){
            setMode("HIDE")
             submit()

            }
          })

        }} onCancel={()=>{
          setMode("HIDE")
          //ruleForm.resetFields()
        }}>
          <Form form={ruleForm} preserve={false} >
          <Form.Item name="ruleSetId" label="安全规则">
            <Select options={options} style={{width:280}} />

          </Form.Item>

          </Form>
       

        </Modal>
        </>
    )
}