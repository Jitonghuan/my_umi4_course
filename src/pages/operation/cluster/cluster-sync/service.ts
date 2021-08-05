// cluster sync service
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/05 10:56

import { useState, useEffect } from 'react';
import { getRequest, postRequest } from '@/utils/request';
import * as APIS from '../service';

// TODO 将 queryClusterApp 和 deployApp 合并成一个接口
// 1. data.appCode 为空，或 data 为空，直接报错
// 2. appCode === 'Pass' ，代表进入下一步 （日志中提示 无应用xxx）
// 3. 其它，就立即调用 deployApp 的接口
// 4. deployApp 成功后再查一次

// 前端资源同步
// 轮循调接口（5s），如果返回 data ===  Pass 的，表示完成
//                 如果其它（全量日志），则显示增量日志
// doAction 支持 onProcess
