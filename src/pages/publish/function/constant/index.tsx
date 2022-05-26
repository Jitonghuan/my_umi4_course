//Jira需求Id	发布功能	预计发布时间	当前状态	创建人	验收人
import { STATUS_TYPE } from '../add-edit/shcema';
import { Tag } from '@cffe/h2o-design';

export const JiraColumns = [
  {
    title: '需求Id',
    dataIndex: 'key',
    key: 'key',
  },
  {
    title: '发布功能',
    dataIndex: 'summary',
    key: 'summary',
  },
  {
    title: '预计发布时间',
    dataIndex: 'preDeployTime',
    key: 'preDeployTime',
  },
  {
    title: '当前状态',
    dataIndex: 'status',
    key: 'status',
    render: (status: any) => (
      <Tag color={STATUS_TYPE[status]?.color || 'default'}>{STATUS_TYPE[status]?.text || status}</Tag>
    ),
  },
  {
    title: '创建人',
    dataIndex: 'creator',
    key: 'creator',
  },
  {
    title: '验收人',
    dataIndex: 'accepter',
    key: 'accepter',
  },
];
