// 部署信息
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/18 09:45

import React, { useState, useEffect, useCallback, useContext, useMemo } from 'react';
import { Tabs, Button, Table, message, Popconfirm } from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import DetailContext from '../../context';
import { getRequest, postRequest } from '@/utils/request';
import * as APIS from './services';
import './index.less';

export default function AppDeployInfo() {
  const { appData } = useContext(DetailContext);
  // const envList = useMemo(() => {

  // }, [appData]);

  console.log('>>> appData', appData);

  return <ContentCard className="page-app-deploy-info"></ContentCard>;
}
