export default () => ({
  isShowReset: false,
  labelColSpan: 6,
  theme: 'basic',
  schema: [
    {
      type: 'Input',
      props: {
        label: '分支名称',
        name: 'branchName',
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
