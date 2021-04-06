import React, { ReactChild, useEffect } from 'react';

export interface IProps {
  favicon: string;
  title: string;
}

const DocumentTitle: React.FC<IProps> = (props) => {
  useEffect(() => {
    // 设置favicon
    const link: any =
      document.querySelector("link[rel*='icon']") ||
      document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = props.favicon;
    document.getElementsByTagName('head')[0].appendChild(link);

    // 延迟处理，不然不生效
    setTimeout(() => {
      document.title = props.title || '';
    });
  }, [props]);

  return <React.Fragment>{props.children}</React.Fragment>;
};

export default DocumentTitle;
