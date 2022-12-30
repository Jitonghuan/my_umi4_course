import React, { useMemo, useState,useEffect } from 'react';
import PageContainer from '@/components/page-container';
import TableSearch from '@/components/table-search';
import { Button, Space, Form } from 'antd';
import { createTableColumns,  } from '../schema';
import useTable from '@/utils/useTable';
import CreatPlan from './create-plan';
import * as APIS from '../../service';
import {useDeleteBackupPlan,useGetBackupTypeList} from '../hook'
export default function AdminList() {
    const [form] = Form.useForm();
    const [mode, setMode] = useState<EditorMode>('HIDE');
    const [curRecord, setcurRecord] = useState<any>({});
    const [delLoading, deleteBackupPlan] = useDeleteBackupPlan();
    const [loading, typeOptions,getBackupTypeList]=useGetBackupTypeList()
    useEffect(()=>{
      getBackupTypeList()
    },[])
    const columns = useMemo(() => {
      return createTableColumns({
        onEdit: (record, index) => {
          setcurRecord(record);
          setMode('EDIT');
        },
        onDelete: async (id) => {
          await deleteBackupPlan({ id }).then(() => {
            submit();
          });
        },
      
      }) as any;
    }, []);
  
    const {
      tableProps,
      search: { submit, reset },
    } = useTable({
      url: APIS.getBackupPlan,
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
  
    return (
      <PageContainer>
        <CreatPlan
          mode={mode}
          initData={curRecord}
          onClose={() => {
            setMode('HIDE');
          }}
          onSave={() => {
            setMode('HIDE');
            reset();
          }}
        />
  
        <TableSearch
          form={form}
          bordered
          formOptions={[
         
            {
                key: '1',
                type: 'input',
                label: '备份名称',
                dataIndex: 'backupName',
                width: '200px',
                placeholder: '请输入',
                // option: [],
              },
              {
                key: '2',
                type: 'select',
                label: '备份类型',
                dataIndex: 'backupType',
                width: '200px',
                placeholder: '请选择',
                option: typeOptions,
              },
          ]}
          formLayout="inline"
          columns={columns}
          {...tableProps}
          pagination={{
            ...tableProps.pagination,
            showTotal: (total) => `共 ${total} 条`,
            showSizeChanger: true,
            defaultPageSize: 20,
          }}
          loading={delLoading}
          extraNode={
            <Space style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <h3>列表</h3>
              <Button
                type="primary"
                onClick={() => {
                  setMode('ADD');
                }}
              >
                + 新建备份计划
              </Button>
            </Space>
          }
          className="table-form"
          onSearch={submit}
          reset={reset}
          // scroll={tableProps.dataSource.length > 0 ? { x: '100%' } : {}}
          searchText="查询"
        />
      </PageContainer>
    );
  }
  
