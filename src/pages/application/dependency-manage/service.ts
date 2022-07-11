import { addAPIPrefix } from '@/utils';
import { delRequest, getRequest, postRequest, putRequest } from '@/utils/request';
/* POST 1、 新增任务接口  */

export const createJob = addAPIPrefix('/opsManage/job/create');

/* PUT 2、 编辑任务接口 */

export const updateJob = addAPIPrefix('/opsManage/job/update');

/* DELETE 3、 删除任务接口 */

export const deleteJob = addAPIPrefix('/opsManage/job/delete');

/* GET 4、 查询任务接口 */

export const getJobList = addAPIPrefix('/opsManage/job/list');

/* GET 5、 查询任务执行情况接口 */

export const getTaskList = addAPIPrefix('/opsManage/task/list');

/* GET 6、 获取容器列表接口 */

export const getRuleListApi = addAPIPrefix('/appManage/dependencyManage/getRuleList');

export const queryAppListApi = addAPIPrefix('/appManage/list');

/* GET 7、 获取需要依赖校验和不需要依赖校验的应用 */
export const getDependencyManageAppListApi = addAPIPrefix('/appManage/dependencyManage/appList');

/* POST 8、 应用依赖校验开关 */
export const updateAppRuleApi = addAPIPrefix('/appManage/dependencyManage/updateAppRule');

/* GET 9、 查询校验结果 */
export const checkResultApi = addAPIPrefix('/appManage/dependencyManage/checkResult');

// 新增依赖规则
export const addRule = (data: any) => {
  const url = addAPIPrefix('/appManage/dependencyManage/addRule');
  return postRequest(url, { data: data });
};

// 获取依赖规则列表
export const getRuleList = (data: any) => {
  const url = addAPIPrefix('/appManage/dependencyManage/getRuleList');
  return getRequest(url, { data: data });
};

// 编辑依赖规则
export const updateRule = (data: any) => {
  const url = addAPIPrefix('/appManage/dependencyManage/updateRule');
  return putRequest(url, { data: data });
};

// 获取需要依赖校验和不需要依赖校验的应用
export const getDependencyManageAppList = (data: any) => {
  const url = addAPIPrefix('/appManage/dependencyManage/appList');
  return putRequest(url, { data: data });
};

// 应用依赖校验开关
export const updateRuleApps = (data: any) => {
  const url = addAPIPrefix('/appManage/dependencyManage/updateAppRule');
  return putRequest(url, { data: data });
};
