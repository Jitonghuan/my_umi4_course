import type { ColumnsType } from 'antd/es/table';
import { Select,Tag} from 'antd';

export interface DataType {
  id: React.Key;
  readonly?: string;
  key: React.Key;
  title: string;
}
export const columns: ColumnsType<DataType> = [
  {
    title: '权限类型',
    dataIndex: 'title',
  },
];

export const createDatabseEditColumns = (params: {
  schemaOptions: any;
  onEdit: (record: any, action: any,) => void;
  onDelete:(record:any)=>void;
}) => {
  return [
   
    {
      title: '库名',
      dataIndex: 'dbName',
      key: 'dbName',
      width:300,
      formItemProps: () => {
        return {
          rules: [
            {
              required: true,
              message: '此项为必填项',
            },
          ],
          errorType: 'default',
        };
      },
      renderFormItem: () => {

        return (
          <Select
            options={params?.schemaOptions}
            showSearch
            allowClear
            optionFilterProp="label"
           
          />
        );
      },
    },
  
   
    {
      title: '权限',
      key: 'privs',
      dataIndex: 'privs',
      valueType: 'select',
      formItemProps: () => {
        return {
          rules: [
            {
              required: true,
              message: '此项为必填项',
            },
          ],
          errorType: 'default',
        };
      },
      render: (_, row) => row?.privs?.map((item) => <Tag  key={item}>{item}</Tag>),
      renderFormItem: (text, record, _, action) => {
        console.log("record",record)
        return (
          <Select
            options={schemaDataTreeOption}
            showSearch
            mode="multiple"
            allowClear
          ></Select>
        );
      },
    },
    {
      title: '操作',
      valueType: 'option',
      width: 100,
      render: (text, record, _, action) => [
        <a
        key="editable"
        onClick={() => {
          debugger
        params?.onEdit(record,action)
        
        }}
      >
        编辑
      </a>,
     
        <a
          key="delete"
          onClick={() => {
          params?.onDelete(record)
          }}
        >
          删除
        </a>,
      ],
    },
  
  ] 
}

export const createTableEditColumns = (params: {
  schemaOptions: any
  tableOptions:any
  onDataBaseChange:(value:string)=>void;
  onDelete:(record:any)=>void;
}) => {
  return [
    {
      title: '库名',
      dataIndex: 'dbName',
      key: 'dbName',
      width:300,
      formItemProps: () => {
        return {
          rules: [
            {
              required: true,
              message: '此项为必填项',
            },
          ],
          errorType: 'default',
        };
      },
      renderFormItem: () => {

        return (
          <Select
            options={params?.schemaOptions}
            showSearch
            allowClear
            optionFilterProp="label"
            onChange={(param: any) => {
              params?.onDataBaseChange(param)
            }}
          />
        );
      },
    },
    {
      title: '表名',
      key: 'tableName',
      dataIndex: 'tableName',
      valueType: 'select',
      width:300,
      formItemProps: () => {
        return {
          rules: [
            {
              required: true,
              message: '此项为必填项',
            },
          ],
          errorType: 'default',
        };
      },
      renderFormItem: () => {
        return (
          <Select
            options={params?.tableOptions}
            showSearch
            allowClear
          ></Select>
        );
      },
    },
   
    {
      title: '权限',
      key: 'privs',
      dataIndex: 'privs',
      valueType: 'select',
      formItemProps: () => {
        return {
          rules: [
            {
              required: true,
              message: '此项为必填项',
            },
          ],
          errorType: 'default',
        };
      },
      render: (_, row) => row?.privs?.map((item) => <Tag  key={item}>{item}</Tag>),
      renderFormItem: () => {
        return (
          <Select
            options={tableOption}
            showSearch
            mode="multiple"
            allowClear
          ></Select>
        );
      },
    },
    {
      title: '操作',
      valueType: 'option',
      width: 100,
      render: (text, record, _, action) => [
      
        <a
          key="delete"
          onClick={() => {
          params?.onDelete(record)
          }}
        >
          删除
        </a>,
      ],
    },
  
  ] 
}

