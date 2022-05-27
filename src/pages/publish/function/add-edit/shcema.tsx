// STATUS_ENUM = {
//     0: '新创建',
//     1: '修复中',
//     2: '延期修复',
//     3: '已修复',
//     4: '重新打开',
//     5: '关闭',
//     6: '无效',
//     7: '待发布',
//     8: '已发布',
//     9: '待修复'
// }

// demand.State == "开发中" || demand.State == "测试中" || demand.State == "验收中" || demand.State == "待发布"

type statusTypeItem = {
  color: string;
  text: string;
};

export const STATUS_TYPE: Record<string, statusTypeItem> = {
  验收中: { text: '验收中', color: 'purple' },
  测试中: { text: '测试中', color: 'geekblue' },
  开发中: { text: '开发中', color: 'green' },
  新创建: { text: '新创建', color: 'cyan' },
  修复中: { text: '修复中', color: 'geekblue' },
  延期修复: { text: '延期修复', color: 'orange' },
  已修复: { text: '已修复', color: 'green' },
  重新打开: { text: '重新打开', color: 'purple' },
  关闭: { text: '关闭', color: 'gold' },
  无效: { text: '无效', color: 'gray' },
  待发布: { text: '待发布', color: 'lime' },
  已发布: { text: '已发布', color: 'blue' },
  待修复: { text: '待修复', color: 'volcano' },
};
