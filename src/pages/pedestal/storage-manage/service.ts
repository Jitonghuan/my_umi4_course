/**
 * 存储管理service
 * @description 用于存在接口数据或者接口调用函数
 * @create 2021-01-17 11:38
 */
import appConfig from '@/app.config';

/*0 GET 获取使用了GFS的集群code */
export const useGlusterfsList = `${appConfig.apiPrefix}/infraManage/cluster/useGlusterfs/list`;

//存储大盘

/* 1、 GET 存储大盘 */
export const getGlusterfsClusterInfo = `${appConfig.apiPrefix}/infraManage/storage/glusterfs/cluster/info`;

/* 2、 GET 获取节点数据 */
export const getGlusterfsNodeList = `${appConfig.apiPrefix}/infraManage/storage/glusterfs/node/list`;

/*3、 GET 获取集群趋势数据 */
export const getGlusterfsMetrics = `${appConfig.apiPrefix}/infraManage/storage/glusterfs/metrics`;

// 节点管理
/* 4、 GET 获取节点详情 */
export const getGlusterfsNodeDetail = `${appConfig.apiPrefix}/infraManage/storage/glusterfs/node/detail`;
/*5、 POST 新增节点 */
export const addGlusterfsNode = `${appConfig.apiPrefix}/infraManage/storage/glusterfs/node/add`;
/*6、 POST 删除节点 */
export const delGlusterfsNode = `${appConfig.apiPrefix}/infraManage/storage/glusterfs/node/delete`;
/*7、 POST 新增设备 */
export const addGlusterfsDevice = `${appConfig.apiPrefix}/infraManage/storage/glusterfs/device/add`;
/* 8、GET 获取未部署glusterfs的k8s节点 */
export const getGlusterfsNonNodeList = `${appConfig.apiPrefix}/infraManage/storage/glusterfs/nonnode/list`;

// 卷管理
/* 9、GET 获取卷数据 */
export const getGlusterfsVolumeList = `${appConfig.apiPrefix}/infraManage/storage/glusterfs/volume/list`;
/* 10、GET 获取卷brick信息 */
export const getVolumeBrickInfo = `${appConfig.apiPrefix}/infraManage/storage/glusterfs/volume/brick/info`;
/* 11、GET 获取卷快照信息 */
export const getVolumeSnapshotList = `${appConfig.apiPrefix}/infraManage/storage/glusterfs/volume/snapshot/list`;
/* 12、POST 停止卷 */
export const stopVolume = `${appConfig.apiPrefix}/infraManage/storage/glusterfs/volume/stop`;
/* 13、POST 删除卷 */
export const deleteVolume = `${appConfig.apiPrefix}/infraManage/storage/glusterfs/volume/delete`;
/* 14、POST  治愈卷 */
export const healVolume = `${appConfig.apiPrefix}/infraManage/storage/glusterfs/volume/heal`;

/* 15、POST 驱逐brick */
export const evictBrick = `${appConfig.apiPrefix}/infraManage/storage/glusterfs/brick/evict`;

/* 16、POST创建快照 */
export const creatSnapshot = `${appConfig.apiPrefix}/infraManage/storage/glusterfs/snapshot/create`;

/* 17、POST恢复快照 */
export const restoreSnapshot = `${appConfig.apiPrefix}/infraManage/storage/glusterfs/snapshot/restore`;

/* 18、POST激活快照 */
export const activateSnapshot = `${appConfig.apiPrefix}/infraManage/storage/glusterfs/snapshot/activate`;

/* 19、POST停用快照 */
export const deactivateSnapshot = `${appConfig.apiPrefix}/infraManage/storage/glusterfs/snapshot/deactivate`;

/* 20、POST克隆快照 */
export const cloneSnapshot = `${appConfig.apiPrefix}/infraManage/storage/glusterfs/snapshot/clone`;

/* 21、POST删除快照 */
export const deleteSnapshot = `${appConfig.apiPrefix}/infraManage/storage/glusterfs/snapshot/delete`;
/* 22、POST 是否开启卷的NFS功能 */
export const enableNfs = `${appConfig.apiPrefix}/infraManage/storage/glusterfs/volume/enableNfs`;
