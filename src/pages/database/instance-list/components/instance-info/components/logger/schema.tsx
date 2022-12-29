import { Space, Tag, Popconfirm, Spin, Modal, Form ,Tooltip} from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { datetimeCellRender } from '@/utils';
export const lowSqlStatisticsColumns=()=>{
    return [
      {
        title: '时间',
        dataIndex: 'tsMin',
        key: 'tsMin',
        // width: '35%',
        // ellipsis:true,
        render:(value)=><span>
        {value?datetimeCellRender(value):""}
      </span>
      },
     
      {
        title: '数据库名',
        dataIndex: 'database',
        key: 'database',
        // width: '35%',
        // ellipsis:true,
       
      },
      {
        title: 'SQL语句',
        dataIndex: 'sample',
        key: 'sample',
        // width: '15%',
      },
      {
        title: '执行详情',
        dataIndex: 'detail',
        key: 'detail',
        width: '15%',
        ellipsis:true,
        render:(value,record,index)=><p>
            <p>总执行次数：{record?.tsCnt}</p>
            <p>总执行时长：{record?.queryTimeSum}</p>
            <p>最大执行时长：{record?.queryTimeMax}</p>
        </p>
      },
      {
        title: '等待解锁',
        dataIndex: 'waitLock',
        key: 'waitLock',
        // width: '35%',
        // ellipsis:true,
        render:(value,record,index)=><p>
        <p>总锁定时长:{record?.lockTimeSum}</p>
        <p>最长锁时长：{record?.lockTimeMax}</p>
       
    </p>
       
      },
      
      {
        title: '扫描行数',
        dataIndex: 'scan',
        key: 'scan',
        // width: '35%',
        // ellipsis:true,
        render:(value,record,index)=><p>
        <p>解析总行数：{record?.rowsExaminedSum}</p>
        <p>最大解析行数：{record?.rowsExaminedMax}</p>
       
    </p>
       
      },
      {
        title: '返回行数',
        dataIndex: 'returnTotal',
        key: 'returnTotal',
        // width: '35%',
        // ellipsis:true,
        render:(value,record,index)=><p>
        <p>返回总行数：{record?.rowsSentSum}</p>
        <p>返回最长行数：{record?.rowsSentMax}</p>
       
    </p>
       
      },
  
    ]
  }
export const lowSqlDetailColumns=()=>{
    return [
      {
        title: '执行完成时间',
        dataIndex: 'tsMin',
        key: 'tsMin',
        // width: '35%',
        // ellipsis:true,
        render:(value)=><span>
        {value?datetimeCellRender(value):""}
      </span>
      },
      {
        title: 'SQL',
        dataIndex: 'sample',
        key: 'sample',
        // width: '15%',
      },
      {
        title: '库名',
        dataIndex: 'database',
        key: 'database',
        // width: '35%',
        // ellipsis:true,
       
      },
      {
        title: '客户端',
        dataIndex: 'client',
        key: 'client',
        // width: '15%',
        // ellipsis:true,
        render:(value)=><Tooltip title={value}>
          <span>{value}</span>
        </Tooltip>
      },
      {
        title: '用户',
        dataIndex: 'user',
        key: 'user',
        // width: '35%',
        // ellipsis:true,
       
      },
      {
        title: '执行耗时',
        dataIndex: 'queryTimeSum',
        key: 'queryTimeSum',
        // width: '35%',
        // ellipsis:true,
       
      },
      {
        title: '锁等待耗时',
        dataIndex: 'lockTimeSum',
        key: 'lockTimeSum',
        // width: '35%',
        // ellipsis:true,
       
      },
      {
        title: '扫描行',
        dataIndex: 'rowsExaminedSum',
        key: 'rowsExaminedSum',
        // width: '35%',
        // ellipsis:true,
       
      },
      {
        title: '返回行',
        dataIndex: 'rowsSentSum',
        key: 'rowsSentSum',
        // width: '35%',
        // ellipsis:true,
       
      },
  
    ]
  }
