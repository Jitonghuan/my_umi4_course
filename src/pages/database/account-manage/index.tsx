import React, { useMemo, useEffect, useState } from 'react';
import PageContainer from '@/components/page-container';
import TableSearch from '@/components/table-search';
import { Button, Space, Form } from 'antd';
import { getAccountList } from '../service';
import useTable from '@/utils/useTable';
import { createTableColumns } from './schema';
import CreateAccount from './components/create-account';
import UpdatePassword from './components/update-password';
import { useDeleteAccount } from './hook';
import GrantModal from './components/grant';
export interface AccountProps {
  clusterId: number;
}
export default function AccountList(props: AccountProps) {
  //clusterId={clusterId}
  const [form] = Form.useForm();
  const { clusterId } = props;
  const [mode, setMode] = useState<EditorMode>('HIDE');
  const [updateMode, setUpdateMode] = useState<EditorMode>('HIDE');
  const [grantMode, setGrantMode] = useState<EditorMode>('HIDE');
  const [delLoading, deleteAccount] = useDeleteAccount();
  const [curId, setCurId] = useState<any>();
  const [curRecord, setCurRecord] = useState<any>({});
  useEffect(() => {
    if (!clusterId) return;
  }, [clusterId]);

  const columns = useMemo(() => {
    return createTableColumns({
      onDelete: async (id) => {
        deleteAccount({ clusterId, id }).then(() => {
          reset();
        });
      },
      onUpdate: (id) => {
        setCurId(id);
        setUpdateMode('EDIT');
      },
      onGrant: (record) => {
        setCurRecord({ ...record, grantType: 1 });
        setGrantMode('ADD');
      },
      onRecovery: (record) => {
        setCurRecord({ ...record, grantType: 2 });
        setGrantMode('EDIT');
      },
      deleteLoading: delLoading,
    }) as any;
  }, []);
  const {
    tableProps,
    search: { submit, reset },
  } = useTable({
    url: getAccountList,
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
    <PageContainer>
      <CreateAccount
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
      <UpdatePassword
        mode={updateMode}
        curId={curId}
        clusterId={clusterId}
        onClose={() => {
          setUpdateMode('HIDE');
        }}
        onSave={() => {
          setUpdateMode('HIDE');
          reset();
        }}
      />
      <GrantModal
        mode={grantMode}
        clusterId={clusterId}
        curRecord={curRecord}
        onClose={() => {
          setGrantMode('HIDE');
        }}
        onSave={() => {
          setGrantMode('HIDE');
        }}
      />
      <TableSearch
        bordered
        splitLayout={false}
        columns={columns}
        {...tableProps}
        pagination={{
          ...tableProps.pagination,
          showTotal: (total) => `共 ${total} 条`,
          showSizeChanger: true,
          size: 'small',
          defaultPageSize: 20,
        }}
        extraNode={
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <Button
              type="primary"
              ghost
              onClick={() => {
                setMode('ADD');
              }}
            >
              创建账号
            </Button>
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
