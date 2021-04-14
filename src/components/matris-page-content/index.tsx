import React, { useContext } from 'react';
import { useLocation } from 'umi';

import FeContext from '@/layouts/basic-layout/FeContext';
import VCPageContent, {
  IProps as IPageContentProps,
} from '@/components/vc-page-content';

export interface IProps extends IPageContentProps {}

/**
 * Board
 * @description 监控面板
 * @create 2021-04-12 19:13:58
 */
const Coms: React.FC<IProps> = (props) => {
  const { children, ...rest } = props;
  const feContent = useContext(FeContext);
  const location = useLocation();

  return (
    <VCPageContent
      breadcrumbMap={feContent.breadcrumbMap}
      pathname={location.pathname}
      isFlex
      height="calc(100vh - 60px)"
      {...rest}
    >
      {children}
    </VCPageContent>
  );
};

export default Coms;
