// 用户名搜索器
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/30 19:39

import React from 'react';
import DebounceSelect, { DebounceSelectProps } from '../debounce-select';
import { searchUser } from './service';

export type UserSelectorProps = Omit<DebounceSelectProps, 'fetchOptions'>;

export const stringToList = (str?: string) => {
  if (!str) return [];

  return str.split(/[,;\/，、]\s?|\s/).filter((n) => !!n);
};

export default function UserSelector(props: UserSelectorProps) {
  return (
    <DebounceSelect
      fetchOptions={searchUser}
      labelInValue={false}
      mode="multiple"
      placeholder="输入姓名、账号搜索（暂不支持花名）"
      {...props}
    />
  );
}
