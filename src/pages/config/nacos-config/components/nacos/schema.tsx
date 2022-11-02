import { Space,  Tooltip ,Tag,Popconfirm} from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { FormProps, } from '@/components/table-search/typing';
import { datetimeCellRender } from '@/utils';
export const formatTypeOptions=[
  { label: 'TEXT', value:"text"  },
  { label: 'JSON', value: "json" },
  { label: 'XML', value: "xml" },
  { label: 'YAML', value: "yaml"},
  { label: 'HTML', value: "html" },
 
]
export const policyTypeOptions=[
  { label: '终止导入', value: "ABORT" },
  { label: '跳过', value: "SKIP" },
  { label: '覆盖', value:"OVERWRITE"  },
 
 
  
 
]
// 列表页-表格
export const createTableColumns = (params: {
    onEdit: (record: any, index: number) => void;
    onView: (record: any, index: number) => void;
    onDelete: (record: any, index: number) => void;
  }) => {
    return [
      {
        title: 'Data Id',
        dataIndex: 'dataId',
        key: 'dataId',
        width: '30%',
       // width: 80,
      },
      {
        title: 'Group',
        dataIndex: 'groupId',
        key: 'groupId',
         width: '28%',
        //width: 120,
       
      },
      {
        title: '归属应用',
        dataIndex: 'appName',
        key: 'appName',
         width: '28%',
        //width: 280,
      },
     
  
      {
        title: '操作',
        fixed: 'right',
        dataIndex: 'option',
        key: 'option',
        align: 'center',
        width: '14%',
        render: (_: string, record, index: number) => (
          //根据不同类型跳转
          <Space>
            <a onClick={() => params.onView(record, index)}>详情</a>
            <a onClick={() => params.onEdit(record, index)}>编辑</a>
            <Popconfirm
            title="确认删除吗?"
            onConfirm={() => {
              params?.onDelete(record, index)
             
            }}
          >
            <a style={{color:"red"}}>删除</a>
          </Popconfirm>
          </Space>
        ),
      },
    ] as ColumnsType<any>;
  };