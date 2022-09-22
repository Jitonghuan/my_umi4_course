import { datetimeCellRender } from '@/utils';
import { Space, Popconfirm, Tooltip,Tag,Button } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
export interface Item {
    id: number;
    versionName: string;
    versionDescription: string;
    releaseTime: number;
    gmtCreate: any;
    releaseStatus: number;
  }
  type releaseStatus = {
    text: string;
    type: any;
    disabled: boolean;
  };
  export const STATUS_TYPE: Record<number, releaseStatus> = {
    0: { text: '发布', type: 'primary', disabled: false },
    1: { text: '已发布', type: 'default', disabled: true },
  };
  
  

// 列表页-表格
export const createTableColumns = (params: {
  onManage: (record: any, index: number) => void;
  onPublish: (record: any, index: number) => void;
  onDelete: (record: any, index: number) => void;
 
}) => {
  return [
    {
        title: '版本',
        dataIndex: 'versionName',
        width: '30%',
      },
      {
        title: '发布状态',
        dataIndex: 'releaseStatus',
        width: '10%',
        render: (status: any, record: Item) => (
          <span>
            <Tag color={status === 0 ? 'default' : 'success'}> {status === 0 ? '未发布' : '已发布'}</Tag>
          </span>
        ),
      },
      {
        title: '版本描述',
        dataIndex: 'versionDescription',
        width: '20%',
        render: (value: string) => (
          <Tooltip placement="topLeft" title={value}>
            {value}
          </Tooltip>
        ),
      },
      {
        title: '发布时间',
        dataIndex: 'gmtCreate',
        width: '30%',
        render: (value: any, record: Item) => <span>{moment(value).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        dataIndex: 'option',
        width: 240,
        render: (_: string, record: Item,index:number) => (
          <Space>
            <Button
              type="primary"
              size="small"
              onClick={() => {
                params?.onManage(record,index)
              }}
            >
              管理
            </Button>
            <Popconfirm
              disabled={STATUS_TYPE[record.releaseStatus].disabled}
              title="发布后编排不可修改，是否确认发布？"
              onConfirm={() => {
                params?.onPublish(record,index)
              }}
              // onCancel={cancel}
              okText="确认"
              cancelText="取消"
            >
              <Button
                size="small"
                type={STATUS_TYPE[record.releaseStatus].type || 'default'}
                disabled={STATUS_TYPE[record.releaseStatus].disabled}
                // loading={params?.publishLoading}
              >
                {STATUS_TYPE[record.releaseStatus].text}
              </Button>
            </Popconfirm>
            <Popconfirm
              title="确认删除？"
              onConfirm={() => {
               params?.onDelete(record,index)
              }}
              // onCancel={cancel}
              okText="是"
              cancelText="否"
            >
              <Button size="small" 
            //   loading={params?.delLoading}
              >
                删除
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
  ] as ColumnsType<any>;
};
