import { Space, Popconfirm, Tooltip,Tag,Spin } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
// 列表页-表格
export const createTableColumns = (params: { 
    onParam: (record: any, index: number) => void;
  }) => {
    return [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 100,
      },
      {
        title: '应用名',
        dataIndex: 'appName',
        key: 'appName',
        width: '18%',
      },
      {
        title: '应用CODE',
        dataIndex: 'appCode',
        key: 'appCode',
        width: '18%',
        ellipsis: true,
        render: (text) => <Tooltip title={text}>{text}</Tooltip>,
      },
      {
        title: '应用分类',
        dataIndex: 'appCategoryCode',
        key: 'appCategoryCode',
        width: '14%',
        ellipsis: true,
        render: (text) => <Tooltip title={text}>{text}</Tooltip>,
      },
      {
        title: '应用标签',
        dataIndex: 'bindTagNames',
        key: 'bindTagNames',
        width: '32%',
        ellipsis: true,
        render: (current) => <Tooltip placement="topLeft" title={ 
            current?.map((tag: any) => {
              let color = 'green';
              return (
                <span
                  style={{
                    marginTop: 2,
                  }}
                >
                  <Tag color={color}>{tag}</Tag>
                </span>
              );
            })}
          > <span>
        {current?.map((tag: any) => {
          let color = 'green';
          return (
            <span
              style={{
                marginTop: 2,
              }}
            >
              <Tag color={color}>{tag}</Tag>
            </span>
          );
        })}
      </span></Tooltip>,
      },
      {
        title: '操作',
        key: 'option',
        width: '14%',
        render: (_: string, record, index: number) => (
          //根据不同类型跳转
          <Space size="small">
                <a
                    onClick={() =>
                        params.onParam(record, index)
                    }
                  >
                    当前应用参数
                  </a>
          </Space>
        ),
      },
    ] as ColumnsType<any>;
  };