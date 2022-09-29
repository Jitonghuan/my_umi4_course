import { useState, useEffect,useCallback } from 'react';
import * as APIS from '../../../../service';
import { message } from 'antd';
import { getRequest, postRequest ,delRequest} from '@/utils/request';

//packageListApi
export const getPackageList = (indentId:number) => {
    return getRequest(APIS.packageListApi, { data:{indentId} });
  };