import { getRequest} from '@/utils/request';
import * as APIS from './service';


// /** 查询环境列表 */
// export const queryEnvList = async () =>
//   await getRequest(APIS.queryEnvList, { data: { pageIndex: -1, pageSize: -1, envModel: "currency-deploy" } })
//     .then((result) => {
//       if (result?.success) {
//         const dataSource = result.data.dataSource || [];
//         let option = dataSource?.map((ele: any) => ({
//           label: ele?.envName,
//           value: ele?.envCode
//         }))
//         return option;

//       }
//       return [];
//     })

// /** 查询应用列表 */
// export const queryAppList = (params: {
//   start: string;
//   end: string;
//   envCode: string;
// }) =>
//   getRequest(APIS.getTrafficList, {
//     data: params,
//   }).then((res: any) => {
//     if (res?.success) {
//       const dataSource = res?.data || [];
//       return dataSource.map((app: any) => {
//         return {
//           ...app,
//           value: app.appCode,
//           label: app.appCode,
//         };
//       });
//     }
//     return [];
//   });


interface queryNodeParams {
  start: number;
  end: number;
  envCode: string;
  appCode: string
}
export const queryNodeList = (params: queryNodeParams) =>
  getRequest(APIS.queryPodInfoApi, { data: { ...params, pageSize: 1000 } }).then((res: any) => {
    if (res?.success) {
      const dataSource = res?.data;
      return dataSource
    }
    return [];
  });

interface queryCountOverviewParams {
  start: string;
  end: string;
  envCode: string;
  appId: string;
  podIps: string[];

}
//getCountOverview
export const getCountOverview = (params: queryCountOverviewParams) =>
  getRequest(APIS.getCountOverview, { data: params ,hideToast: true }).then((res: any) => {
  
    if (res?.success) {
      const dataSource = res?.data;
      return dataSource

    }
    return [];
  });

  export const getListAppEnv = (params:{appCode?:string}) =>
  getRequest(APIS.listAppEnv, { data:{...params,pageSize:-1}}).then((res: any) => {
  
    if (res?.success) {
      const dataSource = res?.data;
      let arry:any=[]
      dataSource?.map((item:any)=>{
        arry.push({
          label:item?.envName,
          value:item?.envCode,
        })
      })
      return arry

    }
    return [];
  });
  export const queryTrafficList = async (params: { envCode: string, start: string, end: string, needMetric?: boolean, keyWord?: string, isPreciseApp:boolean,ip?:string,hostName?:string }) =>

  await getRequest(APIS.getTrafficList, { data: params,hideToast: true },)
    .then((result) => {
      if (result?.success) {
        const dataSource = result.data || [];

        return dataSource;

      }
      return [];
    })
    