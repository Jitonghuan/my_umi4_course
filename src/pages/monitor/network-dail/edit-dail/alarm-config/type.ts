
export const ALERT_LEVEL: Record<number, { text: string; value: number; color: string }> = {
    2: { text: '警告', value: 2, color: 'yellow' },
    3: { text: '严重', value: 3, color: 'orange' },
    4: { text: '灾难', value: 4, color: 'red' },
  };
  
  type StatusTypeItem = {
    color: string;
    tagText: string;
    buttonText: string;
    status: number;
  };
  
 export const STATUS_TYPE: Record<number, StatusTypeItem> = {
    0: { tagText: '已启用', buttonText: '禁用', color: 'green', status: 1 },
    1: { tagText: '未启用', buttonText: '启用', color: 'default', status: 0 },
  };
  