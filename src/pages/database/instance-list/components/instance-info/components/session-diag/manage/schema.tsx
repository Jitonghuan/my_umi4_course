import { Space, Avatar, Popconfirm, Tag, Spin,Tooltip,Badge } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { dateCellRender } from '@/utils';
// 列表页-表格
export const createTableColumns = () => {
    return [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 50,
        // width: 200,
        ellipsis:true,
        render:(value,record,index)=>(
         <Tooltip title={value}>
          
         </Tooltip> 
        )
      },
      {
        title: '用户',
        dataIndex: 'user',
        key: 'user',
        width: 50,
        ellipsis:true,
        render:(value,record,index)=>(
          <Tooltip title={value}>
            <span>{value}</span>
          </Tooltip> 
         )
      },
      {
        title: '主机',
        dataIndex: 'host',
        key: 'host',
        width: 190,
        ellipsis: true,
       
      },
      {
        title: '数据库名',
        dataIndex: 'db',
        key: 'db',
        width: 180,
      },
      {
        title: '命令',
        dataIndex: 'command',
        key: 'command',
        width: 90,
       
      },
      {
        title: '执行时间',
        dataIndex: 'trxStarted',
        key: 'trxStarted',
        width: 180,
        render:(value:string)=><span>
        {value?dateCellRender(value):null}
      </span>
      },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        width: 100,
        // render: (value: number) => {
        //   return <Tag color={CLUSTER_STATUS_TYPE[value]?.color || 'default'}>{CLUSTER_STATUS_TYPE[value]?.tagText}</Tag>;
        // },
      },
      {
        title: 'SQL',
        dataIndex: 'sql',
        key: 'sql',
        width: 200,
        ellipsis:true,
        render:(value:string)=>{
          <Tooltip title={value}>
            {value}
          </Tooltip>

        }
      },
    
      {
        title: '事务持续时间',
        dataIndex: 'trxRunTime',
        key: 'trxRunTime',
        width: 90,
       
       
      },
    ] as ColumnsType<any>;
  };
  

  export const createUserTableColumns = () => {
     
    return [
     
      {
        title: '用户',
        dataIndex: 'key',
        key: 'key',
       
        ellipsis:true,
        render:(value,record,index)=>(
          <Tooltip title={value}>
            <span>{value}</span>
          </Tooltip> 
         )
      },
      {
        title: '活跃数',
        dataIndex: 'activeTotal',
        key: 'activeTotal',
       
        ellipsis: true,
       
      },
      {
        title: '总数',
        dataIndex: 'total',
        key: 'total',
       
      },
     
    ] as ColumnsType<any>;
  };
  export const createOriginTableColumns = () => {
     
    return [
     
      {
        title: '来源',
        dataIndex: 'key',
        key: 'key',
      
        ellipsis:true,
        render:(value,record,index)=>(
          <Tooltip title={value}>
            <span>{value}</span>
          </Tooltip> 
         )
      },
      {
        title: '活跃数',
        dataIndex: 'activeTotal',
        key: 'activeTotal',
       
        ellipsis: true,
       
      },
      {
        title: '总数',
        dataIndex: 'total',
        key: 'total',
        
      },
     
    ] as ColumnsType<any>;
  };
  export const createDbTableColumns = () => {
     
    return [
     
      {
        title: 'DB',
        dataIndex: 'key',
        key: 'key',
      
        ellipsis:true,
        render:(value,record,index)=>(
          <Tooltip title={value}>
            <span>{value}</span>
          </Tooltip> 
         )
      },
      {
        title: '活跃数',
        dataIndex: 'activeTotal',
        key: 'activeTotal',
       
        ellipsis: true,
       
      },
      {
        title: '总数',
        dataIndex: 'total',
        key: 'total',
        
      },
     
    ] as ColumnsType<any>;
  };

  export const createSqlTableColumns = (params:{
    onClose:(record:any)=>void;
    onUpdate:(record:any)=>void;
  }) => { 
    return [
     
      {
        title: '限流模式',
        dataIndex: 'limitMode',
        key: 'limitMode',
       
        ellipsis:true,
        render:(value,record,index)=>(
          <Tooltip title={value}>
            <span>{value}</span>
          </Tooltip> 
         )
      },
      {
        title: '最大并发度',
        dataIndex: 'maxConcurrency',
        key: 'maxConcurrency',
        render:(value)=><span>{value}</span>
       
       
       
      },
      {
        title: '限流时间',
        dataIndex: 'limitTime',
        key: 'limitTime',
       
      },
      {
        title: '开始时间',
        dataIndex: 'jobStartTime',
        key: 'jobStartTime',
        render:(value:string)=><span>
          {value?dateCellRender(value):null}
        </span>
       
      },
      {
        title: '剩余时间（s)',
        dataIndex: 'jobEndTime',
        key: 'jobEndTime',
        // render:(value:string)=><span>
        //   {value?dateCellRender(value):null}
        // </span>
      },
      {
        title: '状态',
        dataIndex: 'runStatus',
        key: 'runStatus',
        render(value): React.ReactNode {
          return (<span>{value===1?<><Badge color="green"/>运行中</>:<><Badge/>停止</>}</span>)
        }
       
      },
      {
        title: '限流规则',
        dataIndex: 'sqlKeyWorld',
        key: 'sqlKeyWorld',
       
      },
      {
        title: '操作',
        dataIndex: 'opt',
        render:(_,record,index)=><Space>
          <a onClick={()=>{
           params?.onClose(record)
          }}>关闭</a>
          <a onClick={()=>{
           params?.onUpdate(record)
          }}>修改</a>
        </Space>
       
      },
      
     
    ] as ColumnsType<any>;
  };
  export const createEndTableColumns = () => {
     
    return [
     
      {
        title: '限流模式',
        dataIndex: 'limitMode',
        key: 'limitMode',
       
        ellipsis:true,
        render:(value,record,index)=>(
          <Tooltip title={value}>
            <span>{value}</span>
          </Tooltip> 
         )
      },
      {
        title: '最大并发度',
        dataIndex: 'maxConcurrency',
        key: 'maxConcurrency',
       
       
       
      },
      // {
      //   title: '限流时间',
      //   dataIndex: 'limitTime',
      //   key: 'limitTime',
       
      // },
      {
        title: '开始时间',
        dataIndex: 'jobStartTime',
        key: 'jobStartTime',
        render:(value:string)=><span>
        {value?dateCellRender(value):null}
      </span>
       
      },
      {
        title: '结束时间',
        dataIndex: 'jobEndTime',
        key: 'jobEndTime',
        render:(value:string)=><span>
        {value?dateCellRender(value):null}
      </span>
       
      },
    
      {
        title: '限流规则',
        dataIndex: 'sqlKeyWorld',
        key: 'sqlKeyWorld',
       
      },
     
      
     
    ] as ColumnsType<any>;
  };