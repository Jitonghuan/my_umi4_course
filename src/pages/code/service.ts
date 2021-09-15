import appConfig from '@/app.config';
/**
 * service
 * @description 用于存在接口数据或者接口调用函数
 * @create 2021-04-15 15:57:08
 */

// 周期数据类型
export type ITimeItem = {
  id: number;
  createUser: string;
  cycleDate: string;
  cycleType: string;
  gmtCreate: string;
  gmtModify: string;
  modifyUser: string;
};

// 周期数据获取
export const queryTimeDataApi = `${appConfig.apiPrefix}/codeManage/statisticsCycle/list`;

/** 表格数据获取 */
export const queryTableDataApi = `${appConfig.apiPrefix}/codeManage/rankingList/list`;

// 详情页面表格数据
export const queryDetailTableDataApi = `${appConfig.apiPrefix}/codeManage/statisticsCode/list`;
