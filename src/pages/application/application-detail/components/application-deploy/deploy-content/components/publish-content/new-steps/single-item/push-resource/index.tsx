// publish resource step
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/06 21:14

import React, { useRef, useContext, useEffect, useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Steps, Button, message } from 'antd';
import { rePushFeResource, retry } from '@/pages/application/service';
import { StepItemProps } from '../../../types';
import DetailContext from '@/pages/application/application-detail/context';
import { downloadSource, listAppEnv } from '@/pages/application/service';
import { getRequest } from '@/utils/request';
import { deployStatusMapping } from '../../../frontend-steps/prod';
import appConfig from '@/app.config';
import OperateBtn from '../operate-btn';

/** 发布资源 */
export default function PushResourceStep(props: StepItemProps) {
    const { deployInfo, deployStatus, onOperate, envTypeCode, env = '', status, ...others } = props;

    const { metadata, branchInfo, envInfo, buildInfo } = deployInfo || {};
    const { appData } = useContext(DetailContext);
    const [supportEnv, setSupportEnv] = useState<string[]>(['']); //支持离线部署的环境
    const [disabled, setDisabled] = useState<boolean>(false);
    const isLoading = status === 'process';
    const isError = status === 'error';
    const isFrontend = appData?.appType === 'frontend';

    // 用于前端离线部署
    const canDownload = isFrontend && status === 'finish';

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
                envModel: 'offline-pack',
                // clusterName: 'private-cluster',
            },
        }).then((result) => {
            let downloadImageEnv: any = [];
            if (result?.success) {
                result?.data?.map((item: any) => {
                    downloadImageEnv.push(item.envCode);
                });
                setSupportEnv(downloadImageEnv);
            }
        })
    };
    const handleRetryClick = async () => {
        try {
            const params = { id: metadata?.id };
            if (env) {
                Object.assign(params, { envCode: env });
            }
            await retry({ ...params });
        } finally {
            onOperate('rePushFeResourceEnd');
        }
    };

    return (
        <Steps.Step
            {...others}
            title={
                <div className='flex'>
                    推送资源
                {status !== 'wait' && <OperateBtn />}
                </div>
            }
            icon={isLoading && <LoadingOutlined />}
            status={status}
            description={
                <>
                    {isError && (
                        <Button type="primary" style={{ marginTop: 4 }} ghost onClick={handleRetryClick}>
                            重试
                        </Button>
                    )}
                    {appConfig.PRIVATE_METHODS === 'public' && supportEnv.includes(env) && canDownload && (
                        <Button
                            style={{ marginTop: 4 }}
                            target="_blank"
                            disabled={disabled}
                            href={`${downloadSource}?id=${metadata?.id}&envCode=${env}`}
                            onClick={() => {
                                setDisabled(true);
                                setTimeout(() => {
                                    setDisabled(false);
                                }, 5000);
                                message.info('资源开始下载');
                            }}
                        >
                            下载资源
                        </Button>
                    )}
                    {/* {status !== 'wait' && <OperateBtn />} */}
                </>
            }
        />
    );
}
