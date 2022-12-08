import { getRequest, } from '@/utils/request';
import * as APIS from './service';


export const queryEnvList = async () =>
  await getRequest(APIS.queryEnvList, { data: { pageIndex: -1, pageSize: -1, envModel: "currency-deploy" } })
    .then((result) => {
      if (result?.success) {
        const dataSource = result.data.dataSource || [];
        let option = dataSource?.map((ele: any) => ({
          label: ele?.envName,
          value: ele?.envCode,
          ...ele
        }))
        return option;

      }
      return [];
    })

export const queryTrafficList = async (params: { envCode: string, start: string, end: string, needMetric?: boolean, keyWord?: string, isPreciseApp:boolean, }) =>

  await getRequest(APIS.getTrafficList, { data: params })
    .then((result) => {
      if (result?.success) {
        const dataSource = result.data || [];

        return dataSource;

      }
      return [];
    })
