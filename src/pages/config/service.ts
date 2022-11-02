/* 配置中心接口文档 https://come-future.yuque.com/sekh46/bbgc7f/bfm68z */
import appConfig from '@/app.config';
/* ---------------nacos----------------- */
/* 1、GET 查询nacos环境列表 */
export const getNacosEnvsApi = `${appConfig.apiPrefix}/configManage/nacos/envs`;
/* 2、GET 查询namespace列表 */
export const getNacosNamespacesApi = `${appConfig.apiPrefix}/configManage/nacos/namespaces`;
/* 3、POST 新增namesapce */
export const createNamespaceApi = `${appConfig.apiPrefix}/configManage/nacos/namespace/create`;
/* 4、POST 更新namespace */
export const updateNamespaceApi = `${appConfig.apiPrefix}/configManage/nacos/namespace/update`;
/* 5、 DELETE 删除namespace */
export const deleteNamespaceApi = `${appConfig.apiPrefix}/configManage/nacos/namespace/delete`;
/* 6、 GET 查询单个namespace */
export const getSingleNacosNamespaceApi = `${appConfig.apiPrefix}/configManage/nacos/namespace`;
/* ---------------configManage----------------- */
/* 1、GET 分页查询config列表 */
export const getConfigListApi = `${appConfig.apiPrefix}/configManage/nacos/config/list`;
/* 2、GET 查询configVersion 列表 */
export const getConfigVersionsApi = `${appConfig.apiPrefix}/configManage/nacos/config/versions`;
/* 3、GET 根据versionId查询一个config详情 */
export const getNacosConfigApi = `${appConfig.apiPrefix}/configManage/nacos/config`;
/* 4、POST 新增配置 */
export const createNacosConfigApi = `${appConfig.apiPrefix}/configManage/nacos/config/create`;
/* 5、POST 更新配置 */
export const updateNacosConfigApi = `${appConfig.apiPrefix}/configManage/nacos/config/update`;
/* 6、POST 回滚配置 */
export const rollbackNacosConfigApi = `${appConfig.apiPrefix}/configManage/nacos/config/rollback`;
/* 7、POST 批量导出配置 */
export const exportNacosConfigApi = `${appConfig.apiPrefix}/configManage/nacos/config/export`;
/* 8、POST 批量导入配置 */
export const importNacosConfigApi = `${appConfig.apiPrefix}/configManage/nacos/config/import`;
/* 9、 DELETE 删除namespace */
export const deleteNacosConfigApi = `${appConfig.apiPrefix}/configManage/nacos/config/delete`;