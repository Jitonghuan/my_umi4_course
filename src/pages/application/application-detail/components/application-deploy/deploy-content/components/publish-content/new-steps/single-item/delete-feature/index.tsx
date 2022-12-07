// delete feature step
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/05 21:09

import React, { useEffect, useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Steps, Button } from 'antd';
import { retryDelFeature, venusAnalyze, retry } from '@/pages/application/service';
import { StepItemProps } from '../../../types';
import OperateBtn from '../operate-btn';

/** 删除feature */
export default function DeleteFeatureStep(props: StepItemProps) {
    const {
        deployInfo,
        deployStatus,
        onOperate,
        envTypeCode,
        env = '',
        isFrontend,
        appData,
        steps,
        status,
        ...others
    } = props;
    const { metadata, branchInfo, envInfo, buildInfo } = deployInfo || {};
    const [venusLoading, setVenusLoading] = useState<boolean>(false);
    const isError = status === 'error';
    const isLoading = status === 'process';

    const handleRetryDelClick = async () => {
        try {
            const params = { id: metadata?.id };
            if (env) {
                Object.assign(params, { envCode: env });
            }
            await retry({ ...params });
        } finally {
            onOperate('deleteFeatureRetryEnd');
        }
    };

    async function analyze() {
        setVenusLoading(true);
        await venusAnalyze({
            appCode: appData.appCode,
            gitUrl: appData.gitAddress,
        });
        setVenusLoading(false);
    }

    // useEffect(() => {
    //   if (steps && steps >= 7 && isFrontend && !venusLoading) {
    //     void analyze();
    //   }
    // }, [deployStatus]);
    useEffect(() => {
        if (status === 'finish' && isFrontend && !venusLoading) {
            void analyze();
        }
    }, [status]);

    return (
        <Steps.Step
            {...others}
            title={
                <div className='flex'>
                    删除feature
                {status !== 'wait' && <OperateBtn />}
                </div>
            }
            status={status}
            icon={isLoading && <LoadingOutlined />}
            description={
                <>
                    {isError &&
                        <Button style={{ marginTop: 4 }} onClick={handleRetryDelClick}>
                            重试
                        </Button>
                    }
                    {/* {
                        status !== 'wait' && <OperateBtn />
                    } */}
                </>
            }
        />
    );
}
