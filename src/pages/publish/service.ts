import request, { postRequest, getRequest } from '@/utils/request';
import ds from '@config/defaultSettings';

/** 查询发布功能列表 */
export const queryFunctionUrl = `${ds.apiPrefix}/publishManage/function/list`;
/** 查询发布功能列表 */
export const queryFuncs = (params: {
  /** id */
  id?: number;
  /** 发布功能的UUID */
  funcId?: string;
  /** 发布功能名称---⽀持模糊搜索 */
  funcName?: string;
  /** 预发布时间---⽀持模糊搜索 */
  preDeployTime?: string;
  /** 应⽤组CODE */
  appGroupCode?: string;
  /** 应⽤分类CODE */
  appCategoryCode?: string;
  /** 发布状态0/1/2 未发布/已发布/已上线 */
  deployStatus?: 0 | 1 | 2;
  /** 发布时间---⽀持模糊搜索 */
  deployTime?: string;
  /** 分页索引 */
  pageIndex: number;
  /** 分页大小 */
  pageSize: number;
}) =>
  getRequest(queryFunctionUrl, { data: params }).then((res: any) => {
    if (res.success) {
      return {
        list: res.data?.dataSource || [],
        ...res.data?.pageInfo,
      };
    }

    return { list: [] };
  });
