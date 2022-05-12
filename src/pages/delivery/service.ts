/* 
交付管理/产品列表接口
文档地址：https://come-future.yuque.com/sekh46/bbgc7f/wzzc7e
设计原型地址：https://modao.cc/app/cac9fa9343b15960f41e0ebe2692c08a577fee33#screen=skzp9ybcdy6ujcg
 */
import { addAPIPrefix } from '@/utils';

/** 获取应用环境 */
export const envList = addAPIPrefix('/appManage/env/list');

/* 一、产品 */
/*1、  GET  根据产品线获取版本 */
export const getProductlineVersion = addAPIPrefix('/deliveryManage/component/productline/version');
/*2、 GET 获取应用组件 */
export const applist = addAPIPrefix('/deliveryManage/component/productline/version/applist');
/*3、 POST  创建产品 */
export const createProduct = addAPIPrefix('/deliveryManage/product/create');
/*4、 POST  删除产品 */
export const deleteProduct = addAPIPrefix('/deliveryManage/product/delete');
/*5、 GET  查询产品列表 */
export const queryProductList = addAPIPrefix('/deliveryManage/product/list');
/*6、 GET  查询产品详情 */
export const queryProductInfo = addAPIPrefix('/deliveryManage/product/list');
/*7、 POST  编辑产品描述 */
export const editProductDescription = addAPIPrefix('/deliveryManage/product/description/edit');
/*8、 POST  创建产品版本 */
export const createProductVersion = addAPIPrefix('/deliveryManage/product/version/create');
/*9、 GET  查询产品版本 */
export const queryVersionList = addAPIPrefix('/deliveryManage/product/version/list');
/*10、 POST  删除产品版本 */
export const deleteVersion = addAPIPrefix('/deliveryManage/product/version/delete');
/*11、 POST  发布产品版本 */
export const releaseVersion = addAPIPrefix('/deliveryManage/product/version/release');
/*12、 GET  查询产品版本详情 */
export const queryProductVersionInfo = addAPIPrefix('/deliveryManage/product/version/info');
/*13、 POST  编辑产品版本描述 */
export const editVersionDescription = addAPIPrefix('/deliveryManage/product/version/description/edit');

/*14、 POST  产品版本添加组件 */
export const addComponent = addAPIPrefix('/deliveryManage/product/version/component/add');

/*15、 GET  产品版本组件查询 */
export const queryVersionComponentList = addAPIPrefix('/deliveryManage/product/version/component/list');

/*16、 POST  产品版本删除组件 */
export const deleteVersionComponent = addAPIPrefix('/deliveryManage/product/version/component/delete');
/*17、 POST  编辑组件配置 */
export const editComponent = addAPIPrefix('/deliveryManage/product/version/component/edit');

/*18、 GET 获取参数来源组件 */
export const queryOriginList = addAPIPrefix('/deliveryManage/product/version/component/origin/list');
/*19、 GET 获取组件参数及参数值 */
export const queryParamList = addAPIPrefix('/deliveryManage/product/version/component/param/list');
/*20、 POST 保存交付配置参数 */
export const saveParam = addAPIPrefix('/deliveryManage/product/version/param/save');
/*21、 GET  查询交付配置参数 */
export const queryDeliveryParamList = addAPIPrefix('/deliveryManage/product/version/param/list');
/*22、 POST 删除交付配置参数 */
export const deleteDeliveryParam = addAPIPrefix('/deliveryManage/product/version/param/delete');
/*23、 POST  修改交付配置参数 */
export const editVersionParam = addAPIPrefix('/deliveryManage/product/version/param/edit');
/*24、 GET 根据产品线和版本号查询应用列表 */
export const getApplistVersion = addAPIPrefix('/deliveryManage/component/applist/version ');
/*25、 POST 产品版本批量添加应用 */
export const bulkadd = addAPIPrefix('/deliveryManage/product/version/component/bulkadd');
/* 二、组件中心 */

/*26、 组件版本删除 */
export const deletVersionApi = addAPIPrefix('/deliveryManage/component/version/delete');
/*27、 GET 产品线分类 */
export const queryProductlineList = addAPIPrefix('/deliveryManage/component/productline/list');

