import { Popconfirm, Tooltip, Switch, Tag, Space } from 'antd';
import type { ColumnProps } from '@cffe/vc-hulk-table';
import { datetimeCellRender } from '@/utils';
export const levelOption = [
  { label: '警告', value: 'warning' },
  { label: '阻断', value: 'block' },
];

const levelOptionMap: any = {
  warning: { label: '警告', value: 'warning', color: 'orange' },
  block: { label: '阻断', value: 'block', color: 'red' },
};

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
      width: 20,
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
      render: (value: string) => {
        return (
          <Tooltip title={value} placement="topLeft">
            {value}
          </Tooltip>
        );
      },
    },
    {
      title: 'artifactId',
      dataIndex: 'artifactId',
      key: 'artifactId',
      render: (value: string) => {
        return (
          <Tooltip title={value} placement="topLeft">
            {value}
          </Tooltip>
        );
      },
    },
    {
      title: '版本范围',
      dataIndex: 'versionRange',
      key: 'versionRange',
      render: (value: string) => {
        // 'gt':'>',
        // 'ge':'>=',
        // 'lt':'<',
        // 'le':'<=',
        // 'eq':'=',
        // 'ne':'!='
        let dataObj: any = {
          gt: '>',
          ge: '>=',
          lt: '<',
          le: '<=',
          eq: '=',
          ne: '!=',
        };
        let dataobj2: any = {
          '>': '(',
          '>=': '[',
          '<': ')',
          '<=': ']',
          '=': '',
          '!=': '!',
        };
        let label1: any = '';
        let label2: any = '';
        let versionRange = value?.includes(',') ? value?.split(',') : [value];
        if (value?.includes(',') && versionRange.length === 2) {
          versionRange.map((ele: any, index: any) => {
            if (index == versionRange.length - 1) {
              const item2 = ele.split('@')[0];
              const version2 = ele.split('@')[1];

              label2 = `${version2}${dataobj2[dataObj[item2]]}`;
            } else {
              const item1 = ele.split('@')[0];
              const version1 = ele.split('@')[1];

              label1 = `${dataobj2[dataObj[item1]]}${version1}`;
            }
          });
        }
        if (!value?.includes(',') && versionRange.length === 1) {
          versionRange.map((ele: any, index: any) => {
            const item1 = ele.split('@')[0];
            const version1 = ele.split('@')[1];

            if (item1 === 'gt' || item1 === 'ge') {
              label1 = `${dataobj2[dataObj[item1]]}${version1})`;
            }
            if (item1 === 'lt' || item1 === 'le') {
              label1 = `(${version1}${dataobj2[dataObj[item1]]}`;
            }
            if (item1 === 'ne') {
              label1 = `${dataobj2[dataObj[item1]]}${version1}`;
            }
            if (item1 === 'eq') {
              label1 = `${version1}`;
            }
          });
        }

        let labela: any = label2 !== '' ? label1 + ',' + label2 : label1;
        return <span> {labela}</span>;
      },
    },
    {
      title: '校验环境',
      dataIndex: 'envCode',
      key: 'envCode',
      render: (value: any, record: any) => {
        return (
          <>
            <Tooltip
              placement="topLeft"
              title={value.split(',').map((item: any) => (
                <Tag color="blue">{item}</Tag>
              ))}
            >
              {value.split(',').map((item: any) => (
                <Tag color="blue">{item}</Tag>
              ))}
            </Tooltip>
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
      width: 80,
      render: (value: any, record: any) => {
        return <Tag color={levelOptionMap[value]?.color || 'default'}>{levelOptionMap[value]?.label || ''}</Tag>;
      },
    },
    {
      title: '校验开关',
      dataIndex: 'isEnable',
      key: 'isEnable',
      width: 80,
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
            <Popconfirm
              title="确认删除"
              okText="是"
              cancelText="否"
              onConfirm={() => {
                onDelClick(record, index);
              }}
            >
              <a style={{ color: 'red' }}>删除</a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ] as ColumnProps[];
let versionRange = ['gt@2.0.0', 'lt@9.0.0'];

// initData?.versionRange;
//[ge@1.0.9]
//[gt@2.0.0,lt@9.0.0]

// {
//   v:"d1.0.9",
//   type:"<",
//   label:'(1.0.9)'
// }

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
