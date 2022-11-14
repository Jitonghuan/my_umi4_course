import React, { useMemo, useState } from 'react';
import PageContainer from '@/components/page-container';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import TableSearch from '@/components/table-search';
import { createTableColumns,typeOptions} from './schema';
import useTable from '@/utils/useTable';
import { Button, Space, Form } from 'antd';
import * as APIS from '../../../service';
import './index.less'
//getRuleSetListApi
export default function SafeList(){
    const [mode, setMode] = useState<EditorMode>('HIDE');
    const [form] = Form.useForm();

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
      },
    
      onDelete: async (id) => {
       
      },
     
    }) as any;
  }, []);
    return(
        <div className="safe-list-content">
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