import React from 'react';

import useDefaultStyle from '../../hooks/useDefaultStyle';
import FEForm, { IProps as IFEFormProps } from '../../wrapper';

import './index.less';

/**
 * 基础表单
 * @create 2021-01-03 23:37
 */
const BasicForm = (props: IFEFormProps) => {
  const defaultStyle = useDefaultStyle('inlineform');

  const defaultProps = {
    ...defaultStyle,
    layout: 'inline',
  } as IFEFormProps;

  return <FEForm {...defaultProps} {...props} />;
};

export default BasicForm;
