/**
 * SearchUserSelect
 * @description 搜索用户选择器
 * @author moting.nq
 * @create 2021-04-14 11:33
 */

import React from 'react';
import SearchSelect from '@/components/search-select';
import { IProps } from './types';
// import './index.less';

const SearchUserSelect = ({ placeholder, ...props }: IProps) => {
  return (
    <SearchSelect
      style={{ width: '80%' }}
      showSearch
      allowClear
      {...props}
      placeholder={placeholder || '输入花名/拼音'}
      fetchOptions={fetchUserList}
    />
  );
};

SearchUserSelect.defaultProps = {};

export default SearchUserSelect;

async function fetchUserList(username: string): Promise<any> {
  console.log('fetching user', username);

  // TODO 搜索地址？？？
  return fetch('https://randomuser.me/api/?results=5')
    .then((response) => response.json())
    .then((body) =>
      body.results.map((user: { name: { first: string; last: string }; login: { username: string } }) => ({
        label: `${user.name.first} ${user.name.last}`,
        value: user.login.username,
      })),
    );
}
