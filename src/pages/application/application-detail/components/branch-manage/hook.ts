import { useState, useEffect, useCallback } from 'react';
import { getRequest } from '@/utils/request';
import { queryBranchListUrl } from '@/pages/application/service';

// 获取主干分支列表
export function useMasterBranchList(props: any) {
  // const { params } = props;
  // console.log(props, 'params')
  const [data, setData] = useState<any>([]);
  const loadData = useCallback(
    async (extra?: any) => {
      try {
        const result = await getRequest(queryBranchListUrl, {
          data: { ...props },
        });
        const { dataSource, pageInfo } = result.data || {};
        setData(dataSource || []);
      } catch (ex) {
        setData([]);
      } finally {
      }
    },
    [props],
  );

  useEffect(() => {
    loadData({});
  }, []);

  return [data];
}
