import React, { useMemo, useState } from 'react';
import TableSearch from '@/components/table-search';
import { createTableColumns,typeOptions} from './schema';
import useTable from '@/utils/useTable';
import { Button, Space, Form,message } from 'antd';
import * as APIS from '../../../service';
import EditRules from "./create-rule";
import {deleteRuleSet} from './hook'
import './index.less'

export default function SafeList(){
    const [mode, setMode] = useState<EditorMode>('HIDE');
    const [form] = Form.useForm();
    const [curRecord,setCurRecord]=useState<any>({})
    const {
    tableProps,
    search: { submit, reset },
  } = useTable({
    url: APIS.getRuleSetListApi,
    method: 'GET',
    form,
    formatter: (params) => {
      return {
        ...params,
      };
    },
    formatResult: (result) => {
        let  dataSource=result?.data?.ruleSets||[]
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
        setCurRecord(record)
      },
    
      onDelete: async (id) => {
        deleteRuleSet(id).then((res:any)=>{
          if(res?.sucess){
            message.success("删除成功！")
            submit()

          }

        })
       
      },
     
    }) as any;
  }, []);
    return(
        <div className="safe-list-content">
          <EditRules 
          mode={mode}
          onClose={()=>{setMode("HIDE") ;}}
          curRecord={curRecord}
          onSave={()=>{ setMode("HIDE") ;submit()}}
          />
        <TableSearch
        form={form}
        bordered
        formOptions={[
            {
                key: '1',
                type: 'select',
                label: '类型',
                dataIndex: 'engineType',
                width: '200px',
                placeholder: '请选择',
                option: typeOptions,
              },
         
        ]}
        formLayout="inline"
        columns={columns}
        {...tableProps}
        pagination={false}
        extraNode={
          <Space style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <h3>安全规则列表</h3>
            <Button
              type="primary"
              onClick={() => {
                setMode('ADD');
              }}
            >
              + 新建规则
            </Button>
          </Space>
        }
        className="table-form"
        onSearch={submit}
        reset={reset}
        scroll={tableProps.dataSource.length > 0 ? { y: '100%' } : {}}
        searchText="查询"
      />
        </div>
    )
}