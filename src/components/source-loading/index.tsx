// source loading
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/27 15:02

import React from 'react';
import { Spin } from 'antd';
import './index.less';

export default function SourceLoading(props: any) {
  console.log(props.error)
  return (
    <div className="source-loading">
      {props.error && <div>{props.error.stack}</div>}
      {!props.error && <Spin tip="资源加载中……" />}
    </div>
  );
}
