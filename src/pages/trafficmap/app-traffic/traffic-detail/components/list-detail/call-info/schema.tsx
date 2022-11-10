import { Space, Popconfirm, Tooltip, Switch } from 'antd';
import type { ColumnsType } from 'antd/lib/table';

// 列表页-表格
export const createStatisticsTableColumns = (params: {
  
    onView: (record: any, index: number) => void;
   
    
  }) => {
    return [
      {
        title: '接口url',
        dataIndex: 'id',
        key: 'id',
        width: 100,
      },
      {
        title: '请求数',
        dataIndex: 'appName',
        key: 'appName',
        width: 200,
      },
      {
        title: '平均RT',
        dataIndex: 'appCode',
        key: 'title',
        width: 200,
        ellipsis: true,
        render: (text) => <Tooltip title={text}>{text}</Tooltip>,
      },
      {
        title: '成功率',
        dataIndex: 'cpu',
        key: 'cpu',
        width: 200,
        render: (value) => <>{} </>,
      },
      {
        title: '失败数',
        dataIndex: 'memeory',
        key: 'memeory',
        width: 200,
        render: (value) => <>{} </>,
      },
     
      {
        title: '操作',
        dataIndex: 'option',
        key: 'option',
        fixed:"right",
        width: 180,
        render: (_: string, record, index: number) => (
          //根据不同类型跳转
          <Space>
            <a onClick={() => params.onView(record, index)}>链路追踪</a>
           
          </Space>
        ),
      },
    ] as ColumnsType<any>;
  };

  // 列表页-表格
export const createQueryTableColumns = (params: {
  
    onView: (record: any, index: number) => void;
   
    
  }) => {
    return [
      {
        title: '接口url',
        dataIndex: 'id',
        key: 'id',
        width: 100,
      },
      {
        title: '创建时间',
        dataIndex: 'appName',
        key: 'appName',
        width: 200,
      },
      {
        title: '耗时',
        dataIndex: 'appCode',
        key: 'title',
        width: 200,
        ellipsis: true,
        render: (text) => <Tooltip title={text}>{text}</Tooltip>,
      },
      {
        title: 'traceID',
        dataIndex: 'cpu',
        key: 'cpu',
        width: 200,
        render: (value) => <>{} </>,
      },
     
     
      {
        title: '操作',
        dataIndex: 'option',
        key: 'option',
        fixed:"right",
        width: 180,
        render: (_: string, record, index: number) => (
          //根据不同类型跳转
          <Space>
            <a onClick={() => params.onView(record, index)}>查看日志</a>
           
          </Space>
        ),
      },
    ] as ColumnsType<any>;
  };