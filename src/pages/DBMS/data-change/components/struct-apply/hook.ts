
import { useState } from 'react';
import { getRequest, postRequest, delRequest, putRequest } from '@/utils/request';
import * as APIS from '../../../service';
import { message } from 'antd';


export interface createItems{
    id:number|undefined,
    title:string,
    remark:string,
    runStartTime:string,
    runEndTime:string,
    allowTiming:string
}
export const createSync = (paramsObj: createItems) =>
postRequest(APIS.createSyncInfoApi, {
  data: paramsObj,
});

// export function useCreateSyncInfo(): [
//     boolean,
//     (paramsObj: createItems) => Promise<void>,
//   ] {
//     const [loading, setLoading] = useState<boolean>(false);
//     const createSync = async (paramsObj:createItems) => {
//       setLoading(true);
//       await postRequest(APIS.createSyncInfoApi, { data: paramsObj })
//         .then((result) => {
//           if (result?.success) {
//             message.success('提交成功！');
//           } else {
//             return;
//           }
//         })
//         .finally(() => {
//           setLoading(false);
//         });
//     };
  
//     return [loading, createSync];
//   }
export interface diffTableParams{
    fromEnvCode:string,
    fromInstanceId:number,
    fromDbCode:string,
    toEnvCode:string,
    toInstanceId:number,
    toDbCode:string,
    isAllTable:boolean,
    comparedTables:string[]


}
export const useCompareSyncInfo = ( params: diffTableParams) =>
postRequest(APIS.compareSyncInfoApi,{data:params}).then((res: any) => {
  if (res?.success) {
    const dataSource = res?.data || {};
    return dataSource;
  }
  return {};
});
