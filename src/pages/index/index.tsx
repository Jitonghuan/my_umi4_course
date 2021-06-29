import React from 'react';
import { useLocation } from 'umi';

import IndexImg from '@/assets/imgs/index.png';
import IndexGif from '@/assets/imgs/index.gif';

import './index.less';

export interface IProps {}

/**
 * index
 * @description 首页
 * @create 2021-04-12 19:15:42
 */
const Index = (props: IProps) => {
  const location = useLocation();

  return (
    <div className="index-page-bg" style={{ backgroundImage: `url(${IndexImg})` }}>
      <img src={IndexGif} alt="系统首页" />
    </div>
  );
};

export default Index;
