import appConfig from '@/app.config';

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
import { addAPIPrefix } from '@/utils';

export const queryTicketData = `${appConfig.apiPrefix}/ticketManage/list`;

/** 工单状态 */
export const statusMap: { label: string; value: number }[] = [
  { value: 1, label: '审批中' },
  { value: 2, label: '工单撤回' },
  { value: 3, label: '审批拒绝' },
  { value: 4, label: '审批通过执行成功' },
  { value: 5, label: '审批通过执行失败' },
];

// 创建订单
export const doCreateTicket = `${appConfig.apiPrefix}/ticketManage/create`;

// 获取工单类型枚举
export const queryTicketType = `${appConfig.apiPrefix}/ticketManage/getOptions`;

/**
 * 更新工单状态
 *
 * @param
 *  ticketCode  工单的全局唯一code
 *  status      工单状态
 */
export const doUpdateStatus = `${appConfig.apiPrefix}/ticketManage/updateStatus`;

/**
 * 上传接口
 */
export const doUploadUrl = `${appConfig.apiPrefix}/ticketManage/uploadFile`;
//告警工单列表
export const alertTickets = addAPIPrefix('/ticketManage/alerttickets/list');
//告警历史
export const alertRecord = addAPIPrefix('/monitorManage/alertrecord/list');
