import { Button, Tag, Space } from 'antd';
import { history } from 'umi';
import { LIST_STATUS_TYPE } from '../../deployInfo-content/schema';
import type { ColumnProps } from '@cffe/vc-hulk-table';

export const columns = [
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: '事件原因',
    dataIndex: 'reason',
  },
  {
    title: '事件信息',
    dataIndex: 'message',
  },
  {
    title: '最后更新',
    dataIndex: 'lastUpdateTime',
  },
];

// 表格 schema
export const creatContainerColumns = ({
  onViewLogClick,
  onLoginShellClick,
}: {
  onViewLogClick: (record: any, index: number) => void;
  onLoginShellClick: (record: any, index: number) => void;
}) =>
  [
    {
      title: '容器名称',
      dataIndex: 'containerName',
      key: 'containerName',
    },
    {
      title: '容器状态',
      dataIndex: 'status',
      render: (status: any, record: any) => {
        return <Tag color={LIST_STATUS_TYPE[status].color || 'default'}>{LIST_STATUS_TYPE[status].text || status}</Tag>;
      },
    },
    {
      title: '容器镜像',
      dataIndex: 'image',
    },
    {
      title: '重启次数',
      dataIndex: 'restartCount',
    },
    {
      title: '操作',
      dataIndex: 'operate',
      render: (text: string, record: any, index: number) => (
        <>
          <Space size="small">
            <Button
              size="small"
              type="primary"
              onClick={() => {
                onViewLogClick(record, index);
              }}
            >
              查看日志
            </Button>
            <Button
              size="small"
              type="primary"
              onClick={() => {
                onLoginShellClick(record, index);
              }}
            >
              登陆shell
            </Button>
          </Space>
        </>
      ),
    },
  ] as ColumnProps[];
