import React, { useState, useMemo,useEffect } from 'react';
import {Form, Button, Space } from 'antd';
import TableSearch from '@/components/table-search';
import { createTableColumns,createFormItems } from './schema';
import {currentStatusOptions} from '../authority-manage/components/authority-apply/schema'
import {querySqlListApi} from '../service';
import {useSearchUser} from '../common-hook'

import useTable from '@/utils/useTable';
import {history} from 'umi';
export default function AuthorityApply (){
    const [form] = Form.useForm();
    const [curRecord,setCurRecord]=useState<any>({});
    const [loading, userNameOptions, searchUser] =useSearchUser()
    useEffect(()=>{
      searchUser()
    },[])
    const formOptions = useMemo(() => {
      return createFormItems({
        currentStatusOptions,
        userNameOptions,
       
      });
    }, [userNameOptions,currentStatusOptions]);
    const {
        tableProps,
        search: { submit, reset },
      } = useTable({
        url: querySqlListApi,
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
            setCurRecord(record)
            if(record?.currentStatus!=="manReviewing"){
              history.push({
                pathname:"/matrix/DBMS/approval-end",
                
              
              },{
                record
              })
            }
            if(record?.currentStatus==="manReviewing"){
              history.push({
                pathname:"/matrix/DBMS/ticket-approval",
                
              },{
                record
              })
            }
           
          },
         
        }) as any;
      }, []);
    return(<>
      <TableSearch
        form={form}
        bordered
        formOptions={formOptions}
        formLayout="inline"
        columns={columns}
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
            <h3>数据变更列表</h3>
            <Button type="primary" onClick={()=>{
               history.push({
                 pathname:"./change-apply"
               })
            }}>数据变更</Button>
          </Space>
        }
        className="table-form"
        onSearch={submit}
        reset={reset}
        searchText="查询"
      />
     
      
    </>)
}