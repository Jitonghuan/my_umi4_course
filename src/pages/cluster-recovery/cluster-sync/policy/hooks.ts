
import { useState, useEffect, useCallback } from 'react';
import * as APIS from '../../service';
import { getRequest } from '@/utils/request';
import appConfig from '@/app.config';
//getSyncStrategyListApi
//双集群配置列表
interface diffParams{
    envCode:string    //    环境Code		 true 
    type:string     //  比对类型    	 true  枚举：单配置同步: single  命名空间同步: namespace
    namespace:string     //  nacos 命名空间    true
    dataId:string      // 配置项Data ID      false

}
export const getSyncStrategyList = (envCode:string) =>
getRequest(APIS.getSyncStrategyListApi, {
   data: {envCode},
 });