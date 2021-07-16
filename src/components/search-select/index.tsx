/**
 * SearchSelect
 * @description 搜索选择器，并带有防抖
 * @author moting.nq
 * @create 2021-04-14 11:22
 */

import React, { ReactNode, useState, useRef, useMemo } from 'react';
import { Select, Spin } from 'antd';
import debounce from 'lodash/debounce';
import { IProps } from './types';
// import './index.less';

const SearchSelect = <
  ValueType extends {
    key?: string;
    label: ReactNode;
    value: string | number;
  } = any,
>({
  fetchOptions,
  debounceTimeout = 800,
  ...props
}: IProps) => {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState<ValueType[]>([]);
  const fetchRef = useRef(0);

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value: string) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);

      fetchOptions(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }

        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);

  return (
    <Select<ValueType>
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
      options={options}
    />
  );
};

SearchSelect.defaultProps = {};

export default SearchSelect;
