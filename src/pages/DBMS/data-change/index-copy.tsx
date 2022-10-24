import React, { useState, useMemo,useEffect } from 'react';
import {Form, Button, Space } from 'antd';
import PageContainer from '@/components/page-container';
import TableSearch from '@/components/table-search';
import { getRequest } from '@/utils/request';
import { createTableColumns,createDataFormItems } from './schema';
import {querySqlListApi} from '../service';
import {queryWorkflowPrivListApi,currentAuditsApi} from '../service'
import {useSearchUser} from '../common-hook'
import useTable from '@/utils/useTable';
import {history} from 'umi';
export default function AuthorityApply (){
    const [form] = Form.useForm();
    const [dataSource,setDataSource]=useState<any>([]);
    const [total, setTotal] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(20);
    const [loading, userNameOptions, searchUser] =useSearchUser()
    useEffect(()=>{
      searchUser()
    },[])
    const formOptions = useMemo(() => {
      return createDataFormItems({
        // currentStatusOptions,
        userNameOptions,
       
      });
    }, [userNameOptions]);
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
          let list=result.data?.dataSource || []
          if(list?.length>0){
            list?.map((item:any)=>{
              getRequest(currentAuditsApi,{data:{id:item?.id}}).then((res)=>{
                if(res?.success){
                  let data=res?.data?.audits;
                  setDataSource([...new Set([...list,Object.assign(item, {
                    audit: data,
                  })])])
                }
              })
            })}  
          return {
            total: result.data?.pageInfo?.total,
            list: result.data?.dataSource || [],

          };
        },
      });
      const columns = useMemo(() => {
        return createTableColumns({
          onDetail: (record, index) => {
              history.push({
                pathname:"/matrix/DBMS/approval-end",
                
              
              },{
                record
              })
            
           
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
     
      
    </PageContainer>)
}