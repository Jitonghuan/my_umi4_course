import { useState } from 'react';
import { postRequest, delRequest, putRequest,getRequest } from '@/utils/request';
import * as APIS from '../service';
import { message } from 'antd';
export interface CreateItems{
    id?:number;
    backupName: string; 
    backupType: string;
    backupObj: string; 
    clusterId: number ;
    backupCycle:string;
    backupTime:string;
    storeTime:string

}
//新增
export function useAddBackupPlan(): [
  boolean,
  (paramsObj:CreateItems) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const createBackupPlan = async (paramsObj: CreateItems) => {
    setLoading(true);
    await postRequest(APIS.createBackupPlan, { data: paramsObj })
      .then((result) => {
        if (result.success) {
          message.success('新增成功！');
        } else {
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, createBackupPlan];
}

//修改
export function useUpdateBackupPlan(): [
  boolean,
  (paramsObj:CreateItems) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const updateBackupPlan = async (paramsObj:CreateItems) => {
    setLoading(true);
    await putRequest(APIS.updateBackupPlan, { data: paramsObj })
      .then((result) => {
        if (result?.success) {
          message.success('修改成功！');
        } else {
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, updateBackupPlan];
}

//删除
export function useDeleteBackupPlan(): [boolean, (paramsObj: { id: number }) => Promise<void>] {
  const [loading, setLoading] = useState<boolean>(false);
  const deleteBackupPlan = async (paramsObj: { id: number }) => {
    setLoading(true);
    await delRequest(`${APIS.deleteBackupPlan}/${paramsObj.id}`)
      .then((result) => {
        if (result.success) {
          message.success('删除成功！');
        } else {
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, deleteBackupPlan];
}
//删除
export function useGetBackupTypeList(): [boolean,any, () => Promise<void>] {
    const [loading, setLoading] = useState<boolean>(false);
    const [data,setData]=useState<any>([])
    const getBackupTypeList = async () => {
      setLoading(true);
      await getRequest(`${APIS.getBackupTypeList}`)
        .then((result) => {
            let data =(result?.data||[])?.map((ele:string)=>({
                key:ele,
                value:ele,
                label:ele
            }))
            setData(data)
        })
        .finally(() => {
          setLoading(false);
        });
    };
  
    return [loading, data,getBackupTypeList];
  }
