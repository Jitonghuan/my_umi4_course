/**
 * model 文件
 * @description 用于存放数据逻辑处理和服务调用
 * @create {{timeStr}}
 *
 */
import { Subscription, Effect } from 'dva';
import { Reducer } from 'redux'

export interface IndexModelState {
  [key: string]: string;
}

export interface IndexModelType {
  namespace: string;
  state: IndexModelState;
  effects: {
    [key: string]: Effect;
  };
  reducers: {
    save: Reducer<IndexModelState>;
  };
  subscriptions?: { setup: Subscription };
}

// 下面是示例，可删除或者更改
const IndexModel: IndexModelType = {
  namespace: '',
  state: {
    // name: '',
  },
  effects: {
    // *query({ payload }, { call, put }) {},
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};

 IndexModel;