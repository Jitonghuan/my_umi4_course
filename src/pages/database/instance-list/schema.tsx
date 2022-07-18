/*
 * @Author: muxi.jth 2016670689@qq.com
 * @Date: 2022-07-07 11:08:37
 * @LastEditors: muxi.jth 2016670689@qq.com
 * @LastEditTime: 2022-07-07 15:28:36
 * @FilePath: /fe-matrix/src/pages/database/instance-list/schema.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Space, Tag, Popconfirm, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
export const formOptions = [
  {
    key: '1',
    type: 'input',
    label: '实例名称',
    dataIndex: 'type',
    width: '200px',
    placeholder: '请输入',
  },
  {
    key: '2',
    type: 'input',
    label: 'Host',
    dataIndex: 'type',
    width: '200px',
    placeholder: '请输入',
  },
  {
    key: '3',
    type: 'select',
    label: '类型',
    dataIndex: 'type',
    width: '200px',
    placeholder: '请选择',
    option: [],
  },
  {
    key: '4',
    type: 'select',
    label: '所属集群',
    dataIndex: 'type',
    width: '200px',
    placeholder: '请选择',
    option: [],
  },
  {
    key: '4',
    type: 'select',
    label: '所属环境',
    dataIndex: 'type',
    width: '200px',
    placeholder: '请选择',
    option: [],
  },
];

// 列表页-表格
export const createTableColumns = (params: {
  onEdit: (record: any, index: number) => void;
  onManage: (record: any, index: number) => void;
  onViewPerformance: (record: any, index: number) => void;
  onDelete: (record: any) => void;
}) => {
  return [
    {
      title: '实例名称',
      dataIndex: 'id',
      key: 'id',
      width: '14%',
    },
    {
      title: 'Host',
      dataIndex: 'type',
      key: 'type',
      width: '14%',
    },
    {
      title: '数据库类型',
      dataIndex: 'title',
      key: 'title',
      width: '30%',
      ellipsis: true,
      render: (text) => <Tooltip title={text}>{text}</Tooltip>,
    },
    {
      title: '所属集群',
      dataIndex: 'gmtCreate',
      key: 'gmtCreate',
      width: '20%',
    },
    {
      title: '所属环境',
      dataIndex: 'priority',
      key: 'priority',
      width: '10%',
    },
    {
      title: '实例简述',
      dataIndex: 'priority',
      key: 'priority',
      width: '10%',
    },
    {
      title: '服务状态',
      dataIndex: 'priority',
      key: 'priority',
      width: '10%',
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      width: '12%',
      render: (_: string, record, index: number) => (
        //根据不同类型跳转
        <Space>
          <a onClick={() => params.onEdit(record, index)}>编辑</a>
          <a onClick={() => params.onManage(record, index)}>管理</a>
          <a onClick={() => params.onViewPerformance(record, index)}>性能</a>
          <Popconfirm
            title="确认删除?"
            onConfirm={() => {
              params?.onDelete(record.id);
            }}
          >
            <a style={{ color: 'rgb(255, 48, 3)' }}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ] as ColumnsType<any>;
};
