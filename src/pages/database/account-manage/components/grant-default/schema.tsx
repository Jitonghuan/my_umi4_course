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
      renderFormItem: (text, record, _, action) => {
       
        return (
          <Select
            options={params?.schemaOptions}
            showSearch
            allowClear
            // onChange={()=>{ params?.onChangeSave(record,action)}}
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
      
        return (
          <Select
            options={schemaDataTreeOption}
            showSearch
            // onChange={()=>{ params?.onChangeSave(record,action)}}
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
    value: 'SELECT',
    label: 'SELECT',
  },
  {
    value: 'INSERT',
    label: 'INSERT',
  },
  {
    value: 'UPDATE',
    label: 'UPDATE',
  },
  {
    value: 'DELETE',
    label: 'DELETE',
  },
  {
    value: 'CREATE',
    label: 'CREATE',
  },
  {
    value: 'ALTER',
    label: 'ALTER',
  },
  {
    value: 'INDEX',
    label: 'INDEX',
  },
  {
    value: 'DROP',
    label: 'DROP',
  },
  {
    value: 'CREATE TEMPORARY TABLES',
    label: 'CREATE TEMPORARY TABLES',
  },
  {
    value: 'SHOW VIEW',
    label: 'SHOW VIEW',
  },
  {
    value: 'CREATE ROUTINE',
    label: 'CREATE ROUTINE',
  },
  {
    value: 'ALTER ROUTINE',
    label: 'ALTER ROUTINE',
  },
  {
    value: 'EXECUT',
    label: 'EXECUTE',
  },
  {
    value: 'CREATE VIEW',
    label: 'CREATE VIEW',
  },
  {
    value: 'ENVENT',
    label: 'ENVENT',
  },
  {
    value: 'TRIGGER',
    label: 'TRIGGER',
  },
  {
    value: 'GRANT',
    label: 'GRANT',
  },
  {
    value: 'LOCK TABLES',
    label: 'LOCK TABLES',
  },
  {
    value: 'REFERENCES',
    label: 'REFERENCES',
  },
];


export const columnOption=[
  {
    value: 'SELECT',
    label: 'SELECT',
  },
  {
    value: 'INSERT',
    label: 'INSERT',
  },
  {
    value: 'UPDATE',
    label: 'UPDATE',
  },
  {
    value: 'REFERENCES',
    label: 'REFERENCES',
  },
]

export const tableOption =[
  {
    value: 'SELECT',
    label: 'SELECT',
  },
  {
    value: 'INSERT',
    label: 'INSERT',
  },
  {
    value: 'UPDATE',
    label: 'UPDATE',
  },
  {
    value: 'DELETE',
    label: 'DELETE',
  },
  {
    value: 'CREATE',
    label: 'CREATE',
  },
  {
    value: 'ALTER',
    label: 'ALTER',
  },
  {
    value: 'INDEX',
    label: 'INDEX',
  },
  {
    value: 'DROP',
    label: 'DROP',
  },
  {
    value: 'SHOW VIEW',
    label: 'SHOW VIEW',
  },
  {
    value: 'CREATE VIEW',
    label: 'CREATE VIEW',
  },
  {
    value: 'TRIGGER',
    label: 'TRIGGER',
  },
  {
    value: 'GRANT',
    label: 'GRANT',
  },
  
  {
    value: 'REFERENCES',
    label: 'REFERENCES',
  },
]




