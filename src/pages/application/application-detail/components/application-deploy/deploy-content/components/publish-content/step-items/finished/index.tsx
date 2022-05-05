// finished step
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/05 21:09

import React, { useState, useContext, useEffect, useRef } from 'react';
import { Steps, Button, message } from 'antd';
import { StepItemProps } from '../../types';
import DetailContext from '@/pages/application/application-detail/context';
import { downloadSource, listAppEnv } from '@/pages/application/service';
import { getRequest } from '@/utils/request';
import appConfig from '@/app.config';

/** 执行完成 */
export default function FinishedStep(props: StepItemProps) {
  const { deployInfo, deployStatus, onOperate, envTypeCode, status, env = '', ...others } = props;
  const { metadata, branchInfo, envInfo, buildInfo } = deployInfo || {};
  const { appData } = useContext(DetailContext);
  const downLoadSupportEnv = useRef<string[]>(['']);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [supportEnv, setSupportEnv] = useState<any>([]);

  const isNotFrontend = appData?.appType !== 'frontend';

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
        console.log(downloadImageEnv, '11');
        setSupportEnv(downloadImageEnv);
        // downLoadSupportEnv.current = downloadImageEnv;
      }
    });
  };

  return (
    <Steps.Step
      {...others}
      title="完成"
      status={status}
      description={
        status === 'finish' &&
        supportEnv?.includes(env) &&
        appConfig.PRIVATE_METHODS === 'public' &&
        isNotFrontend && (
          <Button
            download
            style={{ marginTop: 4 }}
            target="_blank"
            disabled={disabled}
            href={`${downloadSource}?id=${metadata.id}&envCode=${env}`}
            // disabled={downLoadStatus}
            onClick={() => {
              setDisabled(true);
              setTimeout(() => {
                setDisabled(false);
              }, 5000);
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
