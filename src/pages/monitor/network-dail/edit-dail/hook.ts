import { useState, useEffect } from 'react';
import * as APIS from '../service';
import { message } from 'antd';
import { getRequest, postRequest, delRequest } from '@/utils/request';
// 创建产品
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
                    value: item.id,
                    key:item.id
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

  // 删除产品
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