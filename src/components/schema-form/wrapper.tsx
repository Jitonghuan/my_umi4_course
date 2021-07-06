import React from 'react';

import FEForm, { IProps as IFEFormProps } from './FEForm';
import FEFormItem from './FEFormItem';
import useDefaultStyle from './hooks/useDefaultStyle';
import { ISchemaItem as ISchemaItemCopy } from './type';

export interface IProps extends IFEFormProps {
  /** schema */
  schema: ISchemaItem[];

  /** 自定义组件传入 */
  customMap?: { [key: string]: React.ReactNode };
}

export type ISchemaItem = ISchemaItemCopy;

/**
 * 表单渲染组件
 * @create 2021-01-03 22:07
 */
const FormRender = (props: IProps) => {
  const { className = '', schema = [], labelColSpan, isShowReset, customMap = {}, ...rest } = props;
  const defaultStyle = useDefaultStyle('form', { className });

  const formProps = {
    labelColSpan,
    isShowReset,
    ...defaultStyle,
    ...rest,
  } as IFEFormProps;

  return (
    <FEForm {...formProps}>
      {schema.map((el: ISchemaItem, idx: number) => (
        <FEFormItem key={idx} {...el} customMap={customMap} />
      ))}
    </FEForm>
  );
};

export default FormRender;
