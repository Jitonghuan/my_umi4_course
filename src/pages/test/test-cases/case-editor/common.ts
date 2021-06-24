// case editor common
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/06/06 20:51

import { getRequest } from '@/utils/request';
import * as APIS from '../service';
import { CaseItemVO, FuncProps } from '../interfaces';

export async function getFuncListByIds(funcs: FuncProps[]) {
  if (!funcs?.length) return [];

  return await Promise.all(
    funcs.map(async (n) => {
      if (typeof n === 'number' || typeof n === 'string') {
        n = { id: n };
      }

      const { data } = await getRequest(APIS.getFunc, {
        data: { id: n.id },
      });

      return { ...data, argument: n.argument };
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