/*28、 GET 检查组件版本号 */
export const getVersionCheck = addAPIPrefix('/deliveryManage/component/version/check');
/*29、 POST 用户组件接入 */
export const addApplication = addAPIPrefix('/deliveryManage/component/application/add');

/*30、 POST 平台组件接入 */
export const addMiddleware = addAPIPrefix('/deliveryManage/component/middleware/add');

/*31、POST 基础数据接入 */
export const addBasicdata = addAPIPrefix('/deliveryManage/component/basicdata/add');
/*32、 POST 上传平台组件chart包 */

export const uploadChart = addAPIPrefix('/deliveryManage/component/chart/upload');

/*33、 POST 上传基础数据sql文件 */

export const uploadSqlfile = addAPIPrefix('/deliveryManage/component/sqlfile/upload');

/*34、 GET 组件查询 */

export const queryComponentList = addAPIPrefix('/deliveryManage/component/list');

/*35、GET  组件详情 */
export const queryComponentInfoApi = addAPIPrefix('/deliveryManage/component/info');

/*36、 GET 组件版本查询 */

export const queryComponentVersionList = addAPIPrefix('/deliveryManage/component/version/list');
/*37、 GET 组件描述更新 */
export const updateComponent = addAPIPrefix('/deliveryManage/component/update');

/*38、 POST 组件删除 */

export const deleteComponent = addAPIPrefix('/deliveryManage/component/delete');

/*39、 POST 应用查询 */

export const queryApplist = addAPIPrefix('/deliveryManage/component/applist');

/*40、 GET 应用Chart模板查询 */

export const queryComponentTmpl = addAPIPrefix('/deliveryManage/component/template/list');

/*41、 POST  创建应用Chart模板 */
export const createComponentTmpl = addAPIPrefix('/deliveryManage/component/template/create');

/*42、 PUT 更新应用Chart模板 */
export const updateComponentTmpl = addAPIPrefix('/deliveryManage/component/template/update');

/*43、 DELETE 删除应用Chart模板 */
export const deleteComponentTmpl = addAPIPrefix('/deliveryManage/component/template/delete');

/*44、 GET 应用Chart模板分类 */
export const queryTypeList = addAPIPrefix('/deliveryManage/component/template/typelist');

/* 三、制品交付 */

/*45、POST  创建制品 */
export const createIndent = addAPIPrefix('/deliveryManage/indent/create');

/*46、GET 查询制品 */
export const queryIndentList = addAPIPrefix('/deliveryManage/indent/list');

/*47、 GET 制品详情 */
export const queryIndentInfoApi = addAPIPrefix('/deliveryManage/indent/info');

/*48、POST  删除制品 */
export const deleteIndent = addAPIPrefix('/deliveryManage/indent/delete');

/*49、 POST 制品描述编辑 */
export const editDescription = addAPIPrefix('/deliveryManage/indent/description/edit');

/*50、 GET  获取制品交付配置 */
export const queryIndentParamList = addAPIPrefix('/deliveryManage/indent/param/list');

/*51、 POST 编辑交付配置参数值 */
export const saveIndentParam = addAPIPrefix('/deliveryManage/indent/param/edit');

/*52、 POST 出部署包 */
export const createPackageInde = addAPIPrefix('/deliveryManage/indent/package/generate');

/*53、 POST 下载部署包 */

export const downloadPackage = addAPIPrefix('/deliveryManage/indent/package/download');
/*54、 POST 组件描述更新 */
export const updateDescription = addAPIPrefix('/deliveryManage/component/description/update');
/*55、 POST  组件配置更新 */
export const updateConfiguration = addAPIPrefix('/deliveryManage/component/configuration/update');

/*56、 POST  获取制品配置 */
export const generateIndentConfig = addAPIPrefix('/deliveryManage/indent/config/generate');

/*57、 POST  编辑制品配置 */
export const editIndentConfig = addAPIPrefix('/deliveryManage/indent/config/edit');
