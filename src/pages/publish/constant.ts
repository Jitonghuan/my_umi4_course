type statusTypeItem = {
  color: string;
  text: string;
};

export const statusType: Record<number, statusTypeItem> = {
  0: { text: '未发布', color: 'volcano' },
  1: { text: '已发布', color: 'green' },
  2: { text: '已上线', color: 'green' },
};
