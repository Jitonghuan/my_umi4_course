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
export function useLabelList() {
  const [labelListSource, setLabelListSource] = useState<any>();
  const getLabelList = (pageIndex?: string, pageSize?: string, tagNameParam?: string) => {
    getRequest(APIS.getTagList, {
      data: { pageIndex: pageIndex || 1, pageSize: pageSize || 20, tagName: tagNameParam || '' },
    }).then((result) => {
      const { dataSource } = result.data || [];
      setLabelListSource(dataSource);
    });
  };
  useEffect(() => {
    getLabelList();
  }, []);

  return [labelListSource, getLabelList, setLabelListSource];
}

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
  const deleteLabel = (id: number) => {
    delRequest(APIS.deleteTag, {
      data: { id },
    }).then((resp) => {
      if (resp.success) {
        message.success('删除标签成功！');
      }
    });
  };
  return [deleteLabel];
}

//绑定标签
export function useBindLabelTag() {
  const bindLabelTag = async (id: number, appCodes: any) => {
    await postRequest(APIS.bindTag, {
      data: { id, appCodes },
    }).then((resp) => {
      if (resp.success) {
        message.success('绑定标签成功！');
      }
    });
  };
  return [bindLabelTag];
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

//查询绑定列表
export function usebindLabelList() {
  const [bindLabelsource, setBindLabelSource] = useState<IOption[]>([]);

  const getAppList = () => {
    getRequest(APIS.getAppList, {
      data: { pageSize: -1 },
    }).then((result) => {
      const { dataSource } = result.data || {};
      const next = (dataSource || []).map((item: any) => ({
        label: item.appCode,
        value: item.appCode,
      }));

      setBindLabelSource(next);
    });
  };

  return [bindLabelsource];
}
