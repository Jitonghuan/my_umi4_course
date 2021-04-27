import ds from '@config/defaultSettings';
import { queryBizData } from '@/layouts/basic-layout/service';
import { getRequest } from '@/utils/request';

/** 查询发布申请列表 */
export const queryApplysUrl = `${ds.apiPrefix}/releaseManage/apply/list`;

/** 根据所属，查询业务线列表 */
export const queryBizDatas = (params: { belong: string }) =>
  getRequest(queryBizData, {
    data: params,
  }).then((resp) => {
    if (resp.success) {
      return (
        resp?.data?.dataSource?.map((el: any) => {
          return {
            ...el,
            value: el.lineName,
            label: el.lineCode,
          };
        }) || []
      );
    }
    return [];
  });
