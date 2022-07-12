import appConfig from '@/app.config';

// npm列表
export const npmList = `${appConfig.apiPrefix}/appManage/npm/list`;

// 获取分支列表
export const queryBranchListUrl = `${appConfig.apiPrefix}/releaseManage/branch/list`;

// 删除分支
export const deleteBranch = `${appConfig.apiPrefix}/releaseManage/branch/delete`;

// 创建主干分支
export const createMainBranch = `${appConfig.apiPrefix}/releaseManage/branch/createMainBranch`;

// 新增 feature 分支
export const createFeatureBranchUrl = `${appConfig.apiPrefix}/releaseManage/branch/createFeature`;

// 提交分支
export const createDeploy = `${appConfig.apiPrefix}/releaseManage/npmDeploy/create`;

// 追加分支
export const updateFeatures = `${appConfig.apiPrefix}/releaseManage/dependencyManage/npmDeploy/updateFeatures`;

// 重新提交
export const reCommit = `${appConfig.apiPrefix}/releaseManage/npmDeploy/reCommit`;

// 取消发布
export const cancelDeploy = `${appConfig.apiPrefix}/releaseManage/deploy/cancel`;

// 退出分支
export const withdrawFeatures = `${appConfig.apiPrefix}/releaseManage/npmDeploy/withdrawFeatures`;

// 指定环境大类下的版本列表
export const queryRecordApi = `${appConfig.apiPrefix}/appManage/npmVersion/list`;

// 版本回滚
export const rollback = `${appConfig.apiPrefix}/releaseManage/npmDeploy/rollback`;

// 获取tag
export const getTagList = `${appConfig.apiPrefix}/appManage/npmVersion/getActiveVersion`;

// 获取tag下对应的版本
export const getVersionList = `${appConfig.apiPrefix}/appManage/npmVersion/list`;

// 查询HotFix 版本
export const searchHotFixVersion = `${appConfig.apiPrefix}/releaseManage/npmDeploy/getHotfixVersion`;

// 查询npm包的hotfix分支
export const hotFixList = `${appConfig.apiPrefix}/releaseManage/branch/list`;

// 创建Hotfix分支
export const createHotfixBranch = `${appConfig.apiPrefix}/releaseManage/branch/createHotfixBranch`;

// 创建hotfix发布
export const createHotfixDeploy = `${appConfig.apiPrefix}/releaseManage/npmDeploy/create`;
