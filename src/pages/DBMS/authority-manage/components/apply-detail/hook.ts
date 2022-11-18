import { useState } from 'react';
import * as APIS from '../../../service';
import { message } from 'antd';
import { getRequest, postRequest, delRequest } from '@/utils/request';
interface createPrivItem{
    remark?:string;
    privWfType:string;
    privList?:string[];
    envCode:string;
    instanceId:number;
    dbList?:string[];
    tableList?:string[];
    validStartTime?:string;
    validEndTime?:string;
    limitNum?:number;
    title:string

}
//保存交付配置参数
export function useCreatePriv(): [
    boolean,
    (paramsObj:createPrivItem) => Promise<void>,
  ] {
    const [loading, setLoading] = useState<boolean>(false);
    const createPriv = async (paramsObj:createPrivItem) => {
      setLoading(true);
      try {
        await postRequest(APIS.createPrivApi, {
          data: paramsObj,
        })
          .then((res) => {
            if (res?.success) {
              message.success('保存成功！');
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
    return [loading, createPriv];
  }