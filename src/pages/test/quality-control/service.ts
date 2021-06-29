import ds from '@config/defaultSettings';

// const origin = 'http://turing.cfuture.shop:8010';
const origin = '';

/** 添加质量控制任务 */
export const createQCTask = `${origin}${ds.apiPrefix}/qc/qualitycontrol/createQCTask`;

/** 查询质量控制任务列表*/
export const queryQCTaskList = `${origin}${ds.apiPrefix}/qc/qualitycontrol/queryQCTaskList`;

/** 执行检测任务 */
export const executeQCTask = `${origin}${ds.apiPrefix}/qc/qualitycontrol/executeQCTask`;

/** 查询单测覆盖检测记录列表*/
export const queryUnittestCoverCheckLogList = `${origin}${ds.apiPrefix}/qc/qualitycontrol/queryUnittestCoverCheckLogList`;

/** 查询代码质量检测记录列表*/
export const queryCodeQualityCheckLogList = `${origin}${ds.apiPrefix}/qc/qualitycontrol/queryCodeQualityCheckLogList`;
