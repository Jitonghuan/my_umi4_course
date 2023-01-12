import { useState, useCallback, useEffect } from 'react';
import { putRequest,delRequest,postRequest,getRequest } from '@/utils/request';
import { message } from 'antd';
import * as APIS from './service';
//删除交付配置参数

export function useDeleteAlertGroup(): [boolean, (id: number) => Promise<void>] {
    const [loading, setLoading] = useState<boolean>(false);
    const deleteAlertGroup = async (id: number) => {
      setLoading(true);
      try {
        await delRequest(`${APIS.deleteAlertGroup}/${id}`)
          .then((res) => {
            if (res.success) {
              message.success(res.data);
            } else {
              return;
            }
          })
          .finally(() => {
            setLoading(false);
          });
      } catch (error) {
        console.log(error);
      }
    };
    return [loading, deleteAlertGroup];
  }

  
  export const addAlertGroup = (params: any) =>
   postRequest(APIS.addAlertGroup, {
    data: params,
   
  });
  export const updateAlertGroup = (params: any) =>
  putRequest(APIS.updateAlertGroup, {
   data: params,
  
 });
 export function usePushAlertGroup(): [
    boolean,
    (paramsObj: { alertGroupId: any; monitorRules: any }) => Promise<void>,
  ] {
    const [loading, setLoading] = useState<boolean>(false);
    const pushAlertGroup = async (paramsObj: {  alertGroupId: any; monitorRules: any  }) => {
      setLoading(true);
      await postRequest(`${APIS.pushAlertGroup}`, { data: paramsObj })
        .then((result) => {
          if (result?.success) {
            message.success('推送成功！');
          } 
        })
        .finally(() => {
          setLoading(false);
        });
    };
  
    return [loading, pushAlertGroup];
  }

  //checkName
  export const checkName = (groupName:string) =>
  getRequest(`${APIS.checkName}?groupName=${groupName}`,);
  