// publish html step
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/06 21:14

import React, { useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Steps, Button } from 'antd';
import { rePushFeVersion, retry } from '@/pages/application/service';
import { StepItemProps } from '../../../types';
import appConfig from "@/app.config";
import OperateBtn from '../operate-btn';

/** 发布HTML */
export default function PushVersionStep(props: StepItemProps) {
    const { deployInfo, deployStatus, onOperate, envTypeCode, env = '', status, appData, ...others } = props;
    const { metadata, branchInfo, envInfo, buildInfo } = deployInfo || {};
    // const isLoading = deployStatus === 'pushVersion';
    // const isWait = deployStatus === 'deployWait' || deployStatus == 'verifySuccess';
    // const isError = deployStatus === 'pushVersionErr';
    const isLoading = status === 'process';
    const isWait = status === 'wait';
    const isError = status === 'error';

    const handleRetryClick = async () => {
        try {
            const params = { id: metadata?.id };
            if (env) {
                Object.assign(params, { envCode: env });
            }
            await retry({ ...params });
        } finally {
            onOperate('rePushFeVersionEnd');
        }
    };

    return (
        <Steps.Step
            {...others}
            title={
                <div className='flex'>
                    推送版本
                {status !== 'wait' && <OperateBtn />}
                </div>
            }
            icon={isLoading && <LoadingOutlined />}
            status={status}
            description={
                <>
                    {isWait && <span>等待推送</span>}
                    {isError && (
                        <Button type="primary" style={{ marginTop: 4 }} ghost onClick={handleRetryClick}>
                            重试
                        </Button>
                    )}
                    {
                        appData?.feType === 'pda' && metadata?.pdaDeployType === 'bundles' && status === 'finish' && appConfig.IS_Matrix === 'public' ? (
                            <a style={{ marginLeft: '-9px' }} target="_blank" href="http://code-push.cfuture.shop/versions">
                                CodePush版本管理
                            </a>
                        ) : ''
                    }
                </>
            }
        />
    );
}
