// 通用发布环境：currency-deploy
// 前端专有环境：fe-exclusive
// 离线打包环境：offline-pack
import {QuestionCircleOutlined} from '@ant-design/icons';
import { Space, Popconfirm, Tooltip } from 'antd';
export const envTypeOptions = [
  {
    label: '通用发布环境',
    value: 'currency-deploy',
  },
  {
    label: '前端专有环境',
    value: 'fe-exclusive',
  },
  {
    label: '离线打包环境',
    value: 'offline-pack',
  },
];
export const envTypeCodeOptions = [
  {
    label: 'DEV',
    value: 'dev',
  },
  {
    label: 'TEST',
    value: 'test',
  },
  {
    label: 'PRE',
    value: 'pre',
  },
  {
    label: 'PROD',
    value: 'prod',
  },
];

export const bucketTypeOptions = [
  {
    label:  () => {
      return <>
      独占<Tooltip title="资源路径：/BucketName/AppDeploymentName/dist/"><QuestionCircleOutlined /></Tooltip>
      </>;
    },
    value: 'oneself',
  },
  {
    label:  () => {
      return <>
      共享<Tooltip title="资源路径：/BucketName/EnvCode/AppDeploymentName/dist"><QuestionCircleOutlined /></Tooltip>
      </>;
    },
    value: 'share',
  },
  
];
