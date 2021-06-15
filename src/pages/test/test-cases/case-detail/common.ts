// case editor common
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/06/06 20:51

import { getRequest } from '@/utils/request';
import * as APIS from '../service';
import { CaseItemVO } from '../interfaces';

export async function getFuncListByIds(ids: number[]) {
  if (!ids?.length) return [];

  return await Promise.all(
    ids.map(async (id) => {
      const { data } = await getRequest(APIS.getFunc, {
        data: { id },
      });

      return data;
    }),
  );
}

export async function getCaseListByIds(ids: number[]): Promise<CaseItemVO[]> {
  if (!ids?.length) return [];

  return await Promise.all(
    ids.map(async (id) => {
      const { data } = await getRequest(APIS.getCaseInfo, {
        data: { id },
      });

      return data;
    }),
  );
}