export const createEditColumns = (params: {
  schemaOptions: any;
  tableOptions:any
  columnOptions:any
  onDataBaseChange:(value:string)=>void
  onTableChange:(database:string,table:string)=>void
  onDelete:(record:any)=>void;
}) => {
  return [
    {
      title: '库名',
      dataIndex: 'dbName',
      key: 'dbName',
      width:300,
      formItemProps: () => {
        return {
          rules: [
            {
              required: true,
              message: '此项为必填项',
            },
          ],
          errorType: 'default',
        };
      },
      renderFormItem: () => {

        return (
          <Select
            options={params?.schemaOptions}
            showSearch
            allowClear
            optionFilterProp="label"
            onChange={(param: any) => {
              params?.onDataBaseChange(param)
            }}
          />
        );
      },
    },
    {
      title: '表名',
      key: 'tableName',
      dataIndex: 'tableName',
      valueType: 'select',
      formItemProps: () => {
        return {
          rules: [
            {
              required: true,
              message: '此项为必填项',
            },
          ],
          errorType: 'default',
        };
      },
     
      renderFormItem: (_:any, config: any, data:any) => {
        return (
          <Select
            options={params?.tableOptions}
            showSearch
            allowClear
          onChange={(value: any) => {
            params?.onTableChange(config.record?.dbName,value)
          }}
          ></Select>
        );
      },
    },
    {
      title: '列名',
      key: 'columnName',
      dataIndex: 'columnName',
      valueType: 'select',
      formItemProps: () => {
        return {
          rules: [
            {
              required: true,
              message: '此项为必填项',
            },
          ],
          errorType: 'default',
        };
      },
      renderFormItem: () => {
      
        return (
          <Select
            options={params?.columnOptions}
            showSearch
            allowClear
          ></Select>
        );
      },
    },
    {
      title: '权限',
      key: 'privs',
      dataIndex: 'privs',
      valueType: 'select',
      formItemProps: () => {
        return {
          rules: [
            {
              required: true,
              message: '此项为必填项',
            },
          ],
          errorType: 'default',
        };
      },
      render: (_, row) => row?.privs?.map((item) => <Tag  key={item}>{item}</Tag>),
      renderFormItem: () => {
        return (
          <Select
            options={columnOption}
            showSearch
            mode="multiple"
            allowClear
          ></Select>
        );
      },
    },
    {
      title: '操作',
      valueType: 'option',
      width: 100,
      render: (text, record, _, action) => [
        <a
          key="delete"
          onClick={() => {
          params?.onDelete(record)
          }}
        >
          删除
        </a>,
      ],
    },
  ]
}



export const schemaDataTreeOption = [
  {
    value: 'select',
    label: 'SELECT',
  },
  {
    value: 'insert',
    label: 'INSERT',
  },
  {
    value: 'update',
    label: 'UPDATE',
  },
  {
    value: 'delete',
    label: 'DELETE',
  },
  {
    value: 'create',
    label: 'CREATE',
  },
  {
    value: 'alter',
    label: 'ALTER',
  },
  {
    value: 'index',
    label: 'INDEX',
  },
  {
    value: 'drop',
    label: 'DROP',
  },
  {
    value: 'create temporary tables',
    label: 'CREATE TEMPORARY TABLES',
  },
  {
    value: 'show view',
    label: 'SHOW VIEW',
  },
  {
    value: 'create routime',
    label: 'CREATE ROUTINE',
  },
  {
    value: 'alter routine',
    label: 'ALTER ROUTINE',
  },
  {
    value: 'execute',
    label: 'EXECUTE',
  },
  {
    value: 'create view',
    label: 'CREATE VIEW',
  },
  {
    value: 'envent',
    label: 'ENVENT',
  },
  {
    value: 'trigger',
    label: 'TRIGGER',
  },
  {
    value: 'grant',
    label: 'GRANT',
  },
  {
    value: 'lcok tables',
    label: 'LOCK TABLES',
  },
  {
    value: 'references',
    label: 'REFERENCES',
  },
];


export const columnOption=[
  {
    value: 'select',
    label: 'SELECT',
  },
  {
    value: 'insert',
    label: 'INSERT',
  },
  {
    value: 'update',
    label: 'UPDATE',
  },
  {
    value: 'references',
    label: 'REFERENCES',
  },
]

export const tableOption =[
  {
    value: 'select',
    label: 'SELECT',
  },
  {
    value: 'insert',
    label: 'INSERT',
  },
  {
    value: 'update',
    label: 'UPDATE',
  },
  {
    value: 'delete',
    label: 'DELETE',
  },
  {
    value: 'create',
    label: 'CREATE',
  },
  {
    value: 'alter',
    label: 'ALTER',
  },
  {
    value: 'index',
    label: 'INDEX',
  },
  {
    value: 'drop',
    label: 'DROP',
  },
  {
    value: 'show view',
    label: 'SHOW VIEW',
  },
  {
    value: 'create view',
    label: 'CREATE VIEW',
  },
  {
    value: 'trigger',
    label: 'TRIGGER',
  },
  {
    value: 'grant',
    label: 'GRANT',
  },
  
  {
    value: 'references',
    label: 'REFERENCES',
  },
]




