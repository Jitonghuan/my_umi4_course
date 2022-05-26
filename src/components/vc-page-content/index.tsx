import React, { useMemo } from 'react';
import { Breadcrumb, Card } from '@cffe/h2o-design';
import type { CardProps } from 'antd/lib/card';
import { history } from 'umi';
import classnames from 'classnames';
import './index.less';

export interface IProps {
  className?: string;
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
const splitBreadcrumbUrl = (url?: string) => {
  if (!url) return [];

  const urlArr = url.split('/');
  const targetArr: string[] = [];

  urlArr.reduce((prev: string, curr: string) => {
    const nextUrl = `${prev}/${curr}`;
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
export default function VCPageContent(props: React.PropsWithChildren<IProps>) {
  const {
    isShowBreadcrumb = true,
    breadcrumb = [],
    style = {},
    pathname,
    breadcrumbMap = {},
    className = '',
    height = '',
    isFlex,
  } = props;

  // 面包屑
  const breadcrumbLists = useMemo(() => {
    const urlArr = splitBreadcrumbUrl(pathname);

    return breadcrumb.length > 0
      ? breadcrumb
      : urlArr
          .map((urlKey) => ({
            name: breadcrumbMap[urlKey] ? breadcrumbMap[urlKey].name : '',
            path: breadcrumbMap[urlKey] ? breadcrumbMap[urlKey].path : '',
          }))
          .filter((el) => !!el.name && !!el.path);
  }, [pathname, breadcrumbMap, breadcrumb]);

  const curStyle = { ...style, height: isFlex ? height : undefined };
  const clazz = classnames('vc-page-content', { 'is-flex': isFlex }, className);

  return (
    <div className={clazz} style={{ ...curStyle }}>
      {isShowBreadcrumb && (
        <div className="vc-page-content-breadcrumb">
          <Breadcrumb>
            {breadcrumbLists.map((el, index) => (
              <Breadcrumb.Item key={index}>
                <a onClick={() => history.push(el.path)}>{el.name}</a>
              </Breadcrumb.Item>
            ))}
          </Breadcrumb>
        </div>
      )}
      {props.children}
    </div>
  );
}

interface ICardProps extends CardProps {
  noPadding?: boolean;
}

// filter card
export function FilterCard(props: React.PropsWithChildren<ICardProps>) {
  const { children, noPadding, className, ...rest } = props;

  const clazz = classnames('vc-page-content-filter', className, {
    'no-padding': noPadding,
  });

  return (
    <Card className={clazz} {...rest}>
      {props.children}
    </Card>
  );
}

// content card
export function ContentCard(props: React.PropsWithChildren<ICardProps>) {
  const { children, noPadding, className, ...rest } = props;
  const clazz = classnames('vc-page-content-body', className, {
    'no-padding': noPadding,
  });

  return (
    <Card className={clazz} {...rest}>
      {props.children}
    </Card>
  );
}

type CardRowGroupType = React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>;

// card row
export function CardRowGroup(props: CardRowGroupType) {
  const { children, className, ...rest } = props;

  return (
    <div className={classnames('vc-page-row', className)} {...rest}>
      {children}
    </div>
  );
}

// slide card
export function SlideCard(props: React.PropsWithChildren<ICardProps & { width?: number }>) {
  const { children, className, noPadding, width = 180, ...rest } = props;

  const clazz = classnames('vc-slide-card', className, {
    'no-padding': noPadding,
  });

  return (
    <Card className={clazz} style={{ width }} {...rest}>
      {children}
    </Card>
  );
}

// slide card
CardRowGroup.SlideCard = SlideCard;
