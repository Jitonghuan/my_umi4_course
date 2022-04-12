/* 
交付管理/产品列表接口
文档地址：https://come-future.yuque.com/sekh46/bbgc7f/wzzc7e
设计原型地址：https://modao.cc/app/cac9fa9343b15960f41e0ebe2692c08a577fee33#screen=skzp9ybcdy6ujcg
 */
import { addAPIPrefix } from '@/utils';

/** 获取应用环境 */
export const envList = addAPIPrefix('/appManage/env/list');

/* 一、产品 */
/* POST  创建产品 */
export const createProduct = addAPIPrefix('/deliveryManage/product/create');
/* POST  删除产品 */
export const deleteProduct = addAPIPrefix('/deliveryManage/product/delete');
/* GET  查询产品列表 */
export const queryProductList = addAPIPrefix('/deliveryManage/product/list');
/* GET  查询产品详情 */
export const queryProductInfo = addAPIPrefix('/deliveryManage/product/list');
/* POST  编辑产品描述 */
export const editProductDescription = addAPIPrefix('/deliveryManage/product/description/edit');
/* POST  创建产品版本 */
export const createProductVersion = addAPIPrefix('/deliveryManage/product/version/create');
/* GET  查询产品版本 */
export const queryVersionList = addAPIPrefix('/deliveryManage/product/version/list');
/* POST  删除产品版本 */
export const deleteVersion = addAPIPrefix('/deliveryManage/product/version/delete');
/* POST  发布产品版本 */
export const releaseVersion = addAPIPrefix('/deliveryManage/product/version/release');
/* GET  查询产品版本详情 */
export const queryProductVersionInfo = addAPIPrefix('/deliveryManage/product/version/info');
/* POST  编辑产品版本描述 */
export const editVersionDescription = addAPIPrefix('/deliveryManage/product/version/description/edit');

/* POST  产品版本添加组件 */
export const addComponent = addAPIPrefix('/deliveryManage/product/version/component/add');

/* GET  产品版本组件查询 */
export const queryVersionComponentList = addAPIPrefix('/deliveryManage/product/version/component/list');

/* POST  产品版本删除组件 */
export const deleteVersionComponent = addAPIPrefix('/deliveryManage/product/version/component/delete');
/* POST  编辑组件配置 */
export const editComponent = addAPIPrefix('/deliveryManage/product/version/component/edit');

/* GET 获取参数来源组件 */
export const queryOriginList = addAPIPrefix('/deliveryManage/product/version/component/origin/list');
/* GET 获取组件参数及参数值 */
export const queryParamList = addAPIPrefix('/deliveryManage/product/version/component/param/list');
/* POST 保存交付配置参数 */
export const saveParam = addAPIPrefix('/deliveryManage/product/version/param/save');
/* GET  查询交付配置参数 */
export const queryDeliveryParamList = addAPIPrefix('/deliveryManage/product/version/param/list');
/* POST 删除交付配置参数 */
export const deleteDeliveryParam = addAPIPrefix('/deliveryManage/product/version/param/delete');

/* 二、组件中心 */
/* POST 用户组件接入 */
export const addApplication = addAPIPrefix('/deliveryManage/component/application/add');

/* POST 平台组件接入 */
export const addMiddleware = addAPIPrefix('/deliveryManage/component/middleware/add');

/*POST 基础数据接入 */
export const addBasicdata = addAPIPrefix('/deliveryManage/component/basicdata/add');
/* POST 上传平台组件chart包 */

export const uploadChart = addAPIPrefix('/deliveryManage/component/chart/upload');

/* POST 上传基础数据sql文件 */

export const uploadSqlfile = addAPIPrefix('/deliveryManage/component/sqlfile/upload');

/* GET 组件查询 */

export const queryComponentList = addAPIPrefix('/deliveryManage/component/list');

/*GET  组件详情 */
export const queryComponentInfo = addAPIPrefix('/deliveryManage/component/info');

/* GET 组件版本查询 */

export const queryComponentVersionList = addAPIPrefix('/deliveryManage/component/version/list');

/* POST 组件删除 */

export const deleteComponent = addAPIPrefix('/deliveryManage/component/delete');

/* POST 应用查询 */

export const queryApplist = addAPIPrefix('/deliveryManage/component/applist');

/* GET 应用Chart模板查询 */

export const queryComponentTmpl = addAPIPrefix('/deliveryManage/component/template/list');

/* POST  创建应用Chart模板 */
export const createComponentTmpl = addAPIPrefix('/deliveryManage/component/template/create');

/* PUT 更新应用Chart模板 */
export const updateComponentTmpl = addAPIPrefix('/deliveryManage/component/template/update');

/* DELETE 删除应用Chart模板 */
export const deleteComponentTmpl = addAPIPrefix('/deliveryManage/component/template/delete');

/* GET 应用Chart模板分类 */
export const queryTypeList = addAPIPrefix('/deliveryManage/component/template/typelist');

/* 三、制品交付 */

/*POST  创建制品 */
export const createIndent = addAPIPrefix('/deliveryManage/indent/create');

/*GET 查询制品 */
export const queryIndentList = addAPIPrefix('/deliveryManage/indent/list');

/* GET 制品详情 */
export const queryIndentInfo = addAPIPrefix('/deliveryManage/indent/info');

/*POST  删除制品 */
export const deleteIndent = addAPIPrefix('/deliveryManage/indent/delete');

/* POST 制品描述编辑 */
export const editDescription = addAPIPrefix('/deliveryManage/indent/description/edit');

/* GET  获取制品交付配置 */
export const queryIndentParamList = addAPIPrefix('/deliveryManage/indent/param/list');

/* POST 编辑交付配置参数值 */
export const saveIndentParam = addAPIPrefix('/deliveryManage/indent/param/save');

/* POST 出部署包 */
export const createPackageInde = addAPIPrefix('/deliveryManage/indent/package/create');

/* POST 下载部署包 */

export const downloadPackage = addAPIPrefix('/deliveryManage/indent/package/download');
