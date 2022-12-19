
/*
 * @Author: muxi.jth 2016670689@qq.com
 * @Date: 2022-10-10 13:51:30
 * @LastEditors: muxi.jth 2016670689@qq.com
 * @LastEditTime: 2022-10-10 16:51:41
 * @FilePath: /fe-matrix/src/pages/DBMS/service.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/* 数据变更管理接口文档 https://come-future.yuque.com/sekh46/bbgc7f/eh25u4#Wm5mi */
//二期文档 https://come-future.yuque.com/sekh46/bbgc7f/ghkm6m#Qj4D0
import appConfig from '@/app.config';
let env = appConfig.BUILD_ENV === 'prod' ? 'prod' : 'dev';
//const dmpApiPrefix=`http://kapi-base-${env}.cfuture.shop/matrix-dmp/v1`;
const dmpApiPrefix="/matrix-dmp"
/* 权限 */
/* GET  1、 查询权限列表 */
export const queryPrivListApi = `${dmpApiPrefix}${appConfig.apiPrefix}/dmp/user/priv/list`;
/* DELETE 2、 删除权限 */
export const delPrivApi = `${dmpApiPrefix}${appConfig.apiPrefix}/dmp/user/priv`;
/* 工单 */
/* GET 3、查询权限申请工单列表 */
export const queryWorkflowPrivListApi = `${dmpApiPrefix}${appConfig.apiPrefix}/dmp/workflow/priv/list`;

/* GET 4、查询sql变更工单列表 */
export const querySqlListApi = `${dmpApiPrefix}${appConfig.apiPrefix}/dmp/workflow/sql/list`;

/* POST 5、创建权限申请工单 */
export const createPrivApi = `${dmpApiPrefix}${appConfig.apiPrefix}/dmp/workflow/priv/create`;

/* GET 6、查询权限申请工单详情 */
export const getPrivInfoApi = `${dmpApiPrefix}${appConfig.apiPrefix}/dmp/workflow/priv/info`;

/* POST 7、审批工单 */
export const auditApi = `${dmpApiPrefix}${appConfig.apiPrefix}/dmp/workflow/audit`;

/* GET 8、查询权限申请工单详情 */
export const getSqlInfoApi = `${dmpApiPrefix}${appConfig.apiPrefix}/dmp/workflow/sql/info`;

/* POST 9、创建sql变更工单 */
export const createSqlApi = `${dmpApiPrefix}${appConfig.apiPrefix}/dmp/workflow/sql/create`;

/* POST 10、sql检测 */
export const runSqlApi  = `${dmpApiPrefix}${appConfig.apiPrefix}/dmp/workflow/sql/run`;

/* POST 11、sql执行 */
export const checkSqlApi = `${dmpApiPrefix}${appConfig.apiPrefix}/dmp/sql/check`;
//dmp/workflow/log
export const workflowLogApi = `${dmpApiPrefix}${appConfig.apiPrefix}/dmp/workflow/logs`;
//dmp/workflow/audit/currentAudits
export const currentAuditsApi = `${dmpApiPrefix}${appConfig.apiPrefix}/dmp/workflow/audit/currentAudits`;
/* -------------------------------数据管理二期-------------------------------- */
//查询安全规则列表
export const getRuleSetListApi = `${dmpApiPrefix}${appConfig.apiPrefix}/dmp/rule/ruleSet/list`;
//新建安全规则
export const createRuleSetApi = `${dmpApiPrefix}${appConfig.apiPrefix}/dmp/rule/ruleSet/create`;
//更新安全规则
export const updateRuleSetApi = `${dmpApiPrefix}${appConfig.apiPrefix}/dmp/rule/ruleSet/update`;
//删除安全规则
export const deleteRuleSetApi = `${dmpApiPrefix}${appConfig.apiPrefix}/dmp/rule/ruleSet/delete`;


//查询集群规则列表
export const getInstanceListApi = `${dmpApiPrefix}${appConfig.apiPrefix}/dmp/rule/instance/list`;
//更新安全规则
export const updateInstanceRuleSetApi = `${dmpApiPrefix}${appConfig.apiPrefix}/dmp/rule/instance/ruleSet/update`;

/* ---------------工单变更详情------------- */
//获得结构变更工单研发流程和下一个环境
export const getddlDesignFlowApi = `${dmpApiPrefix}${appConfig.apiPrefix}/dmp/workflow/sql/ddl/designFlow`;
//发布到下一个环境
export const createNextDDLApi = `${dmpApiPrefix}${appConfig.apiPrefix}/dmp/workflow/sql/nextDDL/create`;
//根据parentWfId和envType查询sql工单详情
export const getSqlDdlInfoApi = `${dmpApiPrefix}${appConfig.apiPrefix}/dmp/workflow/sql/ddl/info`;
//获得回滚语句
export const rollbackSQLApi = `${dmpApiPrefix}${appConfig.apiPrefix}/dmp/workflow/sql/rollbackSQL`;

//下载数据
export const exportResultApi = `${dmpApiPrefix}${appConfig.apiPrefix}/dmp/sql/query/export`;

export const getSyncInfoApi = `${dmpApiPrefix}${appConfig.apiPrefix}/dmp/workflow/sync/info`;

//对比数据库结构
export const compareSyncInfoApi = `${dmpApiPrefix}${appConfig.apiPrefix}/dmp/workflow/sync/compare`;
//提交结构同步工单
export const createSyncInfoApi = `${dmpApiPrefix}${appConfig.apiPrefix}/dmp/workflow/sync/create`;


