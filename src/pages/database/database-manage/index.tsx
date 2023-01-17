import React, { useMemo, useEffect, useState,useContext } from 'react';
import PageContainer from '@/components/page-container';
import TableSearch from '@/components/table-search';
import { Button, Modal, Form, Input, message,Space } from 'antd';
import useTable from '@/utils/useTable';
import { createTableColumns,readonlyColumns } from './schema';
import CreateDataBase from './create-database';
import { getSchemaList } from '../service';
import {buttonPession} from "@/pages/database/utils"
import { useDeleteSchema } from './hook';
import { FeContext } from '@/common/hooks';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useSyncMetaData } from '../instance-list/hook';
import DetailContext from '../instance-list/components/instance-info/context';
import './index.less';
// export interface SchemaProps {
//   clusterId: number;
//   clusterRole:number
// }

export default function DataBasePage(props:any) {
  const [form] = Form.useForm();
  // const { clusterId ,clusterRole} = props;
  const [ensureForm] = Form.useForm();
  const { btnPermission } = useContext(FeContext)
  const [mode, setMode] = useState<EditorMode>('HIDE');
  const [delLoading, deleteSchema] = useDeleteSchema();
  const [syncLoading, syncMetaData] = useSyncMetaData();
  const {clusterId,clusterRole}=useContext(DetailContext)
  //matrix:1011:new-database-delete
  const canDelete = useMemo(() => btnPermission.includes('matrix:1011:new-database-delete'), [btnPermission])
  
  useEffect(() => {
    if (!clusterId) return;
  }, [clusterId]);
  const readonlyTableColumns=useMemo(()=>{
    return readonlyColumns() as any;
  },[])
  const columns = useMemo(() => {
    
    return createTableColumns({
      onDelete: async (record) => {
        ensureModal(record);
      },
      delLoading: delLoading,
      canDelete,
    }) as any;
  }, [clusterRole,canDelete]);

  const ensureModal = (record: any) => {
    // ensureForm.resetFields();
    Modal.confirm({
      title: '确定删除该数据库吗？',
      icon: <ExclamationCircleOutlined />,
      content: (
        <>
          <p>
            您确定要删除此数据库吗？如果是这样，<b>请在此输入数据库名称</b>(
            <span style={{ color: 'red' }}>{record?.name}</span>)并点击确认删除数据库按钮
          </p>
          <Form form={ensureForm} preserve={false}>
            <Form.Item name="schema">
              <Input />
            </Form.Item>
          </Form>
          <span>注意：生产环境禁止直接删除数据库！</span>
        </>
      ),
      okText: '确认删除数据库',
      onOk: async () => {
        const ensure = record?.name === ensureForm.getFieldsValue()?.schema;
        if (!ensure) {
          message.warning('数据库名不一致！');
        } else {
          await deleteSchema({ clusterId, id: record?.id }).then(() => {
            reset();
          });
        }
      },
    });
  };
  const {
    tableProps,
    search: { submit, reset },
  } = useTable({
    url: getSchemaList,
    method: 'GET',
    form,
    formatter: (params) => {
      return {
        ...params,
        clusterId,
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
    <PageContainer className="database-card">
      <CreateDataBase
        mode={mode}
        clusterId={clusterId}
        onClose={() => {
          setMode('HIDE');
        }}
        onSave={() => {
          setMode('HIDE');
          reset();
        }}
      />

      <TableSearch
        bordered
        form={form}
        // splitLayout={false}
        formLayout="inline"
        columns={clusterRole===3? columns:readonlyTableColumns}
        {...tableProps}
        formOptions={[
          {
            key: '1',
            type: 'input',
            label: '数据库名称',
            dataIndex: 'dbName',
            width: '200px',
            placeholder: '请输入',
            
          },
          // {
          //   key: '2',
          //   type: 'input',
          //   label: '授权账号',
          //   dataIndex: 'owner',
          //   width: '200px',
          //   placeholder: '请输入',
            
          // },
        ]}
        pagination={{
          ...tableProps.pagination,
          showTotal: (total) => `共 ${total} 条`,
          showSizeChanger: true,
          // size: 'small',
          defaultPageSize: 20,
        }}
        extraNode={
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <Space>
              {buttonPession("matrix:1009:sync-data")&&  <Button
                type="primary"
                loading={syncLoading}
                onClick={() => {
                  syncMetaData({ clusterId });
                }}
              >
                同步元数据
              </Button>}
          
              {clusterRole===3&&buttonPession("matrix:1010:new-database-add")&&    <Button
              type="primary"
              ghost
              onClick={() => {
                setMode('ADD');
              }}
            >
              创建数据库
            </Button>}
           
            </Space>
           
          </div>
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
