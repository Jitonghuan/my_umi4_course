import React, { useState, useMemo } from 'react';
import {Form, Button, Space } from 'antd';
import PageContainer from '@/components/page-container';
import TableSearch from '@/components/table-search';
import { createTableColumns,formOptions } from './schema';
import TicketDetail from '../../components/ticket-detail';
import ApplyDetailDrawer from '../apply-detail'
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import useTable from '@/utils/useTable';
import {queryWorkflowPrivListApi} from '../../../service'
import {history} from 'umi';
export default function AuthorityApply (){
    const [form] = Form.useForm();
    const [mode,setMode]=useState<EditorMode>("HIDE");
    const [curRecord,setCurRecord]=useState<any>({});
    const [applyDetailMode,setApplyDetailMode]=useState<EditorMode>("HIDE");
    const {
        tableProps,
        search: { submit, reset },
      } = useTable({
        url: queryWorkflowPrivListApi,
        method: 'GET',
        form,
        formatter: (params) => {
          return {
            ...params,
          };
        },
        formatResult: (result) => {
          
          return {
            total: result.data?.pageInfo?.total,
            list: result.data?.dataSource || [],
            
          };
        },
      });
      const columns = useMemo(() => {
        return createTableColumns({
          onDetail: (record, index) => {
            setMode("VIEW")
            setCurRecord(record)
          },
         
        }) as any;
      }, []);
    return(<PageContainer>
      <TableSearch
        form={form}
        bordered
        formOptions={formOptions}
        formLayout="inline"
        columns={columns}
        scroll={{ x: '100%' }}
        {...tableProps}
        //@ts-ignore
        pagination={{
          ...tableProps.pagination,
          showTotal: (total) => `共 ${total} 条`,
          showSizeChanger: true,
          // size: 'small',
          defaultPageSize: 20,
        }}
        extraNode={
          <Space style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <h3>权限申请列表</h3>
            <Button type="primary" onClick={()=>{
               setApplyDetailMode("ADD")
            }}>申请权限</Button>
          </Space>
        }
        className="table-form"
        onSearch={submit}
        reset={reset}
        searchText="查询"
      />
     <TicketDetail
       mode={mode}
       curRecord={curRecord}
       onClose={()=>{setMode("HIDE")}}
       onSave={()=>{setMode("HIDE");reset()}}

      />
      <ApplyDetailDrawer
      mode={applyDetailMode}
      onClose={()=>{setApplyDetailMode("HIDE")}}
      onSave={()=>{setApplyDetailMode("HIDE");reset()}}
      />
    </PageContainer>)
}