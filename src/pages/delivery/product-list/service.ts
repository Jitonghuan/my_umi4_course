/* 
交付管理/产品列表接口
文档地址：https://come-future.yuque.com/sekh46/bbgc7f/wzzc7e
设计原型地址：https://modao.cc/app/cac9fa9343b15960f41e0ebe2692c08a577fee33#screen=skzp9ybcdy6ujcg
 */
import { addAPIPrefix } from '@/utils';

/* POST  创建产品 */
export const createProduct = addAPIPrefix('/deliveryManage/product/create');
/* POST  删除产品 */
export const deleteProduct = addAPIPrefix('/deliveryManage/product/delete');
/* GET  查询产品列表 */
export const queryProductList = addAPIPrefix('/deliveryManage/product/list');
/* GET  查询产品详情 */
export const queryProductInfo = addAPIPrefix('/deliveryManage/product/list');
