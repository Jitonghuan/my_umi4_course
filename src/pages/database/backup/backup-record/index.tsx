import React, { useMemo, useState,useEffect } from 'react';
import PageContainer from '@/components/page-container';
import TableSearch from '@/components/table-search';
import { Button, Space, Form,Table } from 'antd';
import { createRecordTableColumns,  } from '../schema';
import useTable from '@/utils/useTable';
import * as APIS from '../../service';
import { useGetBackupTypeList } from "../hook";
export default function AdminList() {
    const [form] = Form.useForm();
    const [loading, typeOptions,getBackupTypeList]=useGetBackupTypeList()
    const columns = useMemo(() => {
      return createRecordTableColumns() as any;
    }, []);
    useEffect(()=>{
      getBackupTypeList()
    },[])
  
    const {
      tableProps,
      search: { submit, reset },
    } = useTable({
      url: APIS.getRecordList,
      method: 'GET',
      form,
      formatter: (params) => {
        return {
          ...params,
          pageSize:-1,
          pageIndex:-1
        };
      },
      formatResult: (result) => {
        return {
          total: result.data?.pageInfo?.total,
          list: result.data?.dataSource || [],
        };
      },
    });
  
    return (
      <PageContainer>
        <TableSearch
          form={form}
          // bordered
          formOptions={[
            {
                key: '1',
                type: 'select',
                label: '备份类型',
                dataIndex: 'backupType',
                width: '200px',
                placeholder: '请选择',
                option: typeOptions,
              },
              {
                  key: '2',
                  type: 'input',
                  label: '备份计划',
                  dataIndex: 'backupName',
                  width: '200px',
                  placeholder: '请输入',
                 
                },
          ]}
          formLayout="inline"
          columns={columns}
          {...tableProps}
          pagination={false}
          // pagination={{
          //   ...tableProps.pagination,
          //   showTotal: (total) => `共 ${total} 条`,
          //   showSizeChanger: true,
          
          //   defaultPageSize: 20,
          // }}
          extraNode={
            <Space style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <h3>列表</h3>
            
            </Space>
          }
          className="table-form"
          onSearch={submit}
          expandable={{
            expandedRowRender: record => <p style={{ margin: 4 }}>
              <Table dataSource={record?.backupResult||[]}>
                <Table.Column dataIndex="filename"  title="备份文件名称"/>
                <Table.Column dataIndex="fileSize" title="备份文件大小"/>
                <Table.Column dataIndex="lastModified" title="最后修改时间"/>
              </Table>
            </p>,
           
          }}
          reset={reset}
          // scroll={tableProps.dataSource.length > 0 ? { x: '100%' } : {}}
          searchText="查询"
        />
      </PageContainer>
    );
  }
  
