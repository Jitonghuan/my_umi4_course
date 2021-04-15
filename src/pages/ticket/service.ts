import ds from '@config/defaultSettings';

/**
 * 查询工单列表
 *
 * @param
 *  Id  工单的数据库自增ID
 *  ticketCode  工单的全局唯一code,模糊匹配
 *  ticketType  工单类型
 *  pageIndex
 *  pageSize
 */
export const queryTicketData = `${ds.apiPrefix}/ticketManage/list`;

/** 工单状态 */
export const statusMap: { label: string; value: number }[] = [
  { value: 1, label: '审批中' },
  { value: 2, label: '工单撤回' },
  { value: 3, label: '审批拒绝' },
  { value: 4, label: '审批通过执行成功' },
  { value: 5, label: '审批通过执行失败' },
];

// 创建订单
export const doCreateTicket = `${ds.apiPrefix}/ticketManage/create`;

// 获取工单类型枚举
export const queryTicketType = `${ds.apiPrefix}/ticketManage/getOptions`;

/**
 * 更新工单状态
 *
 * @param
 *  ticketCode  工单的全局唯一code
 *  status      工单状态
 */
export const doUpdateStatus = `${ds.apiPrefix}/ticketManage/updateStatus`;

/**
 * 上传接口
 */
export const doUploadUrl = `${ds.apiPrefix}/ticketManage/uploadFile`;
