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
//kapi-base-dev.cfuture.shop/matrix-dmp
const dmpApiPrefix=`http://kapi-base-${env}.cfuture.shop/matrix-dmp/v1`;
/* 权限 */
/* GET  1、 查询权限列表 */
export const queryPrivListApi = `${dmpApiPrefix}/dmp/user/priv/list`;
/* DELETE 2、 删除权限 */
export const delPrivApi = `${dmpApiPrefix}/dmp/user/priv`;
/* 工单 */
/* GET 3、查询权限申请工单列表 */
export const queryWorkflowPrivListApi = `${dmpApiPrefix}/dmp/workflow/priv/list`;

/* GET 4、查询sql变更工单列表 */
export const querySqlListApi = `${dmpApiPrefix}/dmp/workflow/sql/list`;

/* POST 5、创建权限申请工单 */
export const createPrivApi = `${dmpApiPrefix}/dmp/workflow/priv/create`;

/* GET 6、查询权限申请工单详情 */
export const getPrivInfoApi = `${dmpApiPrefix}/dmp/workflow/priv/info`;

/* POST 7、审批工单 */
export const auditApi = `${dmpApiPrefix}/dmp/workflow/audit`;

/* GET 8、查询权限申请工单详情 */
export const getSqlInfoApi = `${dmpApiPrefix}/dmp/workflow/sql/info`;

/* POST 9、创建sql变更工单 */
export const createSqlApi = `${dmpApiPrefix}/dmp/workflow/sql/create`;

/* POST 10、sql检测 */
export const runSqlApi  = `${dmpApiPrefix}/dmp/workflow/sql/run`;

/* POST 11、sql执行 */
export const checkSqlApi = `${dmpApiPrefix}/dmp/sql/check`;
//dmp/workflow/log
export const workflowLogApi = `${dmpApiPrefix}/dmp/workflow/logs`;
//dmp/workflow/audit/currentAudits
export const currentAuditsApi = `${dmpApiPrefix}/dmp/workflow/audit/currentAudits`;
/* -------------------------------数据管理二期-------------------------------- */
//查询安全规则列表
export const getRuleSetListApi = `${dmpApiPrefix}/dmp/rule/ruleSet/list`;
//新建安全规则
export const createRuleSetApi = `${dmpApiPrefix}/dmp/rule/ruleSet/create`;
//更新安全规则
export const updateRuleSetApi = `${dmpApiPrefix}/dmp/rule/ruleSet/update`;


//查询集群规则列表
export const getInstanceListApi = `${dmpApiPrefix}/dmp/rule/instance/list`;
//更新安全规则
export const updateInstanceRuleSetApi = `${dmpApiPrefix}/dmp/rule/instance/ruleSet/update`;

/* ---------------工单变更详情------------- */
//获得结构变更工单研发流程和下一个环境
export const getddlDesignFlowApi = `${dmpApiPrefix}/dmp/workflow/sql/ddl/designFlow`;
//发布到下一个环境
export const createNextDDLApi = `${dmpApiPrefix}/dmp/workflow/sql/nextDDL/create`;
//根据parentWfId和envType查询sql工单详情
export const getSqlDdlInfoApi = `${dmpApiPrefix}/dmp/workflow/sql/ddl/info`;