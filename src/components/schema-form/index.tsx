import React from 'react';

import BasicForm from './theme/BasicForm';
import InlineForm from './theme/InlineForm';
import { IProps as IFEForm } from './wrapper';
import { componentsEnum as totalComponentsEnum } from './hooks/useComponents';

export type ITheme = 'basic' | 'inline';

export interface IProps extends IFEForm {
  /** 主题 */
  theme?: ITheme;
}

export const themeEnum = {
  basic: BasicForm,
  inline: InlineForm,
} as { [key: string]: any };

// 枚举所有注册的可用组件
export const componentsEnum = [...totalComponentsEnum];

/**
 * form 表单容器
 * @create 2021-01-06 12:45
 */
const FEFormWrapper = (props: IProps) => {
  const { theme = 'basic', ...rest } = props;
  const TargetForm = themeEnum[theme];

  return <TargetForm {...rest} />;
};

/**
 * 默认值
 */
FEFormWrapper.defaultProps = {
  // 属性默认值配置
  theme: 'basic',
};

export default FEFormWrapper;

export { default as BasicForm } from './theme/BasicForm';
export { default as InlineForm } from './theme/InlineForm';
