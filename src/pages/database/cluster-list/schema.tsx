import { Space, Tag, Popconfirm, Spin } from 'antd';
import type { ColumnsType } from 'antd/lib/table';

// 实例类型枚举       3:mysql 4:postgresql 5:redis 6:mongdb
type clusterTypeItem = {
  color: string;
  tagText: string;
};

export const CLUSTER_TYPE: Record<number, clusterTypeItem> = {
  3: { tagText: 'operator模式', color: 'green' },//
  4: { tagText: '主机部署', color: 'cyan' },
  5: { tagText: '云数据库', color: 'geekblue' },//
};
export const clusterTypeOption = [
  {
    label: 'operator模式',
    value: 3,
    key: 3,
  },
  {
    label: '主机部署',
    value: 4,
    key: 4,
  },
  {
    label: '云数据库',
    value: 5,
    key: 5,
  },
];
// 列表页-表格
export const createTableColumns = (params: {
  onEdit: (record: any) => void;
  onView: (record: any) => void;
  onDelete: (record: any) => void;
  delLoading: boolean;
}) => {
  return [
    {
      title: '集群名称',
      dataIndex: 'name',
      key: 'name',
      width: '14%',
    },
    {
      title: '所属环境',
      dataIndex: 'envCode',
      key: 'envCode',
      width: '10%',
    },
    {
      title: '部署类型',
      dataIndex: 'clusterType',
      key: 'clusterType',
      width: '12%',
      render: (value: number) => {
        return <Tag color={CLUSTER_TYPE[value]?.color || 'default'}>{CLUSTER_TYPE[value]?.tagText}</Tag>;
      },
    },

    {
      title: '读写地址',
      dataIndex: 'masterVipHost',
      key: 'masterVipHost',
      width: '15%',
    },
    {
      title: '只读地址',
      dataIndex: 'slaveVipHost',
      key: 'slaveVipHost',
      width: '15%',
    },
    {
      title: '集群描述',
      dataIndex: 'description',
      key: 'description',
      width: '14%',
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      width: '16%',
      render: (_: string, record, index: number) => (
        //根据不同类型跳转
        <Space>
          <a
            onClick={() => {
              params?.onView(record);
            }}
          >
            详情
          </a>
          <a
            onClick={() => {
              params?.onEdit(record);
            }}
          >
            编辑
          </a>
          <Popconfirm
            title="确认删除?"
            onConfirm={() => {
              params?.onDelete(record?.id);
            }}
          >
            <Spin spinning={params?.delLoading}>
              <a >删除</a>
            </Spin>
          </Popconfirm>
        </Space>
      ),
    },
  ] as ColumnsType<any>;
};
export const formOptions = [
  {
    key: '1',
    type: 'input',
    label: '集群名称',
    dataIndex: 'name',
    width: '200px',
    placeholder: '请输入',
  },
  {
    key: '3',
    type: 'select',
    label: '部署类型',
    dataIndex: 'type',
    width: '200px',
    placeholder: '请选择',
    option: clusterTypeOption,
  },
  {
    key: '4',
    type: 'select',
    label: '所属环境',
    dataIndex: 'clusterName',
    width: '200px',
    placeholder: '请选择',
    option: [],
  },
];
