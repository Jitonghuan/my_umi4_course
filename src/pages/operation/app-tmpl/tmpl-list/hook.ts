import { useState, useEffect, useCallback } from 'react';
import { getRequest, postRequest, delRequest, putRequest } from '@/utils/request';
import * as APIS from '../service';
import { message } from 'antd';

//删除模板
export function useDeleteTmpl(): [boolean, (paramsObj: { id: number }) => Promise<void>] {
    const [loading, setLoading] = useState<boolean>(false);
    const deleteTmpl = async (paramsObj: { id: number }) => {
      setLoading(true);
      await delRequest(`${APIS.deleteTmpl}/${paramsObj?.id}`)
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
  
    return [loading, deleteTmpl];
  }