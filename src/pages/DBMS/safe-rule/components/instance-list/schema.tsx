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
// 列表页-表格
export const createTableColumns = (params: {
    onEdit: (record: any, index: number) => void;
   
   
  }) => {
    return [
      {
        title: '实例ID',
        dataIndex: 'id',
        key: 'id',
        width: '6%',
      },
      {
        title: '实例名称',
        dataIndex: 'instanceName',
        key: 'instanceName',
        width: '14%',
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
        title: '环境Code',
        dataIndex: 'envCode',
        key: 'envCode',
        width: '20%',
       // render: (value) => <>{} </>,
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
            
          </Space>
        ),
      },
    ] as ColumnsType<any>;
  };
  