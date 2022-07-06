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
export const createDeploy = `${appConfig.apiPrefix}/appManage/npmDeploy/create`;

// 追加分支
export const updateFeatures = `${appConfig.apiPrefix}/appManage/dependencyManage/npmDeploy/updateFeatures`;

// 重新提交
export const reCommit = `${appConfig.apiPrefix}/appManage/npmDeploy/reCommit`;

// 取消发布
export const cancelDeploy = `${appConfig.apiPrefix}/releaseManage/deploy/cancel`;

// 退出分支
export const withdrawFeatures = `${appConfig.apiPrefix}/appManage/npmDeploy/withdrawFeatures`;

// 指定环境大类下的版本列表
export const queryRecordApi = `${appConfig.apiPrefix}/appManage/npmVersion/list`;

// 版本回滚
export const rollback = `${appConfig.apiPrefix}/appManage/npmDeploy/rollback`;

// 获取tag
export const getTagList = `${appConfig.apiPrefix}/appManage/npmVersion/list`;

// 获取tag下对应的版本
export const getVersionList = `${appConfig.apiPrefix}/appManage/npmVersion/list`;

// 查询HotFix 版本
export const searchHotFixVersion = `${appConfig.apiPrefix}/appManage/npmDeploy/getHotfixVersion`;

