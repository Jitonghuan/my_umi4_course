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
      width: '14%',
    },
    {
      title: '命名空间',
      dataIndex: 'namespace',
      width: '18%',
    },
    {
      title: 'Chart名称',
      dataIndex: 'chartName',
      width: '9%',
      render: (value) => (
        <>
          <Tag color="processing"> {value}</Tag>
        </>
      ),
    },
    {
      title: 'Chart版本',
      dataIndex: 'chartVersion',
      width: '9%',
      render: (value) => (
        <>
          <Tag color="green">{value}</Tag>
        </>
      ),
    },
    {
      title: '应用版本',
      dataIndex: 'appVersion',
      width: '8%',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      width: '17%',
      render: (value: string) => datetimeCellRender(value),
    },

    {
      title: '状态',
      dataIndex: 'status',
      width: '10%',
      render: (status) => (
        <>
          <Tag>{status}</Tag>
        </>
      ),
    },

    {
      title: '操作',
      width: '14%',
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
