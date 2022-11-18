import { datetimeCellRender } from '@/utils';
import { FormProps } from '@/components/table-search/typing';
import { Space, Popconfirm, Tooltip, Tag } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
export const typeOptions=[
    {
        label:"MySQL",
        value:"mysql",
        key:"mysql"
    }
]
export const envTypeData = [
  {
    label: 'DEV',
    value: 'dev',
    key:"dev"
  },
  {
    label: 'TEST',
    value: 'test',
    key:"test"
  },
  {
    label: 'PRE',
    value: 'pre',
    key:"pre"
  },
  {
    label: 'PROD',
    value: 'prod',
    key:"prod"
  },
];

export const editColumns = [
  // {
  //   title: '步骤',
  //   dataIndex: 'step',
  //   editable: false,
  //   width: '15%',
  // },
  {
    title: '节点名称',
    dataIndex: 'name',
    key: 'name',
    editable: true,
    width: '60%',
  },
  {
      title: '库环境',
      dataIndex: 'envType',
      key: 'envType',
      fieldType: 'select',
      editable: true,
      width: '30%',
      valueOptions: envTypeData,

    },
];
// 列表页-表格
export const createTableColumns = (params: {
    onEdit: (record: any, index: number) => void;
    onDelete: (record: any) => void;
   
  }) => {
    return [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: '4%',
      },
      {
        title: '名称',
        dataIndex: 'ruleSetName',
        key: 'ruleSetName',
        width: '30%',
      },
      {
        title: '引擎类型',
        dataIndex: 'engineType',
        key: 'engineType',
        width: '40%',
        ellipsis: true,
        render: (text) => <Tooltip title={text}><Tag>{text}</Tag></Tooltip>,
      },
     
      {
        title: '操作',
        dataIndex: 'option',
        key: 'option',
        width: '12%',
        render: (_: string, record, index: number) => (
          //根据不同类型跳转
          <Space>
          
            <a onClick={() => params.onEdit(record, index)}>编辑</a>
            <Popconfirm
              title="确认删除?"
              onConfirm={() => {
                params?.onDelete(record.id);
              }}
            >
              <a style={{color:"red"}}>删除</a>
            </Popconfirm>
          </Space>
        ),
      },
    ] as ColumnsType<any>;
  };
  