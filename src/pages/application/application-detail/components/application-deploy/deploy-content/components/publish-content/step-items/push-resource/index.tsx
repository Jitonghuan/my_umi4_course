// publish resource step
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/06 21:14

import React, { useRef, useContext, useEffect } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Steps, Button, message } from 'antd';
import { rePushFeResource } from '@/pages/application/service';
import { StepItemProps } from '../../types';
import DetailContext from '@/pages/application/application-detail/context';
import { downloadResource, listAppEnv } from '@/pages/application/service';
import { getRequest } from '@/utils/request';
import { deployStatusMapping } from '../../frontend-steps/prod';

/** 发布资源 */
export default function PushResourceStep(props: StepItemProps) {
  const { deployInfo, deployStatus, onOperate, envTypeCode, envCode, ...others } = props;
  const { appData } = useContext(DetailContext);
  const downLoadSupportEnv = useRef<string[]>(['']);
  const isLoading = deployStatus === 'pushFeResource';
  const isError = deployStatus === 'pushFeResourceErr';
  const isFrontend = appData?.appType === 'frontend';

  // 用于前端离线部署
  const canDownload = envTypeCode === 'prod' && isFrontend && Math.floor(deployStatusMapping[deployStatus]) >= 4;

  useEffect(() => {
    if (!appData?.appCode) return;
    queryDownloadImageEnv();
  }, []);
  const queryDownloadImageEnv = () => {
    getRequest(listAppEnv, {
      data: {
        envTypeCode: envTypeCode,
        appCode: appData?.appCode,
        proEnvType: 'benchmark',
        clusterName: 'private-cluster',
      },
    }).then((result) => {
      let downloadImageEnv: any = [];
      if (result?.success) {
        result?.data?.map((item: any) => {
          downloadImageEnv.push(item.envCode);
        });
        downLoadSupportEnv.current = downloadImageEnv;
        console.log('downLoadSupportEnv', downLoadSupportEnv.current);
      }
    });
  };
  const handleRetryClick = async () => {
    try {
      await rePushFeResource({ id: deployInfo.id, envCode });
    } finally {
      onOperate('rePushFeResourceEnd');
    }
  };

  return (
    <Steps.Step
      {...others}
      title="推送资源"
      icon={isLoading && <LoadingOutlined />}
      status={isError ? 'error' : others.status}
      description={
        <>
          {isError && (
            <Button type="primary" style={{ marginTop: 4 }} ghost onClick={handleRetryClick}>
              重试
            </Button>
          )}
          {downLoadSupportEnv.current?.includes(envCode) && canDownload && (
            <Button
              style={{ marginTop: 4 }}
              target="_blank"
              href={`${downloadResource}?deployId=${deployInfo.id}`}
              onClick={() => {
                message.info('资源开始下载');
              }}
            >
              下载资源
            </Button>
          )}
        </>
      }
    />
  );
}
