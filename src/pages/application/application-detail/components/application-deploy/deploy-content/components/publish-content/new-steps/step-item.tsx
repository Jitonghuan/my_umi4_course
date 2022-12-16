import React, { useState, useContext } from 'react';
import { retryDelFeature, downloadSource, newCancelDeploy, getMergeMessage, newRetry, getMessage, cancelDeploy } from '@/pages/application/service';
import { Steps, Button, Modal, message } from 'antd';
import { LoadingOutlined, ExclamationCircleOutlined, FileTextOutlined } from '@ant-design/icons';
import { fePublishVerify } from '@/pages/application/service';
import { conflictItem } from './type';
import MergeConflict from '../../merge-conflict';
import NoConflict from '../../merge-conflict/NoConflict';
import BatchDeployModal from './component/batch-deploy-modal';
import DetailContext from '@/pages/application/application-detail/context';
import ViewLogModal from './component/view-log-modal';

export default function StepItem(props: any) {
    // status为步骤条节点（wait/process/finish/eror)的状态 nodeStatus为节点的状态 item为这个节点对象
    const { title, status, nodeStatus, nodeCode, onOperate, deployInfo, pipelineCode, envTypeCode, env = '', onSpin = () => { }, stopSpin = () => { }, item, ...other } = props;
    const { metadata, branchInfo, envInfo, buildInfo } = props.deployInfo || {};
    const { appData } = useContext(DetailContext);
    const [mergeVisible, setMergeVisible] = useState(false); //冲突详情
    const [visible, setVisible] = useState(false); //无冲突
    const [mergeMessage, setMergeMessage] = useState<any>([]);
    const [supportEnv, setSupportEnv] = useState<string[]>(['']); //支持下载资源的环境
    const [disabled, setDisabled] = useState<boolean>(false);
    const [deployVisible, setDeployVisible] = useState(false);//确认部署弹窗
    const [viewLogVisible, setViewLogVisible] = useState(false);//查看日志弹窗
    const [retryLoading, setRetryLoading] = useState<boolean>(false);

    // 重试
    const handleRetry = async () => {
        try {
            setRetryLoading(true)
            // onOperate('deleteFeatureRetryStart');
            const params = { id: metadata?.id, taskCode: item?.code || '' };
            await newRetry({ ...params });
        } finally {
            setRetryLoading(false)
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
        getMessage({ instanceCode: item?.instanceCode || '', taskCode: item.code || '' })
            .then((res) => {
                if (!res?.success) {
                    return;
                }
                // 如果data为null 则显示无冲突弹窗
                if (!res?.data) {
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
    const toLogDetail = () => {
        console.log(item, 'item')
        const url = `/matrix/application/view-log?taskCode=${item?.code}&instanceCode=${item?.instanceCode}&appCode=${appData?.appCode}&appName=${appData?.appName}`;
        window.open(url, '_blank');
    }
    // 取消发布
    const onCancelDeploy = () => {
        Modal.confirm({
            title: '确定要取消当前发布吗？',
            icon: <ExclamationCircleOutlined />,
            onOk: async () => {
                return newCancelDeploy({ id: metadata?.id, taskCode: item?.code }).then(() => { }).finally(() => { onOperate('cancelEnd'); });
            },
        });
    }
    return <>
        {viewLogVisible && <ViewLogModal
            visible={viewLogVisible}
            onClose={() => { setViewLogVisible(false) }}
            taskCode={item?.code || ''}
            instanceCode={item?.instanceCode || ''}
            taskName={item?.name || ''}
        />
        }
        <MergeConflict
            visible={mergeVisible}
            handleCancel={handleCancelMerge}
            id={metadata?.id}
            mergeMessage={mergeMessage}
            releaseBranch={branchInfo?.releaseBranch}
            retryMergeClick={handleRetry}
            isNewPublish={true}
            code={item?.code || ''}
        ></MergeConflict>
        <BatchDeployModal
            visible={['WaitConfirm', 'Paused'].includes(nodeStatus) && deployVisible}
            deployInfo={deployInfo}
            openViewLogModal={() => { setViewLogVisible(true) }}
            onCancel={() => setDeployVisible(false)}
            onOperate={onOperate}
            envTypeCode={envTypeCode}
            env={item?.extra?.options?.envCode || ''}
            envs={deployInfo?.envInfo?.deployEnvs || []}
            nodeStatus={nodeStatus || ''}
            status={status || ''}
            deployingBatch={item?.extra?.options?.batch || ''}
            id={metadata?.id}
            taskCode={item?.code || ''}
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
                    <div className='operate-btn' style={{ width: 5 }}>
                        {status !== 'wait' && nodeCode !== 'start' && nodeCode !== 'end' && (
                            <a style={{}} onClick={() => { setViewLogVisible(true) }}>
                                <FileTextOutlined />
                                {/* 查看日志 */}
                            </a>
                        )}
                    </div>
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
                        status === 'error' && nodeStatus !== 'WaitInput' && <Button style={{ marginTop: 4 }} onClick={handleRetry} loading={retryLoading}>重试</Button>
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
                            下载
                        </Button>
                    )}
                    {['WaitConfirm', 'Paused'].includes(nodeStatus) && (
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
                    {nodeStatus === 'Running' && <Button danger size='small' onClick={onCancelDeploy}>取消</Button>}
                </>
            }
        />
    </>
}
