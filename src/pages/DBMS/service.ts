
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
// `${appConfig.apiPrefix}`;
let env = appConfig.BUILD_ENV === 'prod' ? 'prod' : 'dev';
//kapi-base-dev.cfuture.shop/matrix-dmp
//const dmpApiPrefix=`http://kapi-base-${env}.cfuture.shop/matrix-dmp/v1`;
const dmpApiPrefix="/matrix-dmp"
/* 权限 */
/* GET  1、 查询权限列表 */
export const queryPrivListApi = `${appConfig.apiPrefix}${dmpApiPrefix}/dmp/user/priv/list`;
/* DELETE 2、 删除权限 */
export const delPrivApi = `${appConfig.apiPrefix}${dmpApiPrefix}/dmp/user/priv`;
/* 工单 */
/* GET 3、查询权限申请工单列表 */
export const queryWorkflowPrivListApi = `${appConfig.apiPrefix}${dmpApiPrefix}/dmp/workflow/priv/list`;

/* GET 4、查询sql变更工单列表 */
export const querySqlListApi = `${appConfig.apiPrefix}${dmpApiPrefix}/dmp/workflow/sql/list`;

/* POST 5、创建权限申请工单 */
export const createPrivApi = `${appConfig.apiPrefix}${dmpApiPrefix}/dmp/workflow/priv/create`;

/* GET 6、查询权限申请工单详情 */
export const getPrivInfoApi = `${appConfig.apiPrefix}${dmpApiPrefix}/dmp/workflow/priv/info`;

/* POST 7、审批工单 */
export const auditApi = `${appConfig.apiPrefix}${dmpApiPrefix}/dmp/workflow/audit`;

/* GET 8、查询权限申请工单详情 */
export const getSqlInfoApi = `${appConfig.apiPrefix}${dmpApiPrefix}/dmp/workflow/sql/info`;

/* POST 9、创建sql变更工单 */
export const createSqlApi = `${appConfig.apiPrefix}${dmpApiPrefix}/dmp/workflow/sql/create`;

/* POST 10、sql检测 */
export const runSqlApi  = `${appConfig.apiPrefix}${dmpApiPrefix}/dmp/workflow/sql/run`;

/* POST 11、sql执行 */
export const checkSqlApi = `${appConfig.apiPrefix}${dmpApiPrefix}/dmp/sql/check`;
//dmp/workflow/log
export const workflowLogApi = `${appConfig.apiPrefix}${dmpApiPrefix}/dmp/workflow/logs`;
//dmp/workflow/audit/currentAudits
export const currentAuditsApi = `${appConfig.apiPrefix}${dmpApiPrefix}/dmp/workflow/audit/currentAudits`;
/* -------------------------------数据管理二期-------------------------------- */
//查询安全规则列表
export const getRuleSetListApi = `${appConfig.apiPrefix}${dmpApiPrefix}/dmp/rule/ruleSet/list`;
//新建安全规则
export const createRuleSetApi = `${appConfig.apiPrefix}${dmpApiPrefix}/dmp/rule/ruleSet/create`;
//更新安全规则
export const updateRuleSetApi = `${appConfig.apiPrefix}${dmpApiPrefix}/dmp/rule/ruleSet/update`;


//查询集群规则列表
export const getInstanceListApi = `${appConfig.apiPrefix}${dmpApiPrefix}/dmp/rule/instance/list`;
//更新安全规则
export const updateInstanceRuleSetApi = `${appConfig.apiPrefix}${dmpApiPrefix}/dmp/rule/instance/ruleSet/update`;

/* ---------------工单变更详情------------- */
//获得结构变更工单研发流程和下一个环境
export const getddlDesignFlowApi = `${appConfig.apiPrefix}${dmpApiPrefix}/dmp/workflow/sql/ddl/designFlow`;
//发布到下一个环境
export const createNextDDLApi = `${appConfig.apiPrefix}${dmpApiPrefix}/dmp/workflow/sql/nextDDL/create`;
//根据parentWfId和envType查询sql工单详情
export const getSqlDdlInfoApi = `${appConfig.apiPrefix}${dmpApiPrefix}/dmp/workflow/sql/ddl/info`;
//获得回滚语句
export const rollbackSQLApi = `${appConfig.apiPrefix}${dmpApiPrefix}/dmp/workflow/sql/rollbackSQL`;

