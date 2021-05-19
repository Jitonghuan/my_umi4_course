import { AppType } from './types';

export default (params: {
  isEdit: boolean;
  appType?: AppType;
  belongData?: any[];
  businessData?: any[];
}) => ({
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
        disabled: params.isEdit,
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
        name: 'gitlab',
        required: true,
        placeholder: '请输入git地址',
      },
    },
    {
      type: 'Select',
      props: {
        label: '应用类型',
        name: 'appType',
        required: true,
        options: [
          {
            label: '前端',
            value: 'frontend',
          },
          {
            label: '后端',
            value: 'backend',
          },
        ],
      },
    },
    // 后端才有
    {
      isNotNeed: params.appType !== 'backend',
      type: 'Radio',
      props: {
        label: '是否包含二方包',
        name: 'isClient',
        required: true,
        options: [
          {
            label: '是',
            value: 1,
          },
          {
            label: '否',
            value: 0,
          },
        ],
      },
    },
    // 后端才有
    {
      isNotNeed: params.appType !== 'backend',
      type: 'Input',
      props: {
        label: 'jar包路径',
        name: 'jarPath',
        required: true,
        placeholder: '请输入jar包路径',
      },
    },
    {
      isNotNeed: params.appType === 'frontend',
      type: 'Input',
      props: {
        label: 'deployment名称',
        name: 'deploymentName',
        required: true,
        placeholder: '请输入deployment名称',
      },
    },
    {
      type: 'Select',
      props: {
        label: '所属',
        name: 'belong',
        required: true,
        options: params.belongData || [],
      },
    },
    // 前端才有
    {
      isNotNeed: params.appType !== 'frontend',
      type: 'Input',
      props: {
        label: '所属组',
        name: 'group',
      },
    },
    {
      type: 'Select',
      props: {
        label: '业务线',
        name: 'groupCode',
        options: params.businessData || [],
      },
    },
    {
      type: 'Input',
      props: {
        label: '业务模块',
        name: 'sysCode',
      },
    },
    {
      // TODO 已经和后端确认，先暂时输入人名，后期改成接口搜索下拉
      type: 'Input',
      props: {
        label: '应用负责人',
        name: 'owner',
        required: true,
        placeholder: '请输入应用负责人',
      },
    },
    {
      type: 'Custom',
      props: {
        label: '应用描述',
        name: 'desc',
        custom: 'Textarea',
        placeholder: '请输入应用描述',
      },
    },
  ].filter((item) => !(item.isNotNeed === true)),
});
