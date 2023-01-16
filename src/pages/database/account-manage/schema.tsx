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
  canManage:boolean,
  canEdit:boolean,
  canDelete:boolean,
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
          {params?.canManage&&  <a
         
         onClick={() => {
           params?.onGrant(record);
         }}
       >
         权限管理
       </a>}
        
          {/* <a
          
            onClick={() => {
              params?.onRecovery(record);
            }}
          >
            回收
          </a> */}
          {params?.canEdit&& <a
         
         onClick={() => {
           params?.onUpdate(record.id);
         }}
       >
         改密
       </a>}
       {params?.canDelete&&  <Popconfirm
            title="确认删除?"
            onConfirm={() => {
              params?.onDelete(record);
            }}
           
          >
            <Spin spinning={params?.deleteLoading}>
              <a >删除</a>
            </Spin>
          </Popconfirm>}
         

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
  {
    label: '表权限',
    value: 'table',
  },
  {
    label: '列权限',
    value: 'column',
  },
];

export const schemaDataTreeOption = [
  {
    key: 'SELECT',
    title: 'SELECT',
  },
  {
    key: 'INSERT',
    title: 'INSERT',
  },
  {
    key: 'UPDATE',
    title: 'UPDATE',
  },
  {
    key: 'DELETE',
    title: 'DELETE',
  },
];
export const globalDataTreeOption = [
  {
    key: 'SELECT',
    title: 'SELECT',
  },
  {
    key: 'INSERT',
    title: 'INSERT',
  },
  {
    key: 'UPDATE',
    title: 'UPDATE',
  },
  {
    key: 'DELETE',
    title: 'DELETE',
  },
  {
    key: 'FILE',
    title: 'FILE',
  },
];
export const schemaStructOption = [
  {
    key: 'CREATE',
    title: 'CREATE',
  },
  {
    key: 'ALTER',
    title: 'ALTER',
  },
  {
    key: 'INDEX',
    title: 'INDEX',
  },
  {
    key: 'DROP',
    title: 'DROP',
  },
  {
    key: 'CREATE TEMPORARY TABLES',
    title: 'CREATE TEMPORARY TABLES',
  },
  {
    key: 'SHOW VIEW',
    title: 'SHOW VIEW',
  },
  {
    key: 'CREATE ROUTINE',
    title: 'CREATE ROUTINE',
  },
  {
    key: 'ALTER ROUTINE',
    title: 'ALTER ROUTINE',
  },
  {
    key: 'EXECUTE',
    title: 'EXECUTE',
  },
  {
    key: 'CREATE VIEW',
    title: 'CREATE VIEW',
  },
  {
    key: 'ENVENT',
    title: 'ENVENT',
  },
  {
    key: 'TRIGGER',
    title: 'TRIGGER',
  },
];
export const schemaManageOption = [
  {
    key: 'GRANT OPTION',
    title: 'GRANT OPTION',
  },
  {
    key: 'LOCK TABLES',
    title: 'LOCK TABLES',
  },
  {
    key: 'REFERENCES',
    title: 'REFERENCES',
  },
];
export const globalManageOption = [
  {
    key: 'GRANT OPTION',
    title: 'GRANT OPTION',
  },
  {
    key: 'SUPER',
    title: 'SUPER',
  },
  {
    key: 'PROCESS',
    title: 'PROCESS',
  },
  {
    key: 'RELOAD',
    title: 'RELOAD',
  },
  {
    key: 'SHUTDOWN',
    title: 'SHUTDOWN',
  },
  {
    key: 'SHOW DATABASES',
    title: 'SHOW DATABASES',
  },
  {
    key: 'LOCK TABLES',
    title: 'LOCK TABLES',
  },
  {
    key: 'REFERENCES',
    title: 'REFERENCES',
  },
  {
    key: 'REPLICATION CLIENT',
    title: 'REPLICATION CLIENT',
  },
  {
    key: 'REPLICATION SLAVE',
    title: 'REPLICATION SLAVE',
  },
  {
    key: 'CREATE USER',
    title: 'CREATE USER',
  },
];

export const tableListOptions={
  0:[
    {
      key: 'SELECT',
      title: 'SELECT',
    },
    {
      key: 'INSERT',
      title: 'INSERT',
    },
    {
      key: 'UPDATE',
      title: 'UPDATE',
    },
    {
      key: 'DELETE',
      title: 'DELETE',
    },

  ],
  1:[
    {
      key: 'CREATE',
      title: 'CREATE',
    },
    {
      key: 'ALTER',
      title: 'ALTER',
    },
    {
      key: 'INDEX',
      title: 'INDEX',
    },
    {
      key: 'DROP',
      title: 'DROP',
    },
    {
      key: 'SHOW VIEW',
      title: 'SHOW VIEW',
    },
    {
      key: 'CREATE VIEW',
      title: 'CREATE VIEW',
    },
    {
      key: 'TRIGGER',
      title: 'TRIGGER',
    },
  ],
  2:[
    {
      key: 'GRANT OPTION',
      title: 'GRANT OPTION',
    },
  
    {
      key: 'REFERENCES',
      title: 'REFERENCES',
    },

  ]
}
export const columnListOptions={
  0:[
    {
      key: 'SELECT',
      title: 'SELECT',
    },
    {
      key: 'INSERT',
      title: 'INSERT',
    },
    {
      key: 'UPDATE',
      title: 'UPDATE',
    },

  ],
  1:[
    {
      key: 'REFERENCES',
      title: 'REFERENCES',
    },
  ],
  
}
