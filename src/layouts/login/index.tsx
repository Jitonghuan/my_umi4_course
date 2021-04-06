import React, { useRef } from 'react';

import { BusinessLogin } from '@cffe/fe-backend-component';
import DocumentTitle from '../basic-layout/DocumentTitle';

declare const window: any;

/**
 * 登录页面
 * @description 登录页面
 * @create 2021-02-23 13:58
 */
const LoginPage = () => {
  const FeGlobalRef = useRef<globalConfig>(window.FE_GLOBAL);

  return (
    <DocumentTitle
      title={FeGlobalRef.current.title}
      favicon={FeGlobalRef.current.favicon}
    >
      <BusinessLogin
        logo={FeGlobalRef.current.logo}
        title={FeGlobalRef.current.title}
        copyright={FeGlobalRef.current.copyright}
      />
    </DocumentTitle>
  );
};

export default LoginPage;
