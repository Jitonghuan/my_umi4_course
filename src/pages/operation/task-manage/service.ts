//任务管理接口
//接口文档地址：https://come-future.yuque.com/sekh46/bbgc7f/ipkot4
//2022/05/24 13:50
import { addAPIPrefix } from '@/utils';

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

export const getListContainer = addAPIPrefix('/appManage/deployInfo/defaultInstance/listContainer');

export const queryAppListApi = addAPIPrefix('/appManage/list');

/** 获取应用环境 */
export const listAppEnv = addAPIPrefix('/appManage/env/listAppEnv');

/** 获取应用环境 */
export const getNodeList = addAPIPrefix('/appManage/node/list');
