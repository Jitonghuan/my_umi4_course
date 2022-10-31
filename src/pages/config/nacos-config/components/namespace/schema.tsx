import { Space,  Tooltip ,Tag,Popconfirm} from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { FormProps, } from '@/components/table-search/typing';
import { datetimeCellRender } from '@/utils';
// 列表页-表格
export const createTableColumns = (params: {
    onEdit: (record: any, index: number) => void;
    onView: (record: any, index: number) => void;
    onDelete: (record: any, index: number) => void;
  }) => {
    return [
      {
        title: '命名空间名称',
        dataIndex: 'namespaceShowName',
        key: 'namespaceShowName',
        width: 280,
      },
      {
        title: '命名空间ID',
        dataIndex: 'namespaceId',
        key: 'namespaceId',
        width: 160,
        
      },
      {
        title: '配置数',
        dataIndex: 'configCount',
        key: 'configCount',
        // width: '13%',
        width: 280,
      },
     
  
      {
        title: '操作',
        fixed: 'right',
        dataIndex: 'option',
        key: 'option',
        align: 'center',
        width: 90,
        render: (_: string, record, index: number) => (
          //根据不同类型跳转
          <Space>
            <a onClick={() => params.onView(record, index)} >详情</a>
            <a onClick={() =>{
              if(record?.type!==0){
                params.onEdit(record, index)
              }
             
            } } style={{cursor:record?.type===0?'no-drop':'pointer',color:record?.type===0?'gray':'#3591ff'}}>编辑</a>
            <Popconfirm
            title="确认删除吗?"
            disabled={record?.type===0}
            onConfirm={() => {
              params?.onDelete(record, index)



             
            }}
          >
            <a style={{cursor:record?.type===0?'no-drop':'pointer',color:record?.type===0?'gray':'red'}}>删除</a>
          </Popconfirm>
          </Space>
        ),
      },
    ] as ColumnsType<any>;
  };