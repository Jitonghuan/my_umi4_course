import type { ColumnsType } from 'antd/lib/table';
import { DeleteOutlined } from '@ant-design/icons';

// 列表页-表格
export const createClusterATableColumns = (params: {
    onDetele: (record: any, index: number) => void;
  }) => {
    return [
        {
            title: '用户',
            dataIndex: 'userId',
            key: 'userId',
            width:200
          },
          {
            title: '备注',
            dataIndex: 'description',
            key: 'description',
            width:200
          },
          {
            title: '操作',
            key: 'action',
            width: 50,
            fixed:"right",
            render: (_: string, record, index: number) => (
              <a
                onClick={() => {
                    params?.onDetele(record,index)
                 // delClusterA_operator(text);
                }}
              >
                <DeleteOutlined />
              </a>
            ),
          },
    ] as ColumnsType<any>;
  };
  export const createClusterBTableColumns = (params: {
    onDetele: (record: any, index: number) => void;
  }) => {
    return [
        {
            title: '用户',
            dataIndex: 'userId',
            key: 'userId',
            width:200
          },
          {
            title: '备注',
            dataIndex: 'description',
            key: 'description',
            width:200
          },
          {
            title: '操作',
            key: 'action',
            width: 50,
            fixed:"right",
            render: (_: string, record, index: number) => (
              <a
                onClick={() => {
                    params?.onDetele(record,index)
                }}
              >
                <DeleteOutlined />
              </a>
            ),
          },
    ] as ColumnsType<any>;
  };