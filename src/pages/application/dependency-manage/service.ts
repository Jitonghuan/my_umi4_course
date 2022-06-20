import { addAPIPrefix } from '@/utils';
import { delRequest, getRequest, postRequest, putRequest } from '@/utils/request';

// 新增依赖规则
export const addRule = (data: any) => {
  const url = addAPIPrefix('/appManage/dependencyManage/addRule');
  return postRequest(url, { data: data });
};

// 获取依赖规则列表
export const getRuleList = (data: any) => {
  const url = addAPIPrefix('/appManage/dependencyManage/getRuleList');
  return getRequest(url, { data: data });
};

// 编辑依赖规则
export const updateRule = (data: any) => {
  const url = addAPIPrefix('/appManage/dependencyManage/updateRule');
  return putRequest(url, { data: data });
};

// 获取需要依赖校验和不需要依赖校验的应用
export const getDependencyManageAppList = (data: any) => {
  const url = addAPIPrefix('/appManage/dependencyManage/appList');
  return putRequest(url, { data: data });
};

// 应用依赖校验开关
export const updateRuleApps = (data: any) => {
  const url = addAPIPrefix('/appManage/dependencyManage/updateAppRule');
  return putRequest(url, { data: data });
};
