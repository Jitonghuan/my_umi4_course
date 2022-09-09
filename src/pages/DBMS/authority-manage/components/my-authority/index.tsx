import React, { useState, useMemo } from 'react';
import {Form, Space } from 'antd';
import TableSearch from '@/components/table-search';
import { createTableColumns,formOptions } from './schema';
import useTable from '@/utils/useTable';
export default function MyAuthority (){
    const [form] = Form.useForm();
    const {
        tableProps,
        search: { submit, reset },
      } = useTable({
        url: '',
        method: 'GET',
        form,
        formatter: (params) => {
          return {
            ...params,
          };
        },
        formatResult: (result) => {
           let   data=[{
                 id:1,
                 name:'ceshi'
             }]
          return {
            total: result.data?.pageInfo?.total,
            // list: result.data?.dataSource || [],
            list:data
          };
        },
      });
      const columns = useMemo(() => {
        return createTableColumns({
          onDelete: (record, index) => {
            
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
            <h3>我的权限列表</h3>
          </Space>
        }
        className="table-form"
        onSearch={submit}
        reset={reset}
        searchText="查询"
      />
    </>)
}