// case editor common
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/06/06 20:51

import { getRequest } from '@/utils/request';
import * as APIS from '../../service';
import { CaseItemVO, FuncProps } from '../../interfaces';

export async function getFuncListByIds(funcs: FuncProps[]) {
  if (!funcs?.length) return [];

  const resultList = await Promise.all(
    funcs.map(async (n) => {
      if (typeof n === 'number' || typeof n === 'string') {
        n = { id: n, type: 1 };
      }

      if (n.type === 1) {
        const { data } = await getRequest(APIS.getSqlInfo, {
          data: { id: n.id },
        }).catch((err) => ({} as any));

        return { ...data, type: 1, argument: n.argument };
      } else {
        const { data } = await getRequest(APIS.getFunc, {
          data: { id: n.id },
        }).catch((err) => ({} as any));

        return { ...data, type: 0, argument: n.argument };
      }
    }),
  );

  return resultList.filter((n) => n.id);
}

export async function getCaseListByIds(ids: number[]): Promise<CaseItemVO[]> {
  if (!ids?.length) return [];

  return (await getRequest(APIS.getCaseInfoBatch + '?ids=' + ids.join(','))).data;
}
