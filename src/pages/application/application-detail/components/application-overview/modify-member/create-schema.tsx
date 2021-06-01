export default (isEdit: boolean) => ({
  isShowReset: false,
  labelColSpan: 6,
  theme: 'basic',
  schema: [
    {
      type: 'Input',
      props: {
        label: '应用Owner',
        name: 'owner',
        required: true,
        placeholder: '请输入',
      },
    },
    {
      type: 'Input',
      props: {
        label: '开发负责人',
        name: 'developerOwner',
        placeholder: '请输入',
      },
    },
    {
      type: 'Input',
      props: {
        label: '发布负责人',
        name: 'deployOwner',
        placeholder: '请输入',
      },
    },
    {
      type: 'Input',
      props: {
        label: 'CodeReviewer',
        name: 'codeReviewer',
        placeholder: '请输入',
      },
    },
    {
      type: 'Input',
      props: {
        label: '测试负责人',
        name: 'testOwner',
        placeholder: '请输入',
      },
    },
    {
      type: 'Input',
      props: {
        label: '自动化测试人员',
        name: 'autoTestOwner',
        placeholder: '请输入',
      },
    },
    {
      type: 'Input',
      props: {
        label: '报警接收人',
        name: 'alertReceiver',
        placeholder: '请输入',
      },
    },
  ],
});
