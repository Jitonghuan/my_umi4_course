import { addAPIPrefix } from '@/utils';

/** GET 查看质量分规则 */
export const getGradeInfo = addAPIPrefix('/qc/codeQuality/getGradeInfo');

/** GET 获取排行榜数据 */
export const getRanking = addAPIPrefix('/qc/codeQuality/ranking');

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
export const taskExcute = addAPIPrefix('/qc/codeQuality/task/excute');

/** GET 获取应用分类列表 */
export const getAppCateList = addAPIPrefix('/others/appCategory/all');

/** GET 获取应用Code列表 */
export const getAppCodeList = addAPIPrefix('/others/app/all');

/** GET 获取所有应用已配置的卡点规则 */
export const getAllAppCodeQualityConf = addAPIPrefix('/qc/codeQuality/guard/allConf');
