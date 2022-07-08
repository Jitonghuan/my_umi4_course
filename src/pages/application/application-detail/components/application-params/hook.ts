/*
 * @Author: muxi.jth 2016670689@qq.com
 * @Date: 2022-07-08 10:23:50
 * @LastEditors: muxi.jth 2016670689@qq.com
 * @LastEditTime: 2022-07-08 14:42:28
 * @FilePath: /fe-matrix/src/pages/application/application-detail/components/application-params/hook.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useEffect, useState, useLayoutEffect } from 'react';
import { getRequest, postRequest, delRequest, putRequest } from '@/utils/request';
import * as APIS from '@/pages/application/service';
import { message } from 'antd';

//查看deployment的事件
export function useDeleteTempl(): [boolean, (id: number) => Promise<void>] {
  const [loading, setLoading] = useState<boolean>(false);
  const deleteTempl = async (id: number) => {
    setLoading(true);
    await delRequest(`${APIS.deleteTempl}/${id}`)
      .then((result) => {
        if (result?.success) {
          message.success('删除模版成功！');
          // window.location.reload();
        }
        if (!result?.success) {
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, deleteTempl];
}
