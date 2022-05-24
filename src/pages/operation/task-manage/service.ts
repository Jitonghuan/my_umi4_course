//任务管理接口
//接口文档地址：https://come-future.yuque.com/sekh46/bbgc7f/ipkot4
//2022/05/24 13:50
import { addAPIPrefix } from '@/utils';

/* POST 1、 新增任务接口  */

export const createJob = addAPIPrefix('/opsManage/job/create');

/* PUT 2、 编辑任务接口 */

export const updateJob = addAPIPrefix('/opsManage/job/update');

/* POST 3、dns记录修改 */

export const updateDnsManage = addAPIPrefix('/opsManage/dnsManage/update');

/* DELETE 4、 dns记录删除 */

export const deleteDnsManage = addAPIPrefix('/opsManage/dnsManage/delete');

/* POST 5、 dns记录状态变更 */

export const updateDnsManageStatus = addAPIPrefix('/opsManage/dnsManage/status');

/* POST 6、 dns记录导入 */

export const uploadDnsManage = addAPIPrefix('/opsManage/dnsManage/upload');

/* GET  7、dns记录导出 */

export const downloadDnsManage = addAPIPrefix('/opsManage/dnsManage/download');

/* GET 8、dns服务器查询 */

export const getDnsManageHostList = addAPIPrefix('/opsManage/dnsManage/host/list');

/* GET 9、dns服务环境查询 */

export const getDnsManageEnvCodeList = addAPIPrefix('/opsManage/dnsManage/envcode/list');
