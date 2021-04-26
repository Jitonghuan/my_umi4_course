import React from 'react';
import { Descriptions } from 'antd';

import { DescriptionsProps } from 'antd/lib/descriptions';

export type IOption = {
  /** label */
  label?: string;
  /** value */
  value?: string;
};

export interface IProps extends DescriptionsProps {
  /** 数据源 */
  dataSource?: IOption[];
}

/**
 * 排版描述组件
 * @description 用于排版显示，label-value 模式
 * @author yyf
 * @version 1.0.0
 * @create 2021-04-26 14:30
 */
const funcName = (props: IProps) => {
  const { dataSource = [], ...rest } = props;

  return (
    <Descriptions {...rest}>
      {dataSource.map((el) => (
        <Descriptions.Item label={el.label}>{el.value}</Descriptions.Item>
      ))}
    </Descriptions>
  );
};

/**
 * 默认值
 */
funcName.defaultProps = {
  // 属性默认值配置
};

export default funcName;
