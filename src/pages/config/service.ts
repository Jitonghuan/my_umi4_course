/* 配置中心接口文档 https://come-future.yuque.com/sekh46/bbgc7f/bfm68z */
import appConfig from '@/app.config';
/* ---------------nacos----------------- */
/* 1、GET 查询nacos环境列表 */
export const getNacosEnvsApi = `${appConfig.apiPrefix}/config/nacos/envs`;
/* 2、GET 查询namespace列表 */
export const getNacosNamespacesApi = `${appConfig.apiPrefix}/config/nacos/namespaces`;
/* 3、POST 新增namesapce */
export const createNamespaceApi = `${appConfig.apiPrefix}/config/nacos/namespace/create`;
/* 4、POST 更新namespace */
export const updateNamespaceApi = `${appConfig.apiPrefix}/config/nacos/namespace/update`;
/* 5、 DELETE 删除namespace */
export const deleteNamespaceApi = `${appConfig.apiPrefix}/config/nacos/namespace/delete`;
/* 6、 GET 查询单个namespace */
export const getSingleNacosNamespaceApi = `${appConfig.apiPrefix}/config/nacos/namespace`;
/* ---------------config----------------- */
/* 1、GET 分页查询config列表 */
export const getConfigListApi = `${appConfig.apiPrefix}/config/nacos/config/list`;
/* 2、GET 查询configVersion 列表 */
export const getConfigVersionsApi = `${appConfig.apiPrefix}/config/nacos/config/versions`;
/* 3、GET 根据versionId查询一个config详情 */
export const getNacosConfigApi = `${appConfig.apiPrefix}/config/nacos/config`;
/* 4、POST 新增配置 */
export const createNacosConfigApi = `${appConfig.apiPrefix}/config/nacos/config/create`;