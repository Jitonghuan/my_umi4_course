import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import { usePaginated } from '@cffe/vc-hulk-table';
import { queryVersionApi } from '../service';

export interface IProps {
  /** value */
  value: string;
  /** onChange */
  onChange: (val: string) => void;
  /** 参数 */
  options: IOption[];
}

/**
 * 版本选择组件
 * @version 1.0.0
 * @create 2021-04-26 17:38
 */
const funcName = (props: IProps) => {
  const { value, onChange, options = [] } = props;

  const handleChange = (val: string) => {
    onChange && onChange(val);
  };

  return (
    <Select
      showSearch
      value={value}
      placeholder="请选择版本号"
      dropdownMatchSelectWidth={160}
      allowClear
      showArrow
      onChange={handleChange}
      options={options}
    />
  );
};

/**
 * 默认值
 */
funcName.defaultProps = {
  // 属性默认值配置
};

export default funcName;
