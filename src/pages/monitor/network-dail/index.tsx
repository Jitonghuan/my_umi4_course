import React, { useMemo, useState,useEffect } from 'react';
import PageContainer from '@/components/page-container';
import TableSearch from '@/components/table-search';
import { createTableColumns ,createFormColumns} from './schema';
import { Button, Space, Form } from 'antd';
import EditDail from './edit-dail'
import useTable from '@/utils/useTable';
import * as APIS from './service';
import {useGetNetworkProbeType,useGetCluster,useDelNetworkProbe} from './edit-dail/hook'
export default function NetworkDail(){
  const [form] = Form.useForm();
  const [curRecord, setcurRecord] = useState<any>({});
  const [mode, setMode] = useState<EditorMode>('HIDE');
  const [dailTypesLoading,dailTypes, getNetworkProbeProbeType]=useGetNetworkProbeType()
  const [clusterLoading,clusterData, getCluster]=useGetCluster()
  const [delLoading,deleteNetworkProbe]=useDelNetworkProbe()
  const columns = useMemo(() => {

    return createTableColumns({
      delLoading,
      onEdit: (record, index) => {
        setcurRecord(record);
        setMode('EDIT');
      },
      onView: (record, index) => {
        setcurRecord(record);
        setMode('VIEW');
      },
      onDelete: async (id) => {
        deleteNetworkProbe(id).then(()=>{
          submit()
        })
       
      },
     
    }) as any;
  }, []);
  useEffect(()=>{
    getNetworkProbeProbeType()
    getCluster()

  },[])
 

  const {
    tableProps,
    search: { submit, reset },
  } = useTable({
    url: APIS.getNetworkProbeList,
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


  const formOptions = useMemo(() => {
    return createFormColumns({
      dailTypesLoading,
      dailTypes,
      clusterData,
      onTypeChange:()=>{

      }
     
    });
  }, []);

    return(
        <PageContainer>
          <EditDail mode={mode} onSave={()=>{setMode("HIDE");submit()}} onClose={()=>{setMode("HIDE")}}/>
        <TableSearch
        form={form}
        bordered
        formOptions={formOptions}
        formLayout="inline"
        columns={columns}
        {...tableProps}
        pagination={{
          ...tableProps.pagination,
          showTotal: (total) => `共 ${total} 条`,
          showSizeChanger: true,
          // size: 'small',
          defaultPageSize: 20,
        }}
        extraNode={
          <Space style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <h3>网络拨测列表</h3>
            <Button
              type="primary"
              onClick={() => {
                setMode('ADD');
              }}
            >
              + 新增拨测
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
    )
}