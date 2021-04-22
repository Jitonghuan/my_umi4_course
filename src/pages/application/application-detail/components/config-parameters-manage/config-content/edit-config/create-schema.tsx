export default () => ({
  isShowReset: false,
  labelColSpan: 6,
  theme: 'basic',
  schema: [
    {
      type: 'Input',
      props: {
        label: 'Key',
        name: 'key',
        required: true,
        placeholder: '请输入',
      },
    },
    {
      type: 'Custom',
      props: {
        custom: 'Textarea',
        label: 'Value',
        name: 'value',
        required: true,
        placeholder: '请输入',
      },
    },
  ],
});
