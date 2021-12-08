/**
 * @description: 标签管理接口逻辑hook
 * @name {muxi.jth}
 * @time {2021/12/06 11:27}
 */
import { useEffect, useState, useLayoutEffect } from 'react';
import { getRequest, postRequest, putRequest, delRequest } from '@/utils/request';
import * as APIS from './service';
import { message } from 'antd';

//标签列表数据

//新增标签
export function useCreateLabelTag() {
  const createTag = async (tagName: string, tagMark: string, categoryCodes: string) => {
    await postRequest(APIS.createTag, {
      data: { tagName, tagMark, categoryCodes },
    }).then((resp) => {
      if (resp.success) {
        message.success('新增标签成功！');
      }
    });
  };
  return [createTag];
}

//编辑标签
export function useEditLabel() {
  const editLabel = async (id: any, tagName: string, tagMark: string, categoryCodes: string) => {
    await putRequest(APIS.updateTag, {
      data: { id, tagName, tagMark, categoryCodes },
    }).then((resp) => {
      if (resp.success) {
        message.success('编辑标签成功！');
      }
    });
  };
  return [editLabel];
}

//删除标签
export function useDeleteLabel() {
  //  delRequest(`${APIS.deleteTmpl}/${id}`)
  const deleteLabel = (id: number) => {
    delRequest(`${APIS.deleteTag}/${id}`).then((resp) => {
      if (resp.success) {
        message.success('删除标签成功！');
      }
    });
  };
  return [deleteLabel];
}

//绑定标签
export function useBindLabelTag() {
  const bindLabelTag = async (tagCode: string, tagName: string, appCodes: any) => {
    await postRequest(APIS.bindTag, {
      data: { tagCode, tagName, appCodes },
    }).then((resp) => {
      if (resp.success) {
        message.success('绑定标签成功！');
      }
    });
  };
  return [bindLabelTag];
}

//解绑标签
export function useUnBindLabelTag() {
  const unbindLabelTag = async (tagCode: string, appCodes: any) => {
    await postRequest(APIS.unBindTag, {
      data: { tagCode, appCodes },
    }).then((resp) => {
      if (resp.success) {
        message.success('解绑标签成功！');
      }
    });
  };
  return [unbindLabelTag];
}

//获取应用标签 下拉选择数据
export function useGetAppTag() {
  const [appTagData, setAppTagData] = useState<any[]>([]);
  const getAppTagList = async (appCode: string) => {
    await getRequest(APIS.getAppTag, {
      data: { appCode },
    }).then((resp) => {
      if (resp.success) {
        let data = resp?.data;
        const next = (data || []).map((n: any) => ({
          label: n.tagName,
          value: n.tagName,
        }));
        setAppTagData(next);
      }
    });
  };
  return [getAppTagList, appTagData, setAppTagData];
}

//应用绑定标签
export function useBindAppTag() {
  const bindLabelTag = async (ids: any, appCode: string) => {
    await postRequest(APIS.bindAppTag, {
      data: { ids, appCode },
    }).then((resp) => {
      if (resp.success) {
        message.success('应用绑定标签成功！');
      }
    });
  };
  return [bindLabelTag];
}

//查询绑定列表 获取未绑定指定标签的应用(用于绑定标签)
export function useUnbindLabelList() {
  const [unbindLabelsource, setunBindLabelSource] = useState<any>([]);
  const [bindTagNames, setBindTagNames] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  let bindTag: any = [];

  const getUnBindTagAppList = async (tagCode: string, appCategoryCode?: string, appCode?: string, appType?: string) => {
    setLoading(true);

    await getRequest(APIS.getUnBindTagApp, {
      data: { tagCode, appCategoryCode, appCode, appType },
    })
      .then((result) => {
        const { data } = result || {};
        setunBindLabelSource(data);
        data.map((item: any) => {
          bindTag.push(item.bindTagNames);
        });
        setBindTagNames(bindTag);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [unbindLabelsource, getUnBindTagAppList, loading, bindTagNames];
}

//获取已绑定指定标签的应用(用于解绑标签)
export function usebindedLabelList() {
  const [bindedLabelsource, setBindedLabelSource] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const getBindedTagAppList = async (tagCode: string, appCategoryCode?: string, appCode?: string, appType?: string) => {
    setLoading(true);
    await getRequest(APIS.getBindedTagApp, {
      data: { tagCode, appCategoryCode, appCode, appType },
    })
      .then((result) => {
        const { data } = result || {};
        setBindedLabelSource(data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [bindedLabelsource, getBindedTagAppList, loading];
}

//获取应用分类下拉选择

export function useAppCategoryOption() {
  const [categoryData, setCategoryData] = useState<any[]>([]); //应用分类
  useEffect(() => {
    getRequest(APIS.appTypeList).then((result) => {
      const list = (result.data.dataSource || []).map((n: any) => ({
        label: n.categoryName,
        value: n.categoryCode,
        data: n,
      }));
      setCategoryData(list);
    });
  }, []);

  return [categoryData];
}
