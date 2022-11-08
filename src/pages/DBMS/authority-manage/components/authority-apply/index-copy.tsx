import React, { useState, useMemo,useEffect } from 'react';
import {Form, Button, Space } from 'antd';
import { getRequest } from '@/utils/request';
import TableSearch from '@/components/table-search';
import { createTableColumns,createFormItems,currentStatusOptions } from './schema';
import TicketDetail from '../../components/ticket-detail';
import ApplyDetailDrawer from '../apply-detail'
import useTable from '@/utils/useTable';
import {queryWorkflowPrivListApi,currentAuditsApi} from '../../../service'
import {useLocation} from 'umi';
import { parse } from 'query-string';
import {useSearchUser} from '../../../common-hook'


export default function AuthorityApply (){
    const [form] = Form.useForm();
    let location = useLocation();
    const query = parse(location.search);
    const [mode,setMode]=useState<EditorMode>("HIDE");
    const [curRecord,setCurRecord]=useState<any>({});
    const [loading, userNameOptions, searchUser] =useSearchUser()
    const [applyDetailMode,setApplyDetailMode]=useState<EditorMode>("HIDE");
    const [dataSource,setDataSource]=useState<any>([]);

    const getApprovalPerson=(id:number)=>{
      getRequest(currentAuditsApi,{data:{id}}).then((res)=>{
        if(res?.success){
          let data=res?.data?.audits;


        }

      })
     
    }
    
    useEffect(()=>{
      searchUser()
    },[])
    useEffect(() => {
      let intervalId = setInterval(() => {
        submit()
      }, 10000*20);
  
      return () => {
        clearInterval(intervalId);
      };
    }, []);
    useEffect(()=>{
      if(query?.detail==="true"&&query?.id){
        setMode("VIEW")

      }
      

    },[])
    const formOptions = useMemo(() => {
    
      return createFormItems({
        // currentStatusOptions,
        userNameOptions,
       
      });
    }, [userNameOptions]);
    const columns = useMemo(() => {
      return createTableColumns({
        dataSource:dataSource,
        onDetail: (record, index) => {
          setMode("VIEW")
          setCurRecord(record)
        },
       
      }) as any;
    }, [dataSource]);
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
          let list=result.data?.dataSource || []
         
          if(list?.length>0){
            list?.map((item:any)=>{
              getRequest(currentAuditsApi,{data:{id:item?.id}}).then((res)=>{
                if(res?.success){
                  let data=res?.data?.audits;
                  // list.push({
                  //   audit:data
                  // })
               return  ( Object.assign(item, {
                    audit: data,
                  }))
        
                }
        
              })

            })

          }
          setDataSource(list)
        
          return {
            total: result.data?.pageInfo?.total,
            list: list || [],
            
          };
        },
      });
     
    return(<>
       <TicketDetail
       mode={mode}
       curRecord={curRecord}
       queryId={query?.id||''}
       onClose={()=>{setMode("HIDE")}}
       onSave={()=>{setMode("HIDE");
       reset()}}
       getList={
      ()=> reset()}

      />
      <ApplyDetailDrawer
      mode={applyDetailMode}
      onClose={()=>{setApplyDetailMode("HIDE")}}
      onSave={()=>{setApplyDetailMode("HIDE");reset()}}
      />
      <TableSearch
        form={form}
        bordered
        formOptions={formOptions}
        formLayout="inline"
        columns={columns}
        scroll={{ x: '100%' }}
        {...tableProps}
        // loading={!}
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
    
    </>)
}