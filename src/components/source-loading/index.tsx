// source loading
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/27 15:02

import React from 'react';
import { Spin, Result, Button} from 'antd';
import { history } from 'umi';
import './index.less';

export default function SourceLoading(props: any) {
  if (props.error) {
    console.log(props.error)
    console.log(props.error.stack)
  }
  return (
    <div className="source-loading">
      {props.error && (
        <Result
          status="500"
          title=""
          subTitle="加载出错啦，尝试刷新一下吧"
          extra={<Button type="primary" onClick={() => history.go(0)}>刷新</Button>}
        />
      )}
      {!props.error && <Spin tip="资源加载中……" />}
    </div>
  );
}
