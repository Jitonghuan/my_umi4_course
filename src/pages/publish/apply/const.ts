/** 审批状态map 申请状态 0/1/2/3 申请中/申请通过/申请拒绝/撤回 */
export const APPLY_STATUS_MAP: { [key: number]: string } = {
  0: '申请中',
  1: '申请通过',
  2: '申请拒绝',
  3: '已撤回',
};

/** 审批状态颜色map */
export const APPLY_STATUS_COLOR_MAP: { [key: number]: string } = {
  0: 'blue',
  1: 'green',
  2: 'red',
  3: 'red',
};

/** 部署类型 */
export const DEPLOY_TYPE_OPTIONS: { label: string; value: string }[] = [
  {
    label: '前端发布',
    value: 'frontend',
  },
  {
    label: '后端发布',
    value: 'backend',
  },
];

/** 发布类型options */
export const EMERGENCY_TYPE_OPTIONS: { label: string; value: string }[] = [
  {
    label: '日常发布',
    value: 'daily',
  },
  {
    label: '紧急发布',
    value: 'emergencyNeed',
  },
];

/** 发布类型map */
export const EMERGENCY_TYPE_MAP: { [key: string]: string } = {
  daily: '日常发布',
  emergencyNeed: '紧急发布',
};

/** 发布类型颜色map */
export const EMERGENCY_TYPE_COLOR_MAP: { [key: string]: string } = {
  daily: 'green',
  emergencyNeed: 'red',
};

/** 应用类型*/
export const APP_TYPE_MAP = {
  frontend: '前端',
  backend: '后端',
};

export type AppType = 'frontend' | 'backend';
