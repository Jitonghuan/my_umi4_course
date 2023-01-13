import { Popconfirm, Tooltip, Switch, Tag } from 'antd';
import type { ColumnProps } from '@cffe/vc-hulk-table';

// 表格 schema
export const tableSchema = ({
  onEditClick,
  onViewClick,
  onDelClick,
  onGetExecutionDetailClick,
 
}: {
  onEditClick: (record: any, index: number) => void;
  onViewClick: (record: any, index: number) => void;
  onDelClick: (record: any, index: number) => void;
  onGetExecutionDetailClick: (record: any, index: number) => void;
  
}) =>
  [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 50,
    },
    {
      title: '模板名称',
      dataIndex: 'jobName',
      width: 230,
      render: (value, record, index) => <a onClick={() => onViewClick(record, index)}>{value}</a>,
    },
    {
      title: '模版类型',
      dataIndex: 'jobCode',
      width: 180,
      ellipsis: {
        showTitle: false,
      },
      render: (value) => (
        <Tooltip placement="topLeft" title={value}>
          {value}
        </Tooltip>
      ),
    },
    {
      title: '构建类型',
      width: 320,
      ellipsis: true,
      dataIndex: 'desc',
    },
    {
      title: '应用类型',
      width: 200,
      dataIndex: 'createUser',
    },
    {
      title: '应用分类',
      dataIndex: 'lastExecStatus',
      width: 120,

     
    },
    {
      title: '应用语言',
      dataIndex: 'enable',
      width: 100,
     
    },
    {
        title: '环境大类',
        dataIndex: 'enable',
        width: 100,
       
      },
    {
      width: 180,
      title: '操作',
      fixed: 'right',
      dataIndex: 'operate',
      render: (_: any, record: any, index: number) => (
        <div className="action-cell">
          <a onClick={() => onGetExecutionDetailClick(record, index)}>复制</a>
          <a onClick={() => onViewClick(record, index)}>详情</a>

          <a
            onClick={() => {
              onEditClick(record, index);
            }}
          >
            编辑
          </a>
          <a
            onClick={() => {
              onEditClick(record, index);
            }}
          >
            推送
          </a>
          <Popconfirm
            title="确定要删除该应用吗？"
            onConfirm={() => onDelClick(record, index)}
            okText="确定"
            cancelText="取消"
            placement="topLeft"
          >
            <a  style={{color:'red'}}>删除</a>
          </Popconfirm>
        </div>
      ),
    },
  ] as ColumnProps[];
