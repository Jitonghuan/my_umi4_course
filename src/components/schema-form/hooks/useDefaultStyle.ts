import ClassNames from 'classnames';

export interface IProps {
  style?: React.CSSProperties | any;
  className?: string;
}

/**
 * style 和 className 影响样式的配置
 */
export default (componentName: string, options?: IProps) => {
  const { className = '' } = options || {};
  const curClassName = ClassNames(`fe-end-${componentName}`, className);

  return {
    className: curClassName,
  } as { className: string };
};
