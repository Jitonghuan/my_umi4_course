import { Card, Select, Form, Tooltip, Tabs, Button, Row, Col,Badge } from 'antd';

// 表格schema
export const tableSchema = [
    // {
    //   dataIndex: 'hostIP',
    //   title: 'IP',
    //   align: 'left',
    //   width: 180,
    // },
    {
      title: '主机名',
      dataIndex: 'hostName',
      align: 'left',
      width: 333,
      fixed:"left"
    },
    {
      dataIndex: 'memLimit',
      title: '总内存(MB)',
      width: 100,
    },
    {
      dataIndex: 'cpuLimit',
      title: 'CPU核数',
      width: 90,
    },
    {
      dataIndex: 'cpu',
      title: 'CPU使用率',
      width: 100,
    },
    {
      dataIndex: 'RSS',
      title: '内存使用率(RSS)',
      width: 160,
    },
    {
      dataIndex: 'WSS',
      title: '内存使用率(WSS)',
      width: 160,
    },
    {
      dataIndex: 'disk',
      title: '磁盘使用量(MB)',
      width: 140,
    },
    {
      dataIndex: 'restartNum',
      title: '重启次数',
      width: 90,
    },
    {
      dataIndex: 'uptime',
      title: '运行时长',
      width: 120,
    },
    {
      dataIndex: 'health',
      title: '健康状态',
      
     // valueType: 'status',
      width: 90,
      render:(value:string)=>{
     return(value==="0"? <Badge status="error" />:<Badge status="success" />) 
      }
    },
  ];