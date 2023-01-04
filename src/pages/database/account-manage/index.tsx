import React, { useMemo, useEffect, useState,useContext } from 'react';
import PageContainer from '@/components/page-container';
import TableSearch from '@/components/table-search';
import { Button, Modal, Form, Input, message } from 'antd';
import { getAccountList } from '../service';
import useTable from '@/utils/useTable';
import { createTableColumns ,readonlyColumns} from './schema';
import CreateAccount from './components/create-account';
import UpdatePassword from './components/update-password';
import { useDeleteAccount } from './hook';
import GrantModal from './components/grant-default';
import  DetailContext  from '../instance-list/components/instance-info/context'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import './index.less';
// export interface AccountProps {
//   clusterId: number;
//   clusterRole:number
// }
export default function AccountList(props:any) {
 
  const [form] = Form.useForm();
  const [ensureForm] = Form.useForm();
  // const { clusterId ,clusterRole} = props;
  const [mode, setMode] = useState<EditorMode>('HIDE');
  const [updateMode, setUpdateMode] = useState<EditorMode>('HIDE');
  const [grantMode, setGrantMode] = useState<EditorMode>('HIDE');
  const [delLoading, deleteAccount] = useDeleteAccount();
  const [curId, setCurId] = useState<any>();
  const [curRecord, setCurRecord] = useState<any>({});
  const {clusterId,clusterRole}=useContext(DetailContext)
  useEffect(() => {
    if (!clusterId) return;
  }, [clusterId]);
  const readonlyTableColumns=useMemo(()=>{
    return readonlyColumns() as any
  },[])

  const columns = useMemo(() => {
    return createTableColumns({
      clusterRole,
      onDelete: async (record) => {
        ensureModal(record);
      },
      onUpdate: (id) => {
        setCurId(id);
        setUpdateMode('EDIT');
      },
      onGrant: (record) => {
        setCurRecord({ ...record });
        setGrantMode('ADD');
      },
      // onRecovery: (record) => {
      //   setCurRecord({ ...record, grantType: 2 });
      //   setGrantMode('EDIT');
      // },
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
      //  let dataSource= result.data?.dataSource;
      //  let dataArry:any=[]
      //  dataSource?.map((item:any)=>{
      //   dataArry.push({
      //     userAccount:`${item?.user}@${item?.host}`,
      //     ...item
      //   })

      //  })

      return {
        total: result.data?.pageInfo?.total,
        list: result.data?.dataSource || [],
      };
    },
  });
  const ensureModal = (record: any) => {
    // ensureForm.resetFields();
    Modal.confirm({
      title: '确定删除该数据库账号吗？',
      icon: <ExclamationCircleOutlined />,
      content: (
        <>
          <p>
            您确定要删除此数据库账号吗？如果是这样，<b>请在此输入数据库账号</b>(
            <span style={{ color: 'red' }}>{record?.user}</span>)并点击确认删除数据库账号按钮
          </p>
          <Form form={ensureForm} preserve={false}>
            <Form.Item name="account">
              <Input />
            </Form.Item>
          </Form>
          <span>注意：生产环境禁止直接删除数据库账号！</span>
        </>
      ),
      okText: '确认删除数据库账号',
      onOk: async () => {
        const ensure = record?.user === ensureForm.getFieldsValue()?.account;
        if (!ensure) {
          message.warning('账号不一致！');
        } else {
          await deleteAccount({ clusterId, id: record?.id }).then(() => {
            reset();
          });
        }
      },
    });
  };

  return (
    <PageContainer className="account-card">
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
          reset();
        }}
      />
      <TableSearch
        bordered
        form={form}
        formLayout="inline"
        // splitLayout={false}
        formOptions={[
          {
            key: '1',
            type: 'input',
            label: '账号',
            dataIndex: 'user',
            width: '200px',
            placeholder: '请输入',
            
          },
         
        ]}
        columns={  clusterRole===3?columns:readonlyTableColumns}
        {...tableProps}
        pagination={{
          ...tableProps.pagination,
          showTotal: (total) => `共 ${total} 条`,
          showSizeChanger: true,
          // size: 'small',
          defaultPageSize: 20,
        }}
        extraNode={
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
           {clusterRole===3 && <Button
              type="primary"
              onClick={() => {
                setMode('ADD');
              }}
            >
              创建账号
            </Button>}
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
