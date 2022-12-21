//数据库管理接口
//https://come-future.yuque.com/sekh46/bbgc7f/zphmwi/edit#KjKDb
import appConfig from '@/app.config';
let env = appConfig.BUILD_ENV === 'prod' ? 'prod' : 'dev';
const dbmsApiPrefix=`matrix-dbms`;


/**1、POST 新建数据库 */
export const createSchema = `${dbmsApiPrefix}${appConfig.apiPrefix}/schema/create`;

/**2、DELETE 删除数据库 */
export const deleteSchema = `${dbmsApiPrefix}${appConfig.apiPrefix}/schema/delete`;

/**3、GET 数据库列表 */
export const getSchemaList = `${dbmsApiPrefix}${appConfig.apiPrefix}/schema/list`;

/**4、POST 新建账号 */
export const createAccount = `${dbmsApiPrefix}${appConfig.apiPrefix}/account/create`;

/**5、 DELETE 删除账号 */
export const deleteAccount = `${dbmsApiPrefix}${appConfig.apiPrefix}/account/delete`;

/**6、 POST 账号授权 */
export const grantAccount = `${dbmsApiPrefix}${appConfig.apiPrefix}/databaseManage/account/grantAccount`;

/**7、 PUT 修改密码 */
export const changePassword = `${dbmsApiPrefix}${appConfig.apiPrefix}/databaseManage/account/changePassword`;

/**8、 GET 账号列表 */
export const getAccountList = `${dbmsApiPrefix}${appConfig.apiPrefix}/databaseManage/account/list`;

/**9、 GET 日志管理-慢日志统计 */
export const getStatistics = `${dbmsApiPrefix}${appConfig.apiPrefix}/databaseManage/log/slowLog/statistics`;

/**10、 GET 获取用户名 */
export const getUserList = `${appConfig.apiPrefix}/appManage/user/listAll`;

/* -----------------------概览-------------------- */

/**11、 GET 仪表盘概览 */
export const getOverviewDashboards = `${dbmsApiPrefix}${appConfig.apiPrefix}/databaseManage/overview/dashboards`;

/**12、 GET 实例概览列表 */
export const getOverviewInstances = `${dbmsApiPrefix}${appConfig.apiPrefix}/databaseManage/overview/instances`;

/**13、 GET 实例性能趋势 */
export const getPerformanceTrends = `${dbmsApiPrefix}${appConfig.apiPrefix}/databaseManage/instance/performanceTrends`;

/**14、 GET 实例列表 */
export const getInstanceList = `${dbmsApiPrefix}${appConfig.apiPrefix}/instance/list`;

/**15、 POST 新增实例 */
export const addInstance = `${dbmsApiPrefix}${appConfig.apiPrefix}/databaseManage/instance/add`;
/**16、 PUT 新增实例 */
export const updateInstance = `${dbmsApiPrefix}${appConfig.apiPrefix}/databaseManage/instance/update`;
/**17、 DELETE 删除实例 */
export const deleteInstance = `${dbmsApiPrefix}${appConfig.apiPrefix}/databaseManage/instance/delete`;
/**18、 GET 实例详情 */
export const getInstanceDetail = `${dbmsApiPrefix}${appConfig.apiPrefix}/instance/detail`;

/**19、 GET 集群列表 */
export const getClusterList = `${dbmsApiPrefix}${appConfig.apiPrefix}/cluster/list`;
/**20、 POST 新增集群 */
export const addCluster = `${dbmsApiPrefix}${appConfig.apiPrefix}/databaseManage/cluster/add`;

export const updateCluster = `${dbmsApiPrefix}${appConfig.apiPrefix}/databaseManage/cluster/update`;

export const deleteCluster = `${dbmsApiPrefix}${appConfig.apiPrefix}/databaseManage/cluster/delete`;

/**23、 GET 同步元数据 */
export const syncMetaData = `${dbmsApiPrefix}${appConfig.apiPrefix}/databaseManage/syncMetaData`;

/**24、GET 获取应用环境 */
export const envList = `${dbmsApiPrefix}${appConfig.apiPrefix}/appManage/env/list`;

/**25、GET获取schema字符集和排序规则 */
export const getCharacterSetList = `${dbmsApiPrefix}${appConfig.apiPrefix}/databaseManage/schema/getCharacterSetList`;

/**26、 GET 实例性能趋势 */
export const performanceTrends = `${dbmsApiPrefix}${appConfig.apiPrefix}/databaseManage/instance/performanceTrends`;

/**26、 GET 枚举数据 */
export const getEnumerateData = `${dbmsApiPrefix}${appConfig.apiPrefix}/databaseManage/getEnumerateData`;
