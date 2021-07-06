import React, { useMemo } from 'react';
import { Breadcrumb, Card } from 'antd';
import { CardProps } from 'antd/es/card';
import { history } from 'umi';
import classnames from 'classnames';
import './index.less';

export interface IProps {
  /** className */
  className?: string;

  /** style */
  style?: React.CSSProperties;

  /** 容器高度 */
  height?: string;

  /** 页面是否支持 flex 处理，一屏显示， true 为一屏显示 false 滚动 */
  isFlex?: boolean;

  /** 是否显示面包屑 */
  isShowBreadcrumb?: boolean;

  /** 面包屑路由数据 */
  breadcrumb?: { name: string; path: string }[];

  /** 路由平铺数据 */
  breadcrumbMap?: { [key: string]: { name: string; path: string } };

  /** 当前面包屑路由 */
  pathname?: string;
}

/** 处理面包屑的路由  /a/b => [/a, /a/b] */
export const splitBreadcrumbUrl = (url?: string) => {
  if (!url) {
    return [];
  }

  const urlArr = url.split('/');
  const targetArr: string[] = [];

  const target = urlArr.reduce((a: string, b: string) => {
    const nextUrl = [a, b].join('/');
    targetArr.push(nextUrl);
    return nextUrl;
  });

  return targetArr;
};

/**
 * 页面容器组件
 * @description 页面容器组件，处理容器层问题
 * @author yyf
 * @version 1.0.0
 * @create 2021-04-06 11:24
 */
const Coms: React.FC<IProps> = (props) => {
  const {
    isShowBreadcrumb,
    breadcrumb = [],
    style = {},
    pathname,
    breadcrumbMap = {},
    className = '',
    height = '',
    isFlex,
  } = props;

  // 面包屑
  const breadcrumbDOM = useMemo(() => {
    const urlArr = splitBreadcrumbUrl(pathname);

    const breadcrumbLists =
      breadcrumb.length > 0
        ? breadcrumb
        : urlArr
            .map((urlKey) => ({
              name: breadcrumbMap[urlKey] ? breadcrumbMap[urlKey].name : '',
              path: breadcrumbMap[urlKey] ? breadcrumbMap[urlKey].path : '',
            }))
            .filter((el) => !!el.name && !!el.path);

    return (
      <div className="vc-page-content-breadcrumb">
        <Breadcrumb>
          {breadcrumbLists.map((el) => (
            <Breadcrumb.Item>
              <a onClick={() => history.push(el.path)}>{el.name}</a>
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
      </div>
    );
  }, [pathname, breadcrumbMap, breadcrumb]);

  const curStyle = {
    ...style,
    height: isFlex ? height : undefined,
  };

  return (
    <div className={`vc-page-content ${isFlex ? 'is-flex' : ''} ${className}`} style={{ ...curStyle }}>
      {isShowBreadcrumb && breadcrumbDOM}
      {props.children}
    </div>
  );
};

/**
 * 默认值
 */
Coms.defaultProps = {
  // 属性默认值配置
  isFlex: false,
  isShowBreadcrumb: true,
};

export default Coms;

// filter card
export const FilterCard: React.FC<CardProps> = (props) => {
  const { children, className, ...rest } = props;

  return (
    <Card className={classnames('vc-page-content-filter', className)} {...rest}>
      {props.children}
    </Card>
  );
};

// content card
export const ContentCard: React.FC<CardProps> = (props) => {
  const { children, className, ...rest } = props;

  return (
    <Card className={classnames('vc-page-content-body', className)} {...rest}>
      {props.children}
    </Card>
  );
};

type CardRowGroupType = React.FC<React.HTMLAttributes<HTMLDivElement>> & {
  SlideCard: React.FC<CardProps & { width?: number }>;
};

// card row
export const CardRowGroup: CardRowGroupType = (props) => {
  const { children, className, ...rest } = props;

  return (
    <div className={classnames('vc-page-row', className)} {...rest}>
      {children}
    </div>
  );
};

// slide card
CardRowGroup.SlideCard = (props) => {
  const { children, className, width = 180, ...rest } = props;

  return (
    <Card className={classnames('vc-slide-card', className)} style={{ width }} {...rest}>
      {children}
    </Card>
  );
};
