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
