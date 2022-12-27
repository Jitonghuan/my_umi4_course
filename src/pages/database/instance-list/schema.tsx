/*
 * @Author: muxi.jth 2016670689@qq.com
 * @Date: 2022-07-07 11:08:37
 * @LastEditors: muxi.jth 2016670689@qq.com
 * @LastEditTime: 2022-12-20 13:04:42
 * @FilePath: /fe-matrix/src/pages/database/instance-list/schema.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Space, Avatar, Popconfirm, Tag, Spin,Tooltip } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import {
  HomeOutlined,
  StockOutlined,
  TeamOutlined,
  InsertRowAboveOutlined,
  HourglassOutlined,
  ForkOutlined,
  MoreOutlined,
} from '@ant-design/icons';

export const infoOptions = [
  {
    label: (
      <div style={{ padding: 4 }}>
        <Avatar size="small" style={{ backgroundColor: '#6495ED' }} icon={<HomeOutlined />} />
        <div>实例详情</div>
      </div>
    ),
    value: 'detail',
  },
  {
    label: (
      <div style={{ padding: 4 }}>
        <Avatar size="small" style={{ backgroundColor: '#6495ED' }} icon={<StockOutlined />} />
        <div>性能趋势</div>
      </div>
    ),
    value: 'trend',
  },
  {
    label: (
      <div style={{ padding: 4 }}>
        <Avatar size="small" style={{ backgroundColor: '#6495ED' }} icon={<HourglassOutlined />} />
        <div>会话管理</div>
      </div>
    ),
    value: 'session',
  },
  {
    label: (
      <div style={{ padding: 4 }}>
        <Avatar size="small" style={{ backgroundColor: '#6495ED' }} icon={<InsertRowAboveOutlined />} />
        <div>数据库管理</div>
      </div>
    ),
    value: 'database',
  },
  {
    label: (
      <div style={{ padding: 4 }}>
        <Avatar size="small" style={{ backgroundColor: '#6495ED' }} icon={<TeamOutlined />} />
        <div>账号管理</div>
      </div>
    ),
    value: 'account',
  },
  {
    label: (
      <div style={{ padding: 4 }}>
        <Avatar size="small" style={{ backgroundColor: '#6495ED' }} icon={<ForkOutlined />} />
        <div>日志管理</div>
      </div>
    ),
    value: 'logger',
  },
  {
    label: (
      <div style={{ padding: 4 }}>
        <Avatar size="small" style={{ backgroundColor: '#6495ED' }} icon={<MoreOutlined />} />
        <div>容量分析</div>
      </div>
    ),
    value: 'capacity',
  },
];
export const formOptions = [
  {
    key: '1',
    type: 'input',
    label: '实例名称',
    dataIndex: 'name',
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
    dataIndex: 'clusterName',
    width: '200px',
    placeholder: '请选择',
    option: [],
  },
];
// 实例类型枚举       3:mysql 4:postgresql 5:redis 6:mongdb
type instanceTypeItem = {
  color: string;
  tagText: string;
};

export const INSTANCE_TYPE: Record<number, instanceTypeItem> = {
  3: { tagText: 'mysql', color: 'green' },
  4: { tagText: 'postgresql', color: 'geekblue' },
  5: { tagText: 'redis', color: 'magenta' },
  6: { tagText: 'mongdb', color: 'volcano' },
  7:{tagText:'tidb',color:'cyan'}
};
export const typeOptions = [
  { key: 3, label: 'mysql', value: 3 },
  { key: 4, label: 'postgresql', value: 4 },
];
export const instanceTypeOption = [
  {
    label: 'mysql',
    value: 3,
    key: 3,
  },
  {
    label: 'postgresql',
    value: 4,
    key: 4,
  },
  {
    label: 'redis',
    value: 5,
    key: 5,
  },
  {
    label: 'mongdb',
    value: 6,
    key: 6,
  },
];

// 集群角色枚举        3:主库 4:从库
type clusterRoleTypeItem = {
  color: string;
  tagText: string;
};

export const ROLE_TYPE: Record<number, clusterRoleTypeItem> = {
  3: { tagText: '主库', color: '#2db7f5' },
  4: { tagText: '从库', color: '#87d068' },
};
export const roleTypeOption = [
  {
    label: '主库',
    value: 3,
  },
  {
    label: '从库',
    value: 4,
  },
];
// 集群状态：1 - 运行中  2 - 异常
type clusterStatusTypeItem = {
  color: string;
  tagText: string;
};

export const CLUSTER_STATUS_TYPE: Record<number, clusterStatusTypeItem> = {
  1: { tagText: '运行中', color: 'green' },
  2: { tagText: '异常', color: 'red' },
};

// 列表页-表格
export const createTableColumns = (params: {
  onEdit: (record: any, index: number) => void;
  onManage: (record: any, index: number) => void;
  onViewPerformance: (record: any, index: number) => void;
  onDelete: (record: any) => void;
  delLoading: boolean;
}) => {
  return [
    {
      title: '实例名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      ellipsis:true,
      render:(value,record,index)=>(
       <Tooltip title={value}>
         <a onClick={() => params.onManage(record, index)}>{value}</a>
       </Tooltip> 
      )
    },
    {
      title: 'Host',
      dataIndex: 'instanceHost',
      key: 'instanceHost',
      width: 240,
      ellipsis:true,
      render:(value,record,index)=>(
        <Tooltip title={value}>
          <span>{value}</span>
        </Tooltip> 
       )
    },
    {
      title: '数据库类型',
      dataIndex: 'instanceType',
      key: 'instanceType',
      width: 110,
      ellipsis: true,
      render: (value) => (
        <Tag color={INSTANCE_TYPE[value]?.color || 'default'}>{INSTANCE_TYPE[value]?.tagText || '--'}</Tag>
      ),
    },
    {
      title: '所属集群',
      dataIndex: 'clusterName',
      key: 'clusterName',
      width: 180,
    },
    {
      title: '实例角色',
      dataIndex: 'clusterRole',
      key: 'clusterRole',
      width: 100,
      render:(value:number)=>(
        <Tag color={ROLE_TYPE[value]?.color||"default"}>{ROLE_TYPE[value]?.tagText}</Tag>
      )
    },
    {
      title: '所属环境',
      dataIndex: 'envCode',
      key: 'envCode',
      width: 180,
    },
    {
      title: '服务状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (value: number) => {
        return <Tag color={CLUSTER_STATUS_TYPE[value]?.color || 'default'}>{CLUSTER_STATUS_TYPE[value]?.tagText}</Tag>;
      },
    },
    {
      title: '实例简述',
      dataIndex: 'description',
      key: 'description',
      width: 200,
    },
  
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      width: 180,
      fixed:"right",
      render: (_: string, record, index: number) => (
        //根据不同类型跳转
        <Space>
        
          <a onClick={() => params.onManage(record, index)}>管理</a>
          {/* <a onClick={() => params.onViewPerformance(record, index)}>性能</a> */}
          <a onClick={() => params.onEdit(record, index)}>编辑</a>
          <Popconfirm
            title="确认删除?"
            onConfirm={() => {
              params?.onDelete(record.id);
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
