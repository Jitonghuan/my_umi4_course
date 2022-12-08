//网络拨测接口文档
//接口文档地址：https://come-future.yuque.com/sekh46/bbgc7f/srlhc1
//原型图：https://modao.cc/app/b0qpvHeHrkmj0kA7sJ19Jg#screen=sl9wxs79qg722vh
//2022/11/17 16:05
import { addAPIPrefix } from '@/utils';

/* GET 1、显示当前集群已有拨测任务列表  */

export const getNetworkProbeList = addAPIPrefix('/monitorManage/networkProbe/list');

/* POST 2、 创建拨测任务 */

export const createNetworkProbe = addAPIPrefix('/monitorManage/networkProbe/create');

/* POST 3、 更新拨测任务 */

export const updateNetworkProbe = addAPIPrefix('/monitorManage/networkProbe/update');

/* DELETE 4、 删除拨测任务 */

export const deleteNetworkProbe = addAPIPrefix('/monitorManage/networkProbe/delete');

/* POST 5、 启动拨测任务 */

export const networkProbeStatus = addAPIPrefix('/monitorManage/networkProbe/status');
/* GET 6、获取拨测类型 */

export const networkProbeType = addAPIPrefix('/monitorManage/networkProbe/probeType');

export const getClusterApi= addAPIPrefix("/monitorManage/cluster")


