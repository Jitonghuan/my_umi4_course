/*
 * @Author: muxi.jth 2016670689@qq.com
 * @Date: 2023-02-02 16:16:55
 * @LastEditors: muxi.jth 2016670689@qq.com
 * @LastEditTime: 2023-02-02 16:16:56
 * @FilePath: /fe-matrix/src/pages/database/backup/backup-plan/create-plan/hooks.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useState } from 'react';
import { getRequest, postRequest, delRequest, putRequest } from '@/utils/request';
import * as APIS from '../../../service';
import { message } from 'antd';
//集群列表
export function useGetClusterList(): [boolean, any, () => Promise<void>] {
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<any>([]);
    const getClusterList = async () => {
      setLoading(true);
      await getRequest(`${APIS.getClusterList}`, { data: { pageIndex: -1, pageSize: -1,clusterType:3 } })
        .then((result) => {
          if (result?.success) {
            let dataSource = result?.data?.dataSource;
            const dataArry = dataSource?.map((item: any) => ({
              ...item,
              label: item?.name,
              value: item?.id,
              key: item?.id,
              
            }));
            setData(dataArry || []);
          } else {
            return;
          }
        })
        .finally(() => {
          setLoading(false);
        });
    };
  
    return [loading, data, getClusterList];
  }