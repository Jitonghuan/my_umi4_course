import { postRequest, getRequest } from '@/utils/request';
import ds from '@config/defaultSettings';

/** 查询应用 */
export const queryApps = (params: {
  type: 'all' | 'my';
  pageIndex: number;
  pageSize: string;
}) =>
  postRequest(`${ds.apiPrefix}/application/list`, { data: params }).then(
    (res) => {
      // TODO 可能会改

      if (res.success) {
        return {
          list: res.data?.dataSource || [],
          ...res.data?.pageInfo,
        };
      }

      return { list: [] };
    },
  );
