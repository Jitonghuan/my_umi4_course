import { Popconfirm, Tooltip, Switch, Tag, Space } from 'antd';
import type { ColumnProps } from '@cffe/vc-hulk-table';
import { datetimeCellRender } from '@/utils';

// 表格 schema
export const dependecyTableSchema = ({
  onEditClick,
  onViewClick,
  onDelClick,
  onSwitchEnableClick,
}: {
  onEditClick: (record: any, index: number) => void;
  onViewClick: (record: any, index: number) => void;
  onDelClick: (record: any, index: number) => void;
  onSwitchEnableClick: (record: any, index: number) => void;
}) =>
  [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '校验规则名称',
      dataIndex: 'ruleName',
      key: 'ruleName',
    },
    {
      title: 'groupId',
      dataIndex: 'groupId',
      key: 'groupId',
    },
    {
      title: 'artifactId',
      dataIndex: 'artifactId',
      key: 'artifactId',
    },
    {
      title: '版本范围',
      dataIndex: 'versionRange',
      key: 'versionRange',
    },
    {
      title: '校验环境',
      dataIndex: 'envCode',
      key: 'envCode',
      render: (value: any, record: any) => {
        return (
          <>
            {value.split(',').map((item: any) => (
              <Tag color="blue">{item}</Tag>
            ))}
          </>
        );
      },
    },
    {
      title: '升级截止日期',
      dataIndex: 'blockTime',
      key: 'blockTime',
      render: (value: any, record: any) => {
        return datetimeCellRender(value);
      },
    },
    {
      title: '校验级别',
      dataIndex: 'checkLevel',
      key: 'checkLevel',
    },
    {
      title: '校验开关',
      dataIndex: 'dependencyCheck',
      key: 'dependencyCheck',
      render: (enable: any, record: any, index: number) => {
        return (
          <Switch
            checked={enable === 1 ? true : false}
            onClick={() => {
              onSwitchEnableClick(record, index);
            }}
          />
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'opt',
      key: 'action',
      width: 130,
      render: (text: string, record: any, index: number) => {
        return (
          <Space>
            <a
              onClick={() => {
                onViewClick(record, index);
              }}
            >
              详情
            </a>
            <a
              onClick={() => {
                onEditClick(record, index);
              }}
            >
              编辑
            </a>
            <Popconfirm title="确认删除" okText="是" cancelText="否" onConfirm={() => {}}>
              <a
                type="link"
                onClick={() => {
                  onDelClick(record, index);
                }}
              >
                删除
              </a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ] as ColumnProps[];

export const operatorOption = [
  {
    label: '>',
    value: 'gt',
  },
  {
    label: '>=',
    value: 'ge',
  },
  {
    label: '<',
    value: 'lt',
  },
  {
    label: '<=',
    value: 'le',
  },
  {
    label: '=',
    value: 'eq',
  },
  {
    label: '!=',
    value: 'ne',
  },
];

export const operatorGreaterOption = [
  {
    label: '>',
    value: 'gt',
  },
  {
    label: '>=',
    value: 'ge',
  },
];
export const operatorLessOption = [
  {
    label: '<',
    value: 'lt',
  },
  {
    label: '<=',
    value: 'le',
  },
];
