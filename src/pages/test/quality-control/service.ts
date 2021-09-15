import appConfig from '@/app.config';

// const origin = 'http://turing.cfuture.shop:8010';
const origin = '';

/** 添加质量控制任务 */
export const createQCTask = `${origin}${appConfig.apiPrefix}/qc/qualitycontrol/createQCTask`;

/** 查询质量控制任务列表*/
export const queryQCTaskList = `${origin}${appConfig.apiPrefix}/qc/qualitycontrol/queryQCTaskList`;

/** 执行检测任务 */
export const executeQCTask = `${origin}${appConfig.apiPrefix}/qc/qualitycontrol/executeQCTask`;

/** 查询单测覆盖检测记录列表*/
export const queryUnittestCoverCheckLogList = `${origin}${appConfig.apiPrefix}/qc/qualitycontrol/queryUnittestCoverCheckLogList`;

/** 查询代码质量检测记录列表*/
export const queryCodeQualityCheckLogList = `${origin}${appConfig.apiPrefix}/qc/qualitycontrol/queryCodeQualityCheckLogList`;
