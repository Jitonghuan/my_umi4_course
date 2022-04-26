import { history } from 'umi';
import { Tooltip } from 'antd';
import { Html5Outlined, CodeOutlined } from '@ant-design/icons';
import type { ColumnProps } from '@cffe/vc-hulk-table';

export type AppType = 'frontend' | 'backend';

const APP_TYPE_MAP = {
  frontend: '前端',
  backend: '后端',
};

const APP_TYPE_ICON = {
  frontend: <Html5Outlined />,
  backend: <CodeOutlined />,
};

// 表格 schema
export const createTableSchema = ({
  onEditClick,
  onVeiwClick,
  onBindClick,
}: {
  onEditClick: (record: any, index: number) => void;
  onVeiwClick: (record: any, index: number) => void;
  onBindClick: (record: any, index: number) => void;
}) =>
  [
    {
      title: '版本ID',
      dataIndex: 'id',
      align: 'center',
      width: 40,
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
      width: 120,
      title: '操作',
      fixed: 'right',
      dataIndex: 'operate',
      align: 'center',
      render: (_: any, record: any, index: number) => (
        <div className="action-cell">
          <a onClick={() => onVeiwClick(record, index)}>查看</a>
          <a onClick={() => onEditClick(record, index)}>编辑</a>
          <a onClick={() => onBindClick(record, index)}>绑定应用</a>
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
