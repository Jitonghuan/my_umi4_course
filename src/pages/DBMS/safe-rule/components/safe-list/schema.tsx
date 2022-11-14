import { datetimeCellRender } from '@/utils';
import { FormProps } from '@/components/table-search/typing';
import { Space, Popconfirm, Tooltip, Tag } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
export const typeOptions=[
    {
        label:"MySQL",
        value:"MySQL",
        key:"MySQL"
    }
]
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
        width: '14%',
      },
      {
        title: '引擎类型',
        dataIndex: 'ruleSetRemark',
        key: 'ruleSetRemark',
        width: '40%',
        ellipsis: true,
        render: (text) => <Tooltip title={text}><Tag>{text}</Tag></Tooltip>,
      },
      {
        title: '关联实例',
        dataIndex: 'designFlow',
        key: 'designFlow',
        width: '20%',
        render: (value) => <>{} </>,
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
              <a>删除</a>
            </Popconfirm>
          </Space>
        ),
      },
    ] as ColumnsType<any>;
  };
  