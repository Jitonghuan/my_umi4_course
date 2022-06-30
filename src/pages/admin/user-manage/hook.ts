import { useState } from 'react';
import { getRequest, postRequest, delRequest, putRequest } from '@/utils/request';
import * as APIS from './service';

import { message } from 'antd';

//删除
export function useDeleteUser(): [boolean, (paramsObj: { id: number }) => Promise<void>] {
  const [loading, setLoading] = useState<boolean>(false);
  const deleteUser = async (paramsObj: { id: number }) => {
    setLoading(true);
    await delRequest(`${APIS.deleteUser}/${paramsObj.id}`)
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

  return [loading, deleteUser];
}
