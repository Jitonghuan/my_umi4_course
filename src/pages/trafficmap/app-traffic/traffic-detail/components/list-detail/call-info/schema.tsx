import { Space, Popconfirm, Tooltip, Tag } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { dateCellRender } from '@/utils';
import moment from 'moment'

// 列表页-表格
export const createStatisticsTableColumns = (params: {
  
    onView: (record: any, index: number) => void;
   
    
  }) => {
    return [
      {
        title: '接口url',
        dataIndex: 'url',
        key: 'url',
        width: 696,
        ellipsis:true,
        render: (value) => <Tooltip title={value}>{value} </Tooltip>,
      },
      {
        title: '请求数',
        dataIndex: 'requestCounts',
        key: 'requestCounts',
        width: 50,
        
      },
      {
        title: '平均RT',
        dataIndex: 'endpointAvg',
        key: 'endpointAvg',
        width: 60,
        ellipsis: true,
        render: (text) => <Tooltip title={text}>{Number(text).toFixed(2)}ms</Tooltip>,
      },
      {
        title: '成功率',
        dataIndex: 'endpointSR',
        key: 'endpointSR',
        width: 50,
        render: (value) => <>{value}% </>,
      },
      {
        title: '失败数',
        dataIndex: 'endpointFailed',
        key: 'endpointFailed',
        width: 50,
        render: (value) => <>{value}次 </>,
      },
     
      {
        title: '操作',
        dataIndex: 'option',
        key: 'option',
        fixed:"right",
        width: 100,
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
        dataIndex: 'endpointNames',
        key: 'endpointNames',
        width: 686,
        render: (value) => <>{value[0]} </>,
      },
      {
        title: '创建时间',
        dataIndex: 'start',
        key: 'start',
        width: 200,
        render:(item)=><span>{moment(Number(item)).format('YYYY-MM-DD HH:mm:ss')}</span>

      },
      {
        title: '耗时',
        dataIndex: 'duration',
        key: 'duration',
        width: 110,
        ellipsis: true,
        render: (text) => <Tooltip title={text}><Tag color="blue">{text}ms</Tag></Tooltip>,
      },
      {
        title: 'traceID',
        dataIndex: 'traceIds',
        key: 'traceIds',
        width: 458,
        render: (value) => <>{value[0]} </>,
      },
     
     
      {
        title: '操作',
        dataIndex: 'option',
        key: 'option',
        fixed:"right",
        width: 100,
        render: (_: string, record, index: number) => (
          //根据不同类型跳转
          <Space>
            <a onClick={() => params.onView(record, index)}>查看日志</a>
           
          </Space>
        ),
      },
    ] as ColumnsType<any>;
  };