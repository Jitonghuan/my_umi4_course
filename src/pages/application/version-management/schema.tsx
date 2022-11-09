import { Tooltip, Popconfirm } from 'antd';
import type { ColumnProps } from '@cffe/vc-hulk-table';

export type AppType = 'frontend' | 'backend';
// 表格 schema
export const createTableSchema = ({
  onEditClick,
  onVeiwClick,
  onBindClick,
  onDisable
}: {
  onEditClick: (record: any, index: number) => void;
  onVeiwClick: (record: any, index: number) => void;
  onBindClick: (record: any, index: number) => void;
  onDisable: (record: any, index: number) => void;
}) =>
  [
    {
      title: '版本ID',
      dataIndex: 'id',
      align: 'center',
      width: 50,
    },
    {
      title: '版本名称',
      dataIndex: 'versionName',
      width: 230,
    },
    {
      title: '版本CODE',
      dataIndex: 'versionCode',
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
      title: '版本描述',
      dataIndex: 'desc',
      width: 200,
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: '创建人',
      dataIndex: 'createUser',
      width: 80,
      ellipsis: {
        showTitle: false,
      },
    },
    {
      width: 150,
      title: '操作',
      fixed: 'right',
      dataIndex: 'operate',
      // align: 'center',
      render: (_: any, record: any, index: number) => (
        <div className="action-cell">
          <a onClick={() => onVeiwClick(record, index)}>查看</a>
          <a onClick={() => onEditClick(record, index)}>编辑</a>
          <a onClick={() => onBindClick(record, index)}>关联应用</a>
          <Popconfirm
            title={`确定要${record.disable ? '启用' : '禁用'}吗？`}
            onConfirm={() => {
              onDisable(record, index);
            }}
          >
            <a>{record.disable ? '启用' : '禁用'}</a>
          </Popconfirm>
        </div>
      ),
    },
  ] as ColumnProps[];

/** 应用数据模型 */
export interface VersionRecordItem {
  /** 数据库自增ID */
  id?: number;
  /** 版本code */
  versionCode: string;
  /** 版本名称 */
  versionName: string;
  /** 应用分类 */
  appCategoryCode: AppType;
  /** 备注 */
  desc: string;
  /** 应用CODE  数组*/
  appCodes: any;
}
