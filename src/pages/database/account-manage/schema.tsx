/*
 * @Author: muxi.jth 2016670689@qq.com
 * @Date: 2022-07-07 17:02:02
 * @LastEditors: muxi.jth 2016670689@qq.com
 * @LastEditTime: 2022-07-12 16:44:20
 * @FilePath: /fe-matrix/src/pages/database/account-manage/schema.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Space, Tag, Popconfirm, Spin, Modal, Form ,Tooltip} from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { ExclamationCircleOutlined } from '@ant-design/icons';
export const readonlyColumns=()=>{
  return [
    {
      title: '账号',
      dataIndex: 'user',
      key: 'user',
      width: '35%',
      ellipsis:true,
      render:(value)=><Tooltip title={value}>
        <span>{value}</span>
      </Tooltip>
    },
    {
      title: 'HOST',
      dataIndex: 'host',
      key: 'host',
      width: '15%',
    },
    {
      title: '权限',
      dataIndex: 'grantPrivs',
      key: 'grantPrivs',
      width: '35%',
      ellipsis:true,
      render: (grantPrivs: any, record, index: number) =>{
        return <Tooltip placement="topLeft" title= { grantPrivs?.map((item: string) => {
          return <p>{item};</p>;
        })}>
         { grantPrivs?.map((item: string) => {
          return <span>{item};</span>;
        })}</Tooltip>
      }
      ,
    },
    {
      title: '备注',
      dataIndex: 'description',
      key: 'description',
      width: '15%',
      ellipsis:true,
      render:(value)=><Tooltip title={value}>
        <span>{value}</span>
      </Tooltip>
    },

  ]
}

// 列表页-表格
export const createTableColumns = (params: {
  clusterRole:number,
  onDelete: (record: any) => void;
  onUpdate: (id: any) => void;
  onGrant: (record: any) => void;
  onRecovery: (record: any) => void;
  deleteLoading: boolean;
}) => {
  return [
    {
      title: '账号',
      dataIndex: 'user',
      key: 'user',
      width: '8%',
      ellipsis:true,
      render:(value)=><Tooltip title={value}>
        <span>{value}</span>
      </Tooltip>
    },
    {
      title: 'HOST',
      dataIndex: 'host',
      key: 'host',
      width: '6%',
    },
    {
      title: '权限',
      dataIndex: 'grantPrivs',
      key: 'grantPrivs',
      width: '34%',
      ellipsis:true,
      render: (grantPrivs: any, record, index: number) =>{
        return <Tooltip placement="topLeft" title= { grantPrivs?.map((item: string) => {
          return <p>{item};</p>;
        })}>
         { grantPrivs?.map((item: string) => {
          return <span>{item};</span>;
        })}</Tooltip>
      }
      ,
    },
    {
      title: '备注',
      dataIndex: 'description',
      key: 'description',
      width: '8%',
      ellipsis:true,
      render:(value)=><Tooltip title={value}>
        <span>{value}</span>
      </Tooltip>
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      width: '10%',
      render: (_: string, record, index: number) => (
        //根据不同类型跳转
        <Space>
          <a
         
            onClick={() => {
              params?.onGrant(record);
            }}
          >
            权限管理
          </a>
          {/* <a
          
            onClick={() => {
              params?.onRecovery(record);
            }}
          >
            回收
          </a> */}
          <a
         
            onClick={() => {
              params?.onUpdate(record.id);
            }}
          >
            改密
          </a>
          <Popconfirm
            title="确认删除?"
            onConfirm={() => {
              params?.onDelete(record);
            }}
           
          >
            <Spin spinning={params?.deleteLoading}>
              <a >删除</a>
            </Spin>
          </Popconfirm>
        </Space>
      ),
    },
  ] as ColumnsType<any>;
};

export const privTypeOptions = [
  {
    label: '全局权限',
    value: 'global',
  },
  {
    label: '库权限',
    value: 'schema',
  },
];

export const schemaDataTreeOption = [
  {
    key: 'select',
    title: 'SELECT',
  },
  {
    key: 'insert',
    title: 'INSERT',
  },
  {
    key: 'update',
    title: 'UPDATE',
  },
  {
    key: 'delete',
    title: 'DELETE',
  },
];
export const globalDataTreeOption = [
  {
    key: 'select',
    title: 'SELECT',
  },
  {
    key: 'insert',
    title: 'INSERT',
  },
  {
    key: 'update',
    title: 'UPDATE',
  },
  {
    key: 'delete',
    title: 'DELETE',
  },
  {
    key: 'file',
    title: 'FILE',
  },
];
export const schemaStructOption = [
  {
    key: 'create',
    title: 'CREATE',
  },
  {
    key: 'alter',
    title: 'ALTER',
  },
  {
    key: 'index',
    title: 'INDEX',
  },
  {
    key: 'drop',
    title: 'DROP',
  },
  {
    key: 'create temporary tables',
    title: 'CREATE TEMPORARY TABLES',
  },
  {
    key: 'show view',
    title: 'SHOW VIEW',
  },
  {
    key: 'create routime',
    title: 'CREATE ROUTINE',
  },
  {
    key: 'alter routine',
    title: 'ALTER ROUTINE',
  },
  {
    key: 'execute',
    title: 'EXECUTE',
  },
  {
    key: 'create view',
    title: 'CREATE VIEW',
  },
  {
    key: 'envent',
    title: 'ENVENT',
  },
  {
    key: 'trigger',
    title: 'TRIGGER',
  },
];
export const schemaManageOption = [
  {
    key: 'grant',
    title: 'GRANT',
  },
  {
    key: 'lcok tables',
    title: 'LOCK TABLES',
  },
  {
    key: 'references',
    title: 'REFERENCES',
  },
];
export const globalManageOption = [
  {
    key: 'grant',
    title: 'GRANT',
  },
  {
    key: 'super',
    title: 'SUPER',
  },
  {
    key: 'process',
    title: 'PROCESS',
  },
  {
    key: 'reload',
    title: 'RELOAD',
  },
  {
    key: 'shutdown',
    title: 'SHUTDOWN',
  },
  {
    key: 'show databases',
    title: 'SHOW DATABASES',
  },
  {
    key: 'lcok tables',
    title: 'LOCK TABLES',
  },
  {
    key: 'references',
    title: 'REFERENCES',
  },
  {
    key: 'replication client',
    title: 'REPLICATION CLIENT',
  },
  {
    key: 'replication slave',
    title: 'REPLICATION SLAVE',
  },
  {
    key: 'create user',
    title: 'CREATE USER',
  },
];
