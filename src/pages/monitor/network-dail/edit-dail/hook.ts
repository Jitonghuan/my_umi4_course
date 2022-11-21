import { useState, useEffect } from 'react';
import * as APIS from '../service';
import { message } from 'antd';
import { getRequest, postRequest, delRequest } from '@/utils/request';
/** 查询列表 */
export interface tableItems{
  probeName?: string;
  probeUrl?: string;
  clusterName: string;
  probeType?:string;
  status?:number;
  pageSize?: number;
  pageIndex?: number;

}
export const getNetworkProbeList = (paramsObj?:tableItems) => {
  return getRequest(APIS.getNetworkProbeList, {
    data: {
     ...paramsObj,
      pageIndex: paramsObj?.pageIndex || 1,
      pageSize: paramsObj?.pageSize || 20,
    },
  }).then((res: any) => {
    if (res?.success) {
      const dataSource = res.data?.dataSource || [];
      const total = res.data?.total || 0;

      return {dataSource, total};
    }
    return {};
  });
};
// 6、获取拨测类型
export function useGetNetworkProbeType(): [boolean,any, () => Promise<void>] {
    const [loading, setLoading] = useState(false);
    const [data,setData]=useState<any>([])
    const getNetworkProbeType = async () => {
      setLoading(true);
      try {
        await getRequest(APIS.networkProbeType)
          .then((res) => {
            if (res?.success) {
              let data=res?.data
              let  source=  data?.map((item:string)=>({
                  label:item,
                  value:item,
                  key:item

              }))
              setData(source)
            } else {
                setData([])
             
            }
          })
          .finally(() => {
            setLoading(false);
          });
      } catch (error) {
        console.log(error);
      }
    };
    return [loading,data, getNetworkProbeType];
  }

  /**
 * GET 查看集群列表
 */
//getClusterApi
export function useGetCluster(): [boolean,any, () => Promise<void>] {
    const [loading, setLoading] = useState(false);
    const [data,setData]=useState<any>([])
    const getCluster = async () => {
      setLoading(true);
      try {
        await getRequest(APIS.getClusterApi)
          .then((res) => {
            if (res.success) {
                const data = res.data.map((item: any) => {
                  return {
                    label: item.clusterName,
                    value: item.clusterName,
                   key:item.clusterName
                  }
                
                })
                setData(data)
            } else {
                setData([])
             
            }
          })
          .finally(() => {
            setLoading(false);
          });
      } catch (error) {
        console.log(error);
      }
    };
    return [loading,data, getCluster];
  }

  // 删除
export function useDelNetworkProbe(): [boolean,(id:number) => Promise<void>] {
  const [loading, setLoading] = useState(false);

  const deleteNetworkProbe = async (id:number) => {
    setLoading(true);
    try {
      await delRequest(APIS.deleteNetworkProbe,{data:{id}})
        .then((res) => {
          if (res?.success) {
              message.success("删除成功！")
        
          }})
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  };
  return [loading,deleteNetworkProbe];
}
export interface CreateNeworkProbeItems{
  clusterName:string;
  probeName:string;
  probeUrl:string;
  probeType:string;
  probeInterval:string;
  probeTimeout:string;
  probesConfig:string
  headers:any[];
  basicAuth:any[];
  dnsType:string;
  dnsProtocol:string;
  dnsServer:string;
  queryResponse:any[];




}
// 新建
// export function useCreateNetworkProbe(): [boolean,(params:any) => Promise<void>] {
//   const [loading, setLoading] = useState(false);

//   const createNetworkProbe = async (params:any) => {
//     setLoading(true);
//     try {
//       await delRequest(APIS.createNetworkProbe,{data:params})
//         .then((res) => {
//           if (res?.success) {
//               message.success("创建成功！")
        
//           }})
//         .finally(() => {
//           setLoading(false);
//         });
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   return [loading,createNetworkProbe];
// }

export const createNetworkProbe = (params: CreateNeworkProbeItems) =>
  postRequest(APIS.createNetworkProbe, {
    data: params,
  });