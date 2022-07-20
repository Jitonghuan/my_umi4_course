import appConfig from '@/app.config';

/**1、POST 新建数据库 */
export const createSchema = `${appConfig.apiPrefix}/databaseManage/schema/create`;

/**2、DELETE 删除数据库 */
export const deleteSchema = `${appConfig.apiPrefix}/databaseManage/schema/delete`;

/**3、GET 数据库列表 */
export const getSchemaList = `${appConfig.apiPrefix}/databaseManage/schema/list`;

/**4、POST 新建账号 */
export const createAccount = `${appConfig.apiPrefix}/databaseManage/account/create`;

/**5、 DELETE 删除账号 */
export const deleteAccount = `${appConfig.apiPrefix}/databaseManage/account/delete`;

/**6、 POST 账号授权 */
export const grantAccount = `${appConfig.apiPrefix}/databaseManage/account/grant`;

/**7、 PUT 修改密码 */
export const changePassword = `${appConfig.apiPrefix}/databaseManage/account/changePassword`;

/**8、 GET 账号列表 */
export const getAccountList = `${appConfig.apiPrefix}/databaseManage/account/list`;

/**9、 GET 日志管理-慢日志统计 */
export const getStatistics = `${appConfig.apiPrefix}/databaseManage/log/slowLog/statistics`;

/**10、 GET 获取用户名 */
export const getUserList = `${appConfig.apiPrefix}/appManage/user/listAll`;

/* -----------------------概览-------------------- */

/**11、 GET 仪表盘概览 */
export const getOverviewDashboards = `${appConfig.apiPrefix}/databaseManage/overview/dashboards`;

/**12、 GET 实例概览列表 */
export const getOverviewInstances = `${appConfig.apiPrefix}/databaseManage/overview/instances`;

/**13、 GET 实例性能趋势 */
export const getPerformanceTrends = `${appConfig.apiPrefix}/databaseManage/instance/performanceTrends`;

/**14、 GET 实例列表 */
export const getInstanceList = `${appConfig.apiPrefix}/databaseManage/instance/list`;

//● databaseManage/instance/add

/**15、 POST 新增实例 */
export const addInstance = `${appConfig.apiPrefix}/databaseManage/instance/add`;
/**16、 PUT 新增实例 */
export const updateInstance = `${appConfig.apiPrefix}/databaseManage/instance/update`;
/**17、 DELETE 删除实例 */
export const deleteInstance = `${appConfig.apiPrefix}/databaseManage/instance/delete`;
/**18、 GET 实例详情 */
export const getInstanceDetail = `${appConfig.apiPrefix}/databaseManage/instance/detail`;

/**18、 GET 集群列表 */
export const getClusterList = `${appConfig.apiPrefix}/databaseManage/cluster/list`;
/**19、 POST 新增集群 */
export const addCluster = `${appConfig.apiPrefix}/databaseManage/cluster/add`;

export const updateCluster = `${appConfig.apiPrefix}/databaseManage/cluster/update`;

export const deleteCluster = `${appConfig.apiPrefix}/databaseManage/cluster/delete`;

/**19、 GET 同步元数据 */
export const syncMetaData = `${appConfig.apiPrefix}/databaseManage/syncMetaData`;

/** 获取应用环境 */
export const envList = `${appConfig.apiPrefix}/appManage/env/list`;

/** GET 实例性能趋势 */
export const performanceTrends = `${appConfig.apiPrefix}/databaseManage/instance/performanceTrends`;
