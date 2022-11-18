import { addAPIPrefix } from '@/utils';
import { delRequest, getRequest, postRequest, putRequest } from '@/utils/request';

// 节点查询
export const getNode = (data: any) => {
  const url = addAPIPrefix('/infraManage/node/list');
  return getRequest(url, { data: data });
};

// 节点列表-更新标签
export const nodeUpdate = (data: any) => {
  const url = addAPIPrefix('/infraManage/node/update');
  return postRequest(url, { data: data });
};

// 节点排空
export const nodeDrain = (data: any) => {
  const url = addAPIPrefix('/infraManage/node/drain');
  return postRequest(url, { data: data });
};

//新增节点
export const addNode = (data: any) => {
  const url = addAPIPrefix('/infraManage/node/add');
  return postRequest(url, { data: data });
};

// 获取资源详情列表
export const getResourceList = (data: any) => {
  const url = addAPIPrefix('/infraManage/resource/list');
  return getRequest(url, { data: data });
};

// 资源详情-删除接口
export const resourceDel = (data: any) => {
  const url = addAPIPrefix('/infraManage/resource/delete');
  return postRequest(url, { data: data });
};

// 资源详情-新增
export const resourceCreate = (data: any) => {
  const url = addAPIPrefix('/infraManage/resource/create');
  return postRequest(url, { data: data });
};
// 资源详情-编辑
export const resourceUpdate = (data: any) => {
  const url = addAPIPrefix('/infraManage/resource/update');
  return putRequest(url, { data: data });
};

// 资源详情-查看yaml
export const searchYaml = (data: any) => {
  const url = addAPIPrefix('/infraManage/resource/yaml');
  return getRequest(url, { data: data });
};

// 资源详情-编辑yaml
export const updateYaml = (data: any) => {
  const url = addAPIPrefix('/infraManage/resource/yaml/edit');
  return putRequest(url, { data: data });
};

// 资源类型查询接口
export const getResourceType = (data: any) => {
  const url = addAPIPrefix('/infraManage/resource/type/list');
  return getRequest(url, { data: data });
};

// hpa新增弹性规则
export const hpaCreate = (data: any) => {
  const url = addAPIPrefix('/infraManage/hpa/createRule');
  return postRequest(url, { data: data });
};

// hpa-编辑规则
export const hpaUpdate = (data: any) => {
  const url = addAPIPrefix('/infraManage/hpa/updateRule');
  return putRequest(url, { data: data });
};

// hpa查询接口
export const getHpaList = (data: any) => {
  const url = addAPIPrefix('/infraManage/hpa/ruleList');
  return getRequest(url, { data: data });
};

// hpa获取触发记录
export const getHpaRecordList = (data: any) => {
  const url = addAPIPrefix('/infraManage/hpa/hpaLogs');
  return getRequest(url, { data: data });
};

