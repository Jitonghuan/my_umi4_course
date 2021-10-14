import { addAPIPrefix } from '@/utils';

/** GET 查看质量分规则 */
export const getGradeInfo = addAPIPrefix('/qc/codeQuality/getGradeInfo');

/** GET 获取排行榜数据 */
export const getRanking = addAPIPrefix('/qc/codeQuality/ranking');

/** GET 获取应用服务最近一段时间的指标趋势数据 */
export const getTrend = addAPIPrefix('qc/codeQuality/trend');

/** GET 获取任务列表 */
export const getTaskList = addAPIPrefix('qc/codeQuality/task/list');

/** GET 获取任务详情 */
export const getTaskInfo = addAPIPrefix('/qc/codeQuality/task');

/** POST 新增/删除/更新/查看/任务 */
export const operateTask = addAPIPrefix('/qc/codeQuality/task');

/** POST 收藏任务 */
export const taskCare = addAPIPrefix('/qc/codeQuality/task/care');

/** POST 取消收藏任务 */
export const taskCareCancel = addAPIPrefix('/qc/codeQuality/task/careCancel');

/** POST 执行任务 */
export const taskExcute = (taskId: Number) => addAPIPrefix(`/qc/codeQuality/task/excute/${taskId}`);

/** GET 查看任务结果 */
export const taskResults = (taskId: Number) => {
  return addAPIPrefix(`/qc/codeQuality/task/${taskId}/results`);
};

/** GET 获取应用分类列表 */
export const getAppCateList = addAPIPrefix('/qc/others/appCategory/all');
export const getAppCateList_new = addAPIPrefix('qc/matrix/appCategory/list');

/** GET 获取应用Code列表 */
export const getAppCodeList_old = addAPIPrefix('/qc/others/app/all');

/** GET 获取应用信息列表 */
export const getAppInfoList = addAPIPrefix('/qc/matrix/app/list');

/** GET 获取应用分支 */
export const getAppBranch = addAPIPrefix('/qc/matrix/branch/list');

/** GET 获取所有应用已配置的卡点规则 */
export const getAllAppCodeQualityConf = addAPIPrefix('/qc/codeQuality/guard/allConf');
