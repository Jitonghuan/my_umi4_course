import React, { useState } from 'react';
import { retryDelFeature, downloadSource, retry, getMergeMessage } from '@/pages/application/service';
import { Steps, Button, Modal, message } from 'antd';
import { LoadingOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { fePublishVerify } from '@/pages/application/service';
import OperateBtn from './component/viewlog-btn';
import { conflictItem } from './type';
import MergeConflict from '../../merge-conflict';
import NoConflict from '../../merge-conflict/NoConflict';
import BatchDeployModal from './component/batch-deploy-modal';

export default function StepItem(props: any) {
    // status为步骤条的状态 nodeStatus为节点的状态 item为这个节点对象
    const { title, status, nodeStatus, nodeCode, onOperate, deployInfo, pipelineCode, envTypeCode, env = '', onSpin = () => { }, stopSpin = () => { }, item, ...other } = props;
    const { metadata, branchInfo, envInfo, buildInfo } = props.deployInfo || {};
    const [mergeVisible, setMergeVisible] = useState(false); //冲突详情
    const [visible, setVisible] = useState(false); //无冲突
    const [mergeMessage, setMergeMessage] = useState<any>([]);
    const [supportEnv, setSupportEnv] = useState<string[]>(['']); //支持下载资源的环境
    const [disabled, setDisabled] = useState<boolean>(false);
    const [deployVisible, setDeployVisible] = useState(false);//确认部署弹窗

    // 重试
    const handleRetry = async () => {
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
    // 灰度验证
    const handleVarifyClick = (result: string) => {
        onOperate('fePublishVerifyStart');

        Modal.confirm({
            title: '确定要提交此验证结果吗？',
            icon: <ExclamationCircleOutlined />,
            onOk: async () => {
                await fePublishVerify({
                    id: metadata?.id,
                    envCode: env,
                    result,
                });
                onOperate('fePublishVerifyEnd');
            },
            onCancel: () => {
                onOperate('fePublishVerifyEnd');
            },
        });
    };
    // 解决冲突
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
    return <>
        <MergeConflict
            visible={mergeVisible}
            handleCancel={handleCancelMerge}
            id={metadata?.id}
            mergeMessage={mergeMessage}
            releaseBranch={branchInfo?.releaseBranch}
            retryMergeClick={handleRetry}
        ></MergeConflict>
        <BatchDeployModal
            visible={deployVisible}
            deployInfo={deployInfo}
            onCancel={() => setDeployVisible(false)}
            onOperate={onOperate}
            envTypeCode={envTypeCode}
            env={env}
            envs={deployInfo?.envInfo?.deployEnvs || []}
            status={status}
            deployingBatch={nodeStatus}
            id={metadata?.id}
            // jenkinsUrl={jenkinsUrl}
            showBuildUrl={false}
        />
        <NoConflict visible={visible} handleCancel={handleCancel} retryMergeClick={handleRetry}></NoConflict>
        <Steps.Step
            {...props}
            icon={status === 'process' && <LoadingOutlined />}
            title={
                <div className='flex'>
                    {props.title}
                    {status !== 'wait' && <OperateBtn />}
                </div>
            }
            description={
                <>
                    {
                        nodeStatus === 'WaitApprove' && (
                            <div>
                                <Button
                                    type="primary"
                                    size="small"
                                    style={{ marginTop: 4 }}
                                    ghost
                                    onClick={() => handleVarifyClick('passed')}
                                >
                                    验证通过
            </Button>
                                <Button
                                    type="default"
                                    size="small"
                                    style={{ marginTop: 4 }}
                                    danger
                                    onClick={() => handleVarifyClick('failed')}
                                >
                                    验证失败
            </Button>
                            </div>
                        )
                    }
                    {
                        nodeStatus === 'Failed' && <Button style={{ marginTop: 4 }} onClick={handleRetry}>重试</Button>
                    }
                    {  nodeStatus === 'WaitInput' && (
                        <div style={{ marginTop: 2 }}>
                            <Button onClick={openMergeConflict} disabled={(props?.deployedList || []).length === 0}>
                                解决冲突
                      </Button>
                        </div>
                    )}
                    { nodeStatus === 'WaitDownload' && (
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
                    {['WaitConfirm', 'Batch1', 'Batch2', 'Pause'].includes(nodeStatus) && (
                        <div>
                            <a
                                style={{ marginTop: 2, marginLeft: -9 }}
                                onClick={() => {
                                    setDeployVisible(true);
                                }}
                            >
                                确认部署
                                </a>
                        </div>
                    )}
                </>
            }
        />
    </>
}
