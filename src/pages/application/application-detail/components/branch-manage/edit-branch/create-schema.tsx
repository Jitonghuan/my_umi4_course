export default () => ({
  isShowReset: false,
  labelColSpan: 6,
  theme: 'basic',
  schema: [
    {
      type: 'Input',
      props: {
        label: '应用Code',
        name: 'appCode',
        required: true,
        placeholder: '请输入应用Code',
      },
    },
    {
      type: 'Input',
      props: {
        label: '分支名称',
        name: 'appName',
        required: true,
        placeholder: '请输入',
        addonBefore: 'feature_',
      },
    },
    {
      type: 'Custom',
      props: {
        custom: 'Textarea',
        label: '描述',
        name: 'desc',
        placeholder: '请输入描述',
      },
    },
  ],
});
