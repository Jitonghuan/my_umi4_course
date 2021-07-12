import React from 'react';

export interface IProps {
  /** 自定义组件 key */
  custom?: string;
  /** 自定义组件容器 */
  customMap?: ICustomMap;
}

export type ICustomMap = {
  [key: string]: React.ClassicComponentClass;
};

/**
 * 自定义扩展组件涛曾
 * @create 2021-01-06 14:35
 */
const Custom = (props: IProps) => {
  const { customMap = {}, custom, ...rest } = props;

  if (!custom || Object.keys(customMap).length === 0) {
    return null;
  }

  const CustomNode = customMap[custom];

  return <CustomNode {...rest} />;
};

export default Custom;
