import { Popconfirm, Tag } from 'antd';
import type { ColumnProps } from '@cffe/vc-hulk-table';
import { datetimeCellRender } from '@/utils';

// 表格 schema
export const releaseTableSchema = ({
  onUpdateClick,
  onDetailClick,
  onDelClick,
}: {
  onUpdateClick: (record: any, index: number) => void;
  onDetailClick: (record: any, index: number) => void;
  onDelClick: (record: any, index: number) => void;
}) =>
  [
    {
      title: '发布名称',
      dataIndex: 'releaseName',
      width: 230,
    },
    {
      title: '命名空间',
      dataIndex: 'namespace',
    },
    {
      title: 'Chart名称',
      dataIndex: 'chartName',
      width: 230,
      render: (value) => (
        <>
          <Tag color="pink"> {value}</Tag>
        </>
      ),
    },
    {
      title: 'Chart版本',
      dataIndex: 'chartVersion',
      width: 230,
      render: (value) => (
        <>
          <Tag color="green">{value}</Tag>
        </>
      ),
    },
    {
      title: '应用版本',
      dataIndex: 'appVersion',
      width: 230,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      width: 230,
      render: (value: string) => datetimeCellRender(value),
    },

    {
      title: '状态',
      dataIndex: 'status',
      width: 120,
      render: (status) => (
        <>
          <Tag>{status}</Tag>
        </>
      ),
    },

    {
      width: 200,
      title: '操作',

      dataIndex: 'operate',
      render: (_: any, record: any, index: number) => (
        <div className="action-cell">
          <a onClick={() => onDetailClick(record, index)}>详情</a>

          <a
            onClick={() => {
              onUpdateClick(record, index);
            }}
          >
            更新
          </a>
          <Popconfirm
            title="确定要删除吗？"
            onConfirm={() => onDelClick(record, index)}
            okText="确定"
            cancelText="取消"
            placement="topLeft"
          >
            <a>删除</a>
          </Popconfirm>
        </div>
      ),
    },
  ] as ColumnProps[];
