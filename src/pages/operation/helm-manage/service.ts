//Helm接口文档
//接口文档地址：https://come-future.yuque.com/sekh46/bbgc7f/cmvhad
//2022/06/24 13:50
import { addAPIPrefix } from '@/utils';

/* POST 1、 chart查询  */

export const getChartList = addAPIPrefix('opsManage/helm/chart/list');

/* POST 2、 repository查询 */

export const getRepositoryList = addAPIPrefix('opsManage/helm/repository/list');

/* POST  3、 chart-readme查询 */

export const chartReadme = addAPIPrefix('opsManage/helm/chart/readme');

/* POST 4、 chart-values查询*/

export const chartValues = addAPIPrefix('opsManage/helm/chart/values');

/* POST 5、 chart版本查询 */

export const chartVersions = addAPIPrefix('opsManage/helm/chart/versions');

/* POST 6、 指定仓库后chart版本查询 */

export const getRepositoryVersions = addAPIPrefix('opsManage/helm/chart/repository/versions');

/** POST 7、 chart部署 */
export const chartInstall = addAPIPrefix('opsManage/helm/chart/install');

/** POST 8、 release查询 */
export const getReleaseList = addAPIPrefix('opsManage/helm/release/list');
/** POST 9、 release详情 */
export const getReleaseInfo = addAPIPrefix('opsManage/helm/release/info');
/** POST 10、 release参数查询 */
export const getReleaseValuesList = addAPIPrefix('opsManage/helm/release/values');

/** POST 11、 release历史版本查询*/
export const gitHistoryReleaseList = addAPIPrefix('opsManage/helm/release/history');

/** POST 12、 release删除 */
export const deleteRelease = addAPIPrefix('opsManage/helm/release/delete');
/** POST 13、 release更新 */
export const upgradeRelease = addAPIPrefix('opsManage/helm/release/upgrade');
/** POST 14、release回滚 */
export const rollbackRelease = addAPIPrefix('opsManage/helm/release/rollback');
/** GET 15、 获取集群 */
export const getClusterList = addAPIPrefix('monitorManage/cluster');
/** GET 16、 获取namespace */
export const getPodNamespace = addAPIPrefix('monitorManage/resource/podNamespace');
