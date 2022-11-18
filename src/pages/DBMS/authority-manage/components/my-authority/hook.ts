/*
 * @Author: muxi.jth 2016670689@qq.com
 * @Date: 2022-10-10 16:58:55
 * @LastEditors: muxi.jth 2016670689@qq.com
 * @LastEditTime: 2022-10-17 19:27:34
 * @FilePath: /fe-matrix/src/pages/DBMS/authority-manage/components/my-authority/hook.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useState, useEffect, useCallback } from 'react';
import { getRequest, postRequest, delRequest, putRequest } from '@/utils/request';
import * as APIS from '../../../service';
import { message } from 'antd';

//删除用户角色
export function useDeletePriv(): [boolean, (paramsObj: { id: number }) => Promise<void>] {
  const [loading, setLoading] = useState<boolean>(false);
  const deletePriv = async (paramsObj: { id: number }) => {
    setLoading(true);
    await delRequest(`${APIS.delPrivApi}?id=${paramsObj.id}`)
      .then((result) => {
        if (result?.success) {
          message.success('删除成功！');
        } else {
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, deletePriv];
}