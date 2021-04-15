export default (isEdit: boolean) => ({
  isShowReset: false,
  labelColSpan: 6,
  theme: 'basic',
  schema: [
    {
      // TODO 需要一个搜索人员的表单组件
      type: 'Custom',
      props: {
        label: '应用Owner',
        name: 'appOwner',
        custom: 'SearchUserSelect',
        // TODO 要不要必填
        required: true,
        placeholder: '输入花名/拼音',
      },
    },
    {
      // TODO 需要一个搜索人员的表单组件
      type: 'Custom',
      props: {
        label: '开发负责人',
        name: 'appOwner2',
        custom: 'SearchUserSelect',
        // TODO 要不要必填
        required: true,
        placeholder: '输入花名/拼音',
      },
    },
    {
      // TODO 需要一个搜索人员的表单组件
      type: 'Custom',
      props: {
        label: '发布负责人',
        name: 'appOwner3',
        custom: 'SearchUserSelect',
        // TODO 要不要必填
        required: true,
        placeholder: '输入花名/拼音',
      },
    },
    {
      // TODO 需要一个搜索人员的表单组件
      type: 'Custom',
      props: {
        label: 'CodeReviewer',
        name: 'appOwner4',
        custom: 'SearchUserSelect',
        // TODO 要不要必填
        required: true,
        placeholder: '输入花名/拼音',
      },
    },
    {
      // TODO 需要一个搜索人员的表单组件
      type: 'Custom',
      props: {
        label: '测试负责人',
        name: 'appOwner5',
        custom: 'SearchUserSelect',
        // TODO 要不要必填
        required: true,
        placeholder: '输入花名/拼音',
      },
    },
    {
      // TODO 需要一个搜索人员的表单组件
      type: 'Custom',
      props: {
        label: '自动化测试人员',
        name: 'appOwner6',
        custom: 'SearchUserSelect',
        // TODO 要不要必填
        required: true,
        placeholder: '输入花名/拼音',
      },
    },
    {
      // TODO 需要一个搜索人员的表单组件
      type: 'Custom',
      props: {
        label: '报警接收人',
        name: 'appOwner7',
        custom: 'SearchUserSelect',
        // TODO 要不要必填
        required: true,
        placeholder: '输入花名/拼音',
      },
    },
  ],
});
