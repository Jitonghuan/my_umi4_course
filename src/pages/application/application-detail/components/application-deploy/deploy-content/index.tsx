/**
 * DeployContent
 * @description 部署内容
 * @author moting.nq
 * @create 2021-04-15 10:04
 */

import React from 'react';
import PublishDetail from './components/publish-detail';
import PublishContent from './components/publish-content';
import PublishBranch from './components/publish-branch';
import { IProps } from './types';
import './index.less';

const rootCls = 'deploy-content-compo';

const DeployContent = (props: IProps) => {
  return (
    <div className={rootCls}>
      <PublishDetail />
      <PublishContent />
      <PublishBranch />
    </div>
  );
};

DeployContent.defaultProps = {};

export default DeployContent;
