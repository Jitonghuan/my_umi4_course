/** 审批状态map */
export const APPLY_STATUS_MAP: { [key: number]: string } = {
  0: '审批中',
  1: '审批成功',
  3: '已撤销',
};

/** 审批状态颜色map */
export const APPLY_STATUS_COLOR_MAP: { [key: number]: string } = {
  0: 'blue',
  1: 'green',
  3: '',
};

/** 发布类型options */
export const DEPLOY_TYPE_OPTIONS: { label: string; value: string }[] = [
  {
    label: '日常发布',
    value: 'daily',
  },
  {
    label: '紧急发布',
    value: 'emergency',
  },
];

/** 发布类型map */
export const DEPLOY_TYPE_MAP: { [key: string]: string } = {
  daily: '日常发布',
  emergency: '紧急发布',
};

/** 发布类型颜色map */
export const DEPLOY_TYPE_COLOR_MAP: { [key: string]: string } = {
  daily: 'green',
  emergency: 'red',
};
