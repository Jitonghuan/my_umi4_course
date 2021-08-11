import { AppType, AppDevelopLanguage } from './types';

export default (params: {
  isEdit: boolean;
  appType?: AppType;
  appDevelopLanguage?: AppDevelopLanguage;
  categoryData?: any[];
  businessData?: any[];
  baseImage?: any[];
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
        name: 'gitAddress',
        required: true,
        placeholder: '请输入应用gitlab http地址',
      },
    },
    {
      type: 'Input',
      props: {
        label: 'git分组',
        name: 'gitGroup',
        placeholder: '请输入应用gitlab 分组信息',
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
    {
      isNotNeed: params.appType !== 'backend',
      type: 'Select',
      props: {
        label: '开发语言',
        name: 'appDevelopLanguage',
        required: true,
        options: [
          {
            label: 'GOLANG',
            value: 'golang',
          },
          {
            label: 'JAVA',
            value: 'java',
          },
          {
            label: 'PYTHON',
            value: 'python',
          },
        ],
      },
    },
    // 后端才有
    {
      isNotNeed: params.appDevelopLanguage !== 'java',
      type: 'Radio',
      props: {
        label: '是否为二方包',
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
    //java才有
    {
      isNotNeed: params.appDevelopLanguage !== 'java',
      type: 'Radio',
      props: {
        label: '是否包含二方包',
        name: 'isContainClient',
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
      isNotNeed: params.appDevelopLanguage !== 'java',
      type: 'Input',
      props: {
        label: 'pom文件路径',
        name: 'deployPomPath',
        required: true,
        placeholder: '请输入应用的pom文件的相对路径',
      },
    },
    {
      type: 'Input',
      props: {
        label: '应用部署名',
        name: 'deploymentName',
        required: true,
        placeholder: '请输入deployment名称',
      },
    },
    {
      type: 'Select',
      props: {
        label: '应用分类',
        name: 'appCategoryCode',
        required: true,
        options: params.categoryData || [],
      },
    },
    {
      type: 'Select',
      props: {
        label: '应用组',
        name: 'appGroupCode',
        options: params.businessData || [],
      },
    },
    // {
    //   type: 'Select',
    //   props: {
    //     label: '基础镜像',
    //     name: 'baseImage',
    //     options: params.baseImage || [],
    //   },
    // },
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
