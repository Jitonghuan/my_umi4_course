import appConfig from '@/app.config';

// 复用分支：部署到下一个环境操作
export const doDeployReuseApi = `${appConfig.apiPrefix}/releaseManage/deploy/reuse`;
