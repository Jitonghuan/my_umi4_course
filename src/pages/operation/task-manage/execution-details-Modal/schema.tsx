import { Tooltip, Tag, message } from 'antd';
import { JOB_STATUS } from '../type';
import { datetimeCellRender } from '@/utils';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { CopyOutlined } from '@ant-design/icons';

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
    render: (value: string) => (
      <Tooltip placement="topLeft" title={datetimeCellRender(value)}>
        {datetimeCellRender(value)}
      </Tooltip>
    )
  },
  {
    title: '结束执行时间',
    dataIndex: 'gmtModify',
    width: 230,
    render: (value: string) => (
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
    ellipsis: true,
    render: (result: string) => (
      <CopyToClipboard text={result} onCopy={() => message.success('复制成功！')}>
        <Tooltip title={result} placement="topRight">
          <span style={{ width: '80%' }}> {result}</span>
          <span style={{ position: 'absolute', color: 'royalblue', right: '5px', top: '4px' }}>
            <CopyOutlined />
          </span>
        </Tooltip>
      </CopyToClipboard>
    )
  },
];
