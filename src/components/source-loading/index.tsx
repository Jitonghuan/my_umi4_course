// source loading
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/27 15:02

import React from 'react';
import { Spin } from '@cffe/h2o-design';
import './index.less';

export default function SourceLoading() {
  return (
    <div className="source-loading">
      <Spin tip="资源加载中……" />
    </div>
  );
}
