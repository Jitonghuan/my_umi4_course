// 过滤表单 schema
export const filterFormSchema = {
  theme: 'inline',
  isShowReset: false,
  labelColSpan: 3,
  schema: [
    {
      type: 'Input',
      props: {
        label: '标题',
        name: 'title',
        required: false,
      },
    },
    {
      type: 'Select',
      props: {
        label: '分类',
        name: 'type',
        required: false,
        options: [
          {
            label: '阿里云',
            value: '1',
          },
          {
            label: 'JumpServer',
            value: '2',
          },
          {
            label: 'VPN',
            value: '3',
          },
          {
            label: 'Rancher',
            value: '4',
          },
        ],
      },
    },
    {
      type: 'Select',
      props: {
        label: '状态',
        name: 'status',
        required: false,
        options: [
          {
            label: '审批中',
            value: '1',
          },
          {
            label: '工单撤回',
            value: '2',
          },
          {
            label: '审批拒绝',
            value: '3',
          },
          {
            label: '审批通过执行成功',
            value: '4',
          },
          {
            label: '审批通过执行失败',
            value: '5',
          },
        ],
      },
    },
  ],
};

// 表格 schema
export const tableSchema = [
  {
    rowKey: '1617768894732-0',
    title: 'ID',
    dataIndex: 'id',
    width: 100,
  },
  {
    rowKey: '1617768436369-1',
    title: '标题',
    dataIndex: 'title',
    width: 200,
  },
  {
    rowKey: '1617768897103-2',
    title: '分类',
    dataIndex: 'ticketType',
    width: 100,
  },
  {
    rowKey: '1617768899255-3',
    title: '状态',
    dataIndex: 'status',
    valueType: 'status',
    statusEnum: {
      '1': {
        text: '审批中',
        color: '#D16F0D',
      },
      '2': {
        text: '工单撤回',
        color: '#CC4631',
      },
      '3': {
        text: '审批拒绝',
        color: '#CC4631',
      },
      '4': {
        text: '审批通过执行成功',
        color: '#439D75',
      },
      '5': {
        text: '审批通过执行失败',
        color: '#CC4631',
      },
    },
    width: 100,
  },
  {
    title: '操作',
    dataIndex: 'operate',
    width: 100,
  },
];

// 新增工单
export const ticketCreateSchema = {
  isShowReset: false,
  labelColSpan: 3,
  theme: 'basic',
  schema: [
    {
      type: 'Radio',
      props: {
        label: '类型',
        name: 'type',
        required: true,
        options: [
          {
            label: '运维权限申请',
            value: '运维权限申请',
          },
          {
            label: '资源申请',
            value: '资源申请',
          },
        ],
      },
    },
    {
      type: 'Select',
      props: {
        label: '环境',
        name: 'env',
        required: true,
        options: [
          {
            label: '测试',
            value: 'test',
          },
        ],
      },
    },
    {
      type: 'Select',
      props: {
        label: '业务线',
        name: 'bus',
        required: true,
        options: [
          {
            label: '三甲',
            value: 'g3a',
          },
        ],
      },
    },
    {
      type: 'Select',
      props: {
        label: '申请项',
        name: 'apply',
        required: true,
        options: [
          {
            label: '测试',
            value: 'test',
          },
        ],
      },
    },
    {
      type: 'Input',
      props: {
        label: '备注',
        name: 'remark',
        required: false,
      },
    },
  ],
};
