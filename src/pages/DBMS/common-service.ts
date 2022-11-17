/* 数据变更管理接口文档 https://come-future.yuque.com/sekh46/bbgc7f/eh25u4#Wm5mi */
import appConfig from '@/app.config';
let env = appConfig.BUILD_ENV === 'prod' ? 'prod' : 'dev';
//kapi-base-dev.cfuture.shop/matrix-dmp
//const dmpApiPrefix=`http://kapi-base-${env}.cfuture.shop/matrix-dmp/v1`;
const dmpApiPrefix="/matrix-dmp"

export const searchUserUrl = `${appConfig.apiPrefix}/appManage/user/list`;
/** 查看环境 */
export const queryEnvList = `${appConfig.apiPrefix}/appManage/env/list`;
/** GET 实例列表 */
export const getInstanceList = `${appConfig.apiPrefix}/databaseManage/instance/list`;



/* GET 库查询 */
export const queryDatabasesApi = `${dmpApiPrefix}${appConfig.apiPrefix}/dmp/instance/databases`;

/* GET 表查询 */
export const queryTablesApi = `${dmpApiPrefix}${appConfig.apiPrefix}/dmp/instance/database/tables`;

/* GET 表字段查询 */
export const queryTableFieldsApi = `${dmpApiPrefix}${appConfig.apiPrefix}/dmp/instance/database/table/fields`;

/* POST sql查询*/
export const querySqlApi = `${dmpApiPrefix}${appConfig.apiPrefix}/dmp/sql/query`;

/* POST sql查询历史*/
export const queryLogsApi = `${dmpApiPrefix}${appConfig.apiPrefix}/dmp/sql/query/logs`;