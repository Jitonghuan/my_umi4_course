// 前端版本
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/02 14:22

import React, { useState, useContext, useEffect, useCallback } from 'react';
import { Button, message, Modal, Card } from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import FeContext from '@/layouts/basic-layout/fe-context';
import DetailContext from '../../context';
import { getRequest, postRequest, putRequest } from '@/utils/request';
import { queryFeVersions } from '@/pages/application/service';
import { useAppEnvCodeData } from '@/pages/application/hooks';
import './index.less';

export default function FEVersions() {
  const { appData } = useContext(DetailContext);
  const [appEnvCodeData, isLoading] = useAppEnvCodeData(appData?.appCode);

  return <ContentCard className="page-fe-version"></ContentCard>;
}
