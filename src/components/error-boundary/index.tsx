// page wrapper
// @author Pluto <huazhi.chz@alibaba-inc.com>
// @create 2019/02/11

import React, { Component } from 'react';
import { Result,Button } from 'antd';

export default class ErrorBoundary extends Component {
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  state = { hasError: false };

  componentDidCatch(error: any, info: any) {
    const title = `[${new Date().toISOString()}] ErrorBoundary.componentDidCatch: `;
    console.group(title);
    console.error(error);
    console.info(info);
    console.groupEnd();
  }

  render() {
    return this.state.hasError ? (
      <Result
          status="500"
          title=""
          subTitle="页面出错啦，请尝试刷新一下吧～"
          extra={<Button type="primary" onClick={() => history.go(0)}>刷新</Button>}
      />
    ) : (
      this.props.children
    );
  }
}
