/**
 * List
 * @description 参数列表
 * @author moting.nq
 * @create 2021-04-14 14:28
 */

import React from 'react';
import { IProps } from './types';
import './index.less';

const rootCls = 'parameters-list-compo';

const List = ({
  title,
  footer,
  dataSource,
  width,
  contentHeight,
  className,
}: IProps) => {
  return (
    <div
      className={`${rootCls} ${className || ''}`}
      style={{ width: width || 220 }}
    >
      <div className={`${rootCls}__header`}>{title}</div>
      <div
        className={`${rootCls}__content`}
        style={{ height: contentHeight || 220 }}
      >
        {dataSource?.map((item) => (
          <div key={item.name} className={`${rootCls}__content-item`}>
            {item.name}: {item.value}
          </div>
        ))}
      </div>
      <div className={`${rootCls}__footer`}>{footer}</div>
    </div>
  );
};

List.defaultProps = {};

export default List;
