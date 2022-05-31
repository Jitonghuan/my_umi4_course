import {  Tooltip, Tag } from 'antd';
import { JOB_STATUS } from '../type';
import { datetimeCellRender } from '@/utils';

export const tableColumns = [
  {
    title: 'taskId',
    dataIndex: 'taskId',
    width: 60,
  },
  {
    title: '开始执行时间',
    dataIndex: 'gmtCreate',
    width: 230,
    render:(value:string) => (
      <Tooltip placement="topLeft" title={datetimeCellRender(value)}>
        {datetimeCellRender(value)}
      </Tooltip>
    )
  },
  {
    title: '结束执行时间',
    dataIndex: 'gmtModify',
    width: 230,
    render:(value:string) => (
      <Tooltip placement="topLeft" title={datetimeCellRender(value)}>
        {datetimeCellRender(value)}
      </Tooltip>
    )
  },
  {
    title: '执行状态',
    dataIndex: 'execStatus',
    width: 100,
    render: (status: any) => (
      <Tag color={JOB_STATUS[status]?.color || 'default'}>{JOB_STATUS[status]?.text || status}</Tag>
    ),
  },
  {
    title: '返回结果',
    dataIndex: 'result',
    width: 290,
    ellipsis:true,
    render:(result:string)=>(
      <Tooltip title={result} placement="topRight">
        {result}

      </Tooltip>

    )
  },
];
