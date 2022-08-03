export interface statusInterface {
  [key: string]: any;
}

export const STATUS_COLOR: statusInterface = {
  risk: '#d0c669',
  offline: '#c15454',
  health: '#65ca75',
};

export const STATUS_TEXT: statusInterface = {
  risk: '风险',
  offline: '离线',
  health: '健康',
};
