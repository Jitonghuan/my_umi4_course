// 带防抖的搜索下拉框
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/06/03 08:48

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Select, Spin, Empty } from '@cffe/h2o-design';
import type { SelectProps } from 'antd/lib/select';
import debounce from 'lodash/debounce';

export interface DebounceSelectProps extends SelectProps<IOption> {
  fetchOptions: (search: string) => Promise<IOption[]>;
  debounceTimeout?: number;
  fetchOnMount?: boolean;
}

export default function DebounceSelect(props: DebounceSelectProps) {
  const { fetchOptions, debounceTimeout = 300, fetchOnMount, ...others } = props;
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState<IOption[]>([]);
  const fetchRef = useRef(0);

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value: string) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);

      fetchOptions(value?.trim()).then((newOptions) => {
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

  useEffect(() => {
    if (fetchOnMount) {
      debounceFetcher('');
    }
  }, []);

  return (
    <Select<IOption>
      showSearch
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={
        fetching ? (
          <Spin size="small" />
        ) : fetchOnMount ? null : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="无搜索结果" />
        )
      }
      {...others}
      options={options}
    />
  );
}
