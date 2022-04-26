import { Html5Outlined, CodeOutlined } from '@ant-design/icons';
export type AppType = 'frontend' | 'backend';

const APP_TYPE_MAP = {
  frontend: '前端',
  backend: '后端',
};

const APP_TYPE_ICON = {
  frontend: <Html5Outlined />,
  backend: <CodeOutlined />,
};

export const colunms = [
  {
    title: '应用名',
    dataIndex: 'appName',
    width: 140,
  },
  {
    title: '应用code',
    dataIndex: 'appCode',
    width: 180,
    ellipsis: {
      showTitle: false,
    },
  },
  {
    title: '应用分类',
    dataIndex: 'appCategoryCode',
    width: 120,
  },
  {
    title: '应用类型',
    dataIndex: 'appType',
    width: 100,
    render: (appType: AppType) => (
      <>
        {APP_TYPE_ICON[appType]}&nbsp;
        {APP_TYPE_MAP[appType] || '--'}
      </>
    ),
  },
];
