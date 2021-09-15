import React, { useContext } from 'react';
import { useLocation } from 'umi';
import { FeContext } from '@/common/hooks';
import VCPageContent, { IProps as IPageContentProps } from '@/components/vc-page-content';
import ErrorBoundary from '../error-boundary';

export interface IProps extends IPageContentProps {}

export default function PageContainer(props: React.PropsWithChildren<IProps>) {
  const { children, ...rest } = props;
  const { breadcrumbMap } = useContext(FeContext);
  const location = useLocation();

  return (
    <VCPageContent
      breadcrumbMap={breadcrumbMap}
      pathname={location.pathname}
      isFlex
      height="calc(100vh - 60px)"
      {...rest}
    >
      <ErrorBoundary>{children}</ErrorBoundary>
    </VCPageContent>
  );
}
