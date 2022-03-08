// finished step
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/05 21:09

import React, { useState, useContext, useEffect, useRef } from 'react';
import { Steps, Button, message } from 'antd';
import { StepItemProps } from '../../types';
import DetailContext from '@/pages/application/application-detail/context';
import { downloadImage, listAppEnv } from '@/pages/application/service';
import { getRequest } from '@/utils/request';

/** 执行完成 */
export default function FinishedStep(props: StepItemProps) {
  const { deployInfo, deployStatus, onOperate, envTypeCode, ...others } = props;
  const { appData } = useContext(DetailContext);
  const downLoadSupportEnv = useRef<string[]>(['']);

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
      }
    });
  };

  return (
    <Steps.Step
      {...others}
      title="完成"
      description={
        (deployStatus === 'deployFinish' || deployStatus === 'deployed') &&
        downLoadSupportEnv.current?.filter((item) => deployInfo.envs?.indexOf(item) > -1).length > 0 && (
          <Button
            download
            style={{ marginTop: 4 }}
            target="_blank"
            href={`${downloadImage}?id=${deployInfo.id}`}
            // disabled={downLoadStatus}
            onClick={() => {
              message.info('镜像开始下载');
            }}
          >
            下载镜像
          </Button>
        )
        // (deployInfo.envs?.includes('zs-prd') ||
        //   deployInfo.envs?.includes('zs-pre') ||
        //   deployInfo.envs?.includes('xiehe') ||
        //   deployInfo.envs?.includes('fygs-prd')) && (
        //   <Button
        //     download
        //     style={{ marginTop: 4 }}
        //     target="_blank"
        //     href={`${downloadImage}?id=${deployInfo.id}`}
        //     // disabled={downLoadStatus}
        //     onClick={() => {
        //       message.info('镜像开始下载');
        //     }}
        //   >
        //     下载镜像
        //   </Button>
        // )
      }
    />
  );
}
