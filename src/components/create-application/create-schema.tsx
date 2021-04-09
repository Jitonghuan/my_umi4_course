export default () => ({
  isShowReset: false,
  labelColSpan: 6,
  theme: 'basic',
  schema: [
    {
      type: 'Input',
      props: {
        label: 'APPCODE',
        name: 'appCode',
        required: true,
        placeholder: '请输入应用代码',
      },
    },
    {
      type: 'Input',
      props: {
        label: '应用名',
        name: 'appName',
        required: true,
        placeholder: '请输入应用名称',
      },
    },
    {
      type: 'Input',
      props: {
        label: 'git地址',
        name: 'gitAddress',
        required: true,
        placeholder: '请输入git地址',
      },
    },
    {
      type: 'Input',
      props: {
        label: 'jar包路径',
        name: 'jarPath',
        placeholder: '请输入jar包路径',
      },
    },
    {
      type: 'Radio',
      props: {
        label: '是否包含二方包',
        name: 'isContainTwo',
        required: true,
        options: [
          {
            label: '是',
            value: '1',
          },
          {
            label: '否',
            value: '0',
          },
        ],
      },
    },
    {
      type: 'Select',
      props: {
        label: '应用类型',
        name: 'appType',
        options: [
          {
            label: 'TODO',
            value: 'test',
          },
        ],
      },
    },
    {
      type: 'Select',
      props: {
        label: '所属',
        name: 'belong',
        options: [
          {
            label: 'TODO',
            value: 'g3a',
          },
        ],
      },
    },
    {
      type: 'Select',
      props: {
        label: '业务线',
        name: 'busLine',
        options: [
          {
            label: 'TODO',
            value: 'test',
          },
        ],
      },
    },
    {
      type: 'Select',
      props: {
        label: '业务模块',
        name: 'busModule',
        options: [
          {
            label: 'TODO',
            value: 'test',
          },
        ],
      },
    },
    {
      type: 'Input',
      props: {
        label: '责任人',
        name: 'person',
        placeholder: '请输入责任人',
      },
    },
    {
      // TODO 换成 textarea，待参考创建工单
      type: 'Input',
      props: {
        label: '应用描述',
        name: 'appDesc',
        placeholder: '请输入应用描述',
      },
    },
  ],
});
