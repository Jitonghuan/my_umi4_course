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
        onKeyDown: (e: any) => {
          if (e.keyCode === 13) {
            // 回车键
            e.stopPropagation();
            e.preventDefault();
            return false;
          }
        },
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
