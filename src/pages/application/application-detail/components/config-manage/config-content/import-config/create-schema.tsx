export default () => ({
  isShowReset: false,
  labelColSpan: 6,
  theme: 'basic',
  schema: [
    {
      type: 'Input',
      props: {
        label: '配置路径',
        name: 'configPath',
        required: true,
        placeholder: '请输入',
      },
    },
  ],
});
