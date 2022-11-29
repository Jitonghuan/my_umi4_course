import { useState, useEffect } from 'react';
import { getRequest } from '@/utils/request';
import * as APIS from '../service';
import appConfig from '@/app.config';


export function useClusterSource(): [any, boolean, (envCode: string) => void] {
    const [data, setData] = useState<any[]>([]);
    const [loading,setLoading]=useState<boolean>(false)
     
      const getInfo=(envCode:string)=>{
        let dataArry: any = [];
        setLoading(true)
        getRequest(APIS.getHospitalDistrictInfo, { data: { envCode } }).then((resp) => {
            if (resp?.success) {
              resp.data?.map((ele: any) => {
                dataArry.push({
                  ...ele,
                  title: ele.hospitalDistrictName,
                  name: ele.hospitalDistrictCode,
                  nowDisPatchCluster: ele?.nowDisPatchCluster,
                  options: [
                    { label: 'A集群', value: 'cluster_a', ip: ele.hospitalDistrictIp },
                    { label: 'B集群', value: 'cluster_b', ip: ele.hospitalDistrictIp },
                  ],
                });
              });
              setData(dataArry);
            } else {
              setData([])
              return;
            }
          }).finally(()=>{
            setLoading(false)
          });
     

      }
     
  
  
    return [data,loading,getInfo];
  }

  export const queryClusterUserList = (envCode:string) => getRequest(APIS.listClusterUser, { data: { envCode} });
  
  