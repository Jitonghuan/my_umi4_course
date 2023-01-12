import React, { useEffect, useMemo } from 'react';
import {Form, Space } from 'antd';
import TableSearch from '@/components/table-search';
import { createTableColumns,createFormItems } from './schema';
import useTable from '@/utils/useTable';
import {queryPrivListApi} from '../../../service'
import {  useDeletePriv} from './hook';
import {useSearchUser} from '../../../common-hook';
import './index.less'
export default function MyAuthority (){
    const [loading, deletePriv]=useDeletePriv()
    const [form] = Form.useForm();
    const [userLoading, userNameOptions, searchUser] =useSearchUser()
     
    useEffect(()=>{
      searchUser()
    },[])
    const formOptions = useMemo(() => {
      return createFormItems({
        // currentStatusOptions,
        userNameOptions,
       
      });
    }, [userNameOptions]);
    const {
        tableProps,
        search: { submit, reset },
      } = useTable({
        url: queryPrivListApi,
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
          onDelete: (record, index) => {
            deletePriv(record).then(()=>{
              submit()
            })
            
          },
         
        }) as any;
      }, []);
    return(<div className="my-authority-wrap">
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
            <h3>我的权限列表</h3>
          </Space>
        }
        className="table-form"
        onSearch={submit}
        reset={reset}
        searchText="查询"
      />
    </div>)
}