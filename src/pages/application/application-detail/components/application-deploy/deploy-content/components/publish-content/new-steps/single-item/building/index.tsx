// building steps
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/05 21:12

import React, { useState, useEffect, useContext } from 'react';
import { LoadingOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Steps, Button, Modal, message } from 'antd';
import { retryBuild, retry } from '@/pages/application/service';
import { StepItemProps } from '../../../types';
import BatchDeployModal from '../deploying/batch-deploy-modal';
import DetailContext from '@/pages/application/application-detail/context';
import { downloadSource, listAppEnv } from '@/pages/application/service';
import { getRequest } from '@/utils/request';
import appConfig from '@/app.config';
import ViewLogModal from '../../view-log-modal';
import OperateBtn from '../operate-btn';

/** 构建 */
export default function BuildingStep(props: StepItemProps) {
    const { deployInfo, onOperate, envTypeCode, env = '', status, getItemByKey, item, ...others } = props;
    const { appData } = useContext(DetailContext);
    const [supportEnv, setSupportEnv] = useState<any>([]);
    const { metadata, branchInfo, envInfo, buildInfo } = deployInfo || {};
    const { deployingBatch, confirm } = item || {};
    const [disabled, setDisabled] = useState<boolean>(false);
    const { buildUrl } = buildInfo || {};

    // const url = getItemByKey(buildUrl, env) ? getItemByKey(buildUrl, env) : '';
    const url = getItemByKey(buildUrl, 'singleBuild')
        ? getItemByKey(buildUrl, 'singleBuild')
        : getItemByKey(buildUrl, env)
            ? getItemByKey(buildUrl, env)
            : '';
    const isError = status === 'error';
    const isLoading = status === 'process';
    const isNotFrontend = appData?.appType !== 'frontend';
    const [deployVisible, setDeployVisible] = useState(false);
    useEffect(() => {
        if (status && status === 'finish') {
            setDeployVisible(false);
        }
    }, [status]);

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
                // clusterName: 'private-cluster',
                envModel: 'offline-pack',
            },
        }).then((result) => {
            let downloadImageEnv: any = [];
            if (result?.success) {
                result?.data?.map((item: any) => {
                    downloadImageEnv.push(item.envCode);
                });
                setSupportEnv(downloadImageEnv);
                // downLoadSupportEnv.current = downloadImageEnv;
            }
        });
    };

    const handleRebuildClick = () => {
        onOperate('retryDeployStart');

        Modal.confirm({
            title: '确定要重新构建吗?',
            icon: <ExclamationCircleOutlined />,
            onOk: async () => {
                const params = { id: metadata?.id };
                if (env) {
                    Object.assign(params, { envCode: env });
                }
                await retry({ ...params });
                onOperate('retryDeployEnd');
            },
            onCancel: () => {
                onOperate('retryDeployEnd');
            },
        });
    };

    return (
        <>
            <Steps.Step
                {...others}
                title={
                    <div className='flex'>
                        构建
                    {status !== 'wait' && <OperateBtn />}
                    </div>
                }
                status={status}
                icon={isLoading && <LoadingOutlined />}
                description={
                    // isLoading && (
                    <>

                        {/* 浙一日常环境下的部署步骤显示jenkins链接,构建步骤下不显示。其他环境都是构建步骤下显示Jenkins详情 */}
                        {/* {url && (
                            <div style={{ marginTop: -5 }}>
                                <a target="_blank" href={url}>
                                    构建详情
                </a>
                            </div>
                        )} */}
                        {confirm && confirm.waitConfirm && (
                            <div style={{ marginTop: -2 }}>
                                <a
                                    style={{ marginTop: 2 }}
                                    onClick={() => {
                                        setDeployVisible(true);
                                    }}
                                >
                                    确认部署
                </a>
                            </div>
                        )}
                        {isError && (
                            <Button style={{ paddingLeft: 4, paddingRight: 4 }} size="small" onClick={handleRebuildClick}>
                                重新构建
                            </Button>
                        )}
                        {status === 'finish' &&
                            supportEnv?.includes(env) &&
                            appConfig.PRIVATE_METHODS === 'public' &&
                            isNotFrontend && (
                                <Button
                                    download
                                    target="_blank"
                                    size="small"
                                    disabled={disabled}
                                    href={`${downloadSource}?id=${metadata?.id}&envCode=${env}`}
                                    // disabled={downLoadStatus}
                                    onClick={() => {
                                        setDisabled(true);
                                        setTimeout(() => {
                                            setDisabled(false);
                                        }, 10000);
                                        message.info('镜像开始下载');
                                    }}
                                >
                                    下载镜像
                                </Button>
                            )}

                        {/* {
                            status !== 'wait' && <OperateBtn />
                        } */}

                    </>
                    // )
                }
            />
            <BatchDeployModal
                visible={deployVisible}
                deployInfo={deployInfo}
                onCancel={() => setDeployVisible(false)}
                onOperate={onOperate}
                envTypeCode={envTypeCode}
                env={env}
                envs={deployInfo?.envInfo?.deployEnvs || []}
                status={status}
                deployingBatch={deployingBatch}
                id={metadata?.id}
                jenkinsUrl={url}
                showBuildUrl={true}
            />
        </>
    );
}
