// 日志搜索接口
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/06/23 09:24
// https://come-future.yuque.com/sekh46/bbgc7f/meg8ls#EEbQv

import { addAPIPrefix } from '@/utils';

export const getEnvList = addAPIPrefix('/logManage/logSearch/env');

export const getSearchUrl = addAPIPrefix('/logManage/logSearch/url');

export const ruleGroupOptions = addAPIPrefix('/logManage/alertrule/group/list');

export const ruleIndexOptions = addAPIPrefix('/logManage/alertrule/index/list');

//新增索引模式
export const createIndexMode = addAPIPrefix('/logManage/logSearch/indexMode/create');

//获取索引模式列表
export const queryIndexMode = addAPIPrefix('logManage/logSearch/indexMode');

//检索日志
export const logSearch = addAPIPrefix('logManage/logSearch/query');
