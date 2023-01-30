import { postRequest, getRequest, putRequest, delRequest } from '@/utils/request';
import * as APIS from './service';
import { message } from 'antd';
import { useEffect, useState } from 'react';
import appConfig from '@/app.config';

export function useQueryCategory() {
    const [categoryData, setCategoryData] = useState<any[]>([]); //应用分类
    useEffect(() => {
      selectCategory();
    }, []);
    // 加载应用分类下拉选择
    const selectCategory = () => {
      getRequest(APIS.appTypeList).then((result) => {
        const list = (result?.data?.dataSource || []).map((n: any) => ({
          label: n.categoryName,
          value: n.categoryCode,
          data: n,
          key:n.categoryCode,
        }));
        setCategoryData(list);
      });
    };
    return [categoryData];
  }

  //删除数据
export function useDeleteCicdTemplate() {
    const deleteCicdTemplate = async(id: number) => {
     await postRequest(APIS.deleteCicdTemplate, {
        data: { id },
      }).then((resp) => {
        if (resp?.success) {
          message.info('删除成功！');
        }
      });
    };
    return [deleteCicdTemplate];
  }

    //更新
    interface updateItems {
        id:number;
        templateName?: string;
        templateValue?: string;
        templateDesc?: string;
    
    }

    export const updateCicdTemplate = (params: updateItems) =>
      postRequest(APIS.updateCicdTemplate, {
        data: params,
      });



interface createItems {
    templateName?: string;
    templateValue?: string;
    templateType?: string;
    buildType?: string;
    appType:string;
    appLanguage:string;
    appCategoryCode:string;
    templateDesc:string;

}
//新建安全规则
export const createCicdTemplate = (params: createItems) =>
  postRequest(APIS.createCicdTemplate, {
    data: params,
  });