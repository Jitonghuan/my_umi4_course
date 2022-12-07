// merge release
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/05 21:09

import React, { useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Steps, Button, message, Spin } from 'antd';
import { retryMerge, getMergeMessage, retry } from '@/pages/application/service';
import { StepItemProps } from '../../../types';
import MergeConflict from '../../../../merge-conflict';
import NoConflict from '../../../../merge-conflict/NoConflict';
import { conflictItem } from '../../../../merge-conflict/types';
import OperateBtn from '../operate-btn';

/** 合并release */
export default function MergeReleaseStep(props: StepItemProps) {
    const {
        deployInfo,
        deployStatus,
        onOperate,
        envTypeCode,
        onSpin,
        stopSpin,
        deployedList,
        status,
        env = '',
        pipelineCode,
        ...others
    } = props;
    const { metadata, branchInfo, envInfo, buildInfo } = deployInfo || {};
    const [mergeVisible, setMergeVisible] = useState(false); //冲突详情
    const [visible, setVisible] = useState(false); //无冲突
    const [mergeMessage, setMergeMessage] = useState<any>([]);
    const isLoading = status === 'process';
    const isError = status === 'error';

    const retryMergeClick = async () => {
        try {
            const params = { id: metadata?.id };
            if (env) {
                Object.assign(params, { envCode: env });
            }
            await retry({ ...params });
        } finally {
            onOperate('mergeReleaseRetryEnd');
        }
    };

    const openMergeConflict = () => {
        onSpin();
        getMergeMessage({ releaseBranch: branchInfo?.releaseBranch, pipelineCode })
            .then((res) => {
                if (!res.success) {
                    return;
                }
                // 如果data为null 则显示无冲突弹窗
                if (!res.data) {
                    setVisible(true);
                    onOperate('mergeStart');
                    return;
                }
                const dataArray = res?.data.map((item: conflictItem, index: number) => ({
                    ...item,
                    id: index + 1,
                    resolved: false,
                }));
                setMergeMessage(dataArray);
                setMergeVisible(true);
                onOperate('mergeStart');
            })
            .finally(() => {
                stopSpin();
            });
    };
    const handleCancelMerge = () => {
        setMergeVisible(false);
        onOperate('mergeEnd');
    };
    const handleCancel = () => {
        setVisible(false);
        onOperate('mergeEnd');
    };

    return (
        <>
            <MergeConflict
                visible={mergeVisible}
                handleCancel={handleCancelMerge}
                id={metadata?.id}
                mergeMessage={mergeMessage}
                releaseBranch={branchInfo?.releaseBranch}
                retryMergeClick={retryMergeClick}
            ></MergeConflict>
            <NoConflict visible={visible} handleCancel={handleCancel} retryMergeClick={retryMergeClick}></NoConflict>
            <Steps.Step
                {...others}
                title={
                    <div className='flex'>
                        合并release
                    {status !== 'wait' && <OperateBtn />}
                    </div>
                }
                icon={isLoading && <LoadingOutlined />}
                status={status}
                description={
                    <>
                        {
                            isError && (
                                <>
                                    {branchInfo?.conflictFeature && (
                                        <div style={{ marginTop: 2 }}>
                                            <Button onClick={openMergeConflict} disabled={deployedList.length === 0}>
                                                解决冲突
                      </Button>
                                        </div>
                                    )}
                                    {!branchInfo?.conflictFeature && (
                                        <Button style={{ marginTop: 4 }} onClick={retryMergeClick}>
                                            重试
                                        </Button>
                                    )}
                                </>
                            )
                        }
                        {/* {status !== 'wait' && <OperateBtn />} */}
                    </>
                }
            />
        </>
    );
}
