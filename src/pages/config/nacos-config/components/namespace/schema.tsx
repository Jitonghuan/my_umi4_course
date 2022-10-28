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
        dataIndex: 'id',
        key: 'id',
        // width: '7%',
        width: 80,
      },
      {
        title: '命名空间ID',
        dataIndex: 'wfUserType',
        key: 'wfUserType',
        // width: '10%',
        width: 120,
        //"我审批的"
         render: (wfUserType) =>  <Tag color={wfUserType==="我审批的"?"#2db7f5":"pink"}>{wfUserType}</Tag>,
      },
      {
        title: '配置数',
        dataIndex: 'title',
        key: 'title',
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
            <a onClick={() => params.onView(record, index)}>详情</a>
            <a onClick={() => params.onEdit(record, index)}>编辑</a>
            <Popconfirm
            title="确认删除吗?"
            onConfirm={() => {
             
            }}
          >
            <a>删除</a>
          </Popconfirm>
          </Space>
        ),
      },
    ] as ColumnsType<any>;
  };