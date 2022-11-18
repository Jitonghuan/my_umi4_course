import { Space, Tooltip, Tag } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import moment from 'moment'

export const columnSchema = () => {
  return [
    {
      title: '时间',
      dataIndex: 'time',
      key: 'id',
      width: 30,
    },
    {
      title: '读/s',
      dataIndex: 'id',
      key: 'id',
      width: 40,
    },
    {
      title: '写/s',
      dataIndex: 'id',
      key: 'id',
      width: 50,
    },
    {
      title: '错/s',
      dataIndex: 'id',
      key: 'id',
      width: 50,
    },
    {
      title: '跨/s',
      dataIndex: 'id',
      key: 'id',
      width: 50,
    },
    {
      title: '耗时',
      dataIndex: 'id',
      key: 'id',
      width: 50,
    },
    {
      title: '耗时',
      dataIndex: 'id',
      key: 'id',
      width: 50,
    },
    {
      title: '结果',
      dataIndex: 'id',
      key: 'id',
      width: 50,
    },
  ]
}