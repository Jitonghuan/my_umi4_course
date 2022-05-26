// page wrapper
// @author Pluto <huazhi.chz@alibaba-inc.com>
// @create 2019/02/11

import React, { Component } from 'react';
import { Alert } from '@cffe/h2o-design';

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
      <Alert
        message="ERROR"
        description="页面出错啦！请刷新重试 ( F12 打开控制台，可查看错误信息 )"
        type="error"
        showIcon
      />
    ) : (
      this.props.children
    );
  }
}
