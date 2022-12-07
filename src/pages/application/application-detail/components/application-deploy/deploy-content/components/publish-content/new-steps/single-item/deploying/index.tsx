// deploying step
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/05 21:09

import React, { useState, useEffect } from 'react';
import { LoadingOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Steps, Button, Modal } from 'antd';
import { parse } from 'query-string';
import { retryDeploy, retry } from '@/pages/application/service';
import { StepItemProps } from '../../../types';
// import DeployModal from './deploy-modal';
import { history, useLocation } from 'umi';
import BatchDeployModal from './batch-deploy-modal';
import OperateBtn from '../operate-btn';

/** 部署 */
export default function DeployingStep(props: StepItemProps) {
    const {
        deployInfo,
        deployStatus,
        onOperate,
        envTypeCode,
        getItemByKey,
        env = '',
        status,
        item,
        waitConfirm,
        isFrontend = true,
        ...others
    } = props;
    const { metadata, branchInfo, envInfo, buildInfo } = deployInfo || {};
    const { deployingBatch, confirm } = item || {};
    // const { id, appCode } = history.location.query || {};
    let location = useLocation();
    const query = parse(location.search);
    const id = query?.id || "";
    const appCode = query.appCode;
    const { buildUrl } = buildInfo || {};
    const jenkinsUrl = getItemByKey(buildUrl, env) || '';
    const isLoading = status === 'process';
    const [deployVisible, setDeployVisible] = useState(false);

    useEffect(() => {
        if (status && status === 'finish') {
            setDeployVisible(false);
        }
    }, [status]);

    const handleShowErrorDetail = () => {
        Modal.info({
            content: deployInfo.deployErrInfo,
            title: '部署错误详情',
        });
    };

    const handleReDeployClick = () => {
        onOperate('retryDeployStart');

        Modal.confirm({
            title: '确定要重新部署吗?',
            icon: <ExclamationCircleOutlined />,
            onOk: async () => {
                const params = { id: metadata?.id };
                if (env) {
                    Object.assign(params, { envCode: env });
                }
                await retry({ ...params });
                onOperate('retryDeployEnd');
            },
            onCancel() {
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
                        部署
                    {status !== 'wait' && <OperateBtn />}
                    </div>
                }
                icon={isLoading && <LoadingOutlined />}
                status={status}
                description={
                    <>
                        {confirm && confirm.waitConfirm && (
                            <div>
                                <a
                                    style={{ marginTop: 2, marginLeft: -9 }}
                                    onClick={() => {
                                        setDeployVisible(true);
                                    }}
                                >
                                    {confirm?.label}
                                </a>
                            </div>
                        )}
                        {status === 'process' && env && !isFrontend && (
                            <div style={{ marginTop: 2 }}>
                                <Button
                                    size="small"
                                    type="link"
                                    style={{ marginLeft: '-22px' }}
                                    onClick={() => {
                                        localStorage.setItem('__init_env_tab__', envTypeCode);
                                        history.replace({
                                            pathname: `deployInfo`,
                                            search: `viewLogEnv=${env || ""}&viewLogEnvType=${envTypeCode}&id=${id}&appCode=${appCode}&type=viewLog_goBack`
                                            // query: {
                                            //   viewLogEnv: env || '',
                                            //   viewLogEnvType: envTypeCode,
                                            //   type: 'viewLog_goBack',
                                            //   id: `${id}`,
                                            //   appCode: appCode,
                                            // },
                                        });
                                    }}
                                >
                                    查看部署信息
                </Button>
                            </div>
                        )}

                        {/* test, pre, prod 显示 jenkins 详情 */}
                        {/* {envTypeCode !== 'dev' && deployInfo.jenkinsUrl && (
                <div style={{ marginTop: 2 }}>
                  <a target="_blank" href={deployInfo.}>
                    查看Jenkins详情
                  </a>
                </div>
              )} */}
                        {status === 'error' && (
                            <Button
                                style={{ marginLeft: '-22px', color: '#d48806' }}
                                size="small"
                                type="link"
                                onClick={handleReDeployClick}
                            >
                                重新部署
                            </Button>
                        )}
                        {/* prod 需要确认部署 */}
                        {/* {
                            status !== 'wait' && <OperateBtn />
                        } */}
                    </>
                }
            />

            {/* <DeployModal
        // visible={deployVisible}
        deployInfo={deployInfo}
        onCancel={() => setDeployVisible(false)}
        onOperate={onOperate}
        envTypeCode="prod"
      /> */}
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
                jenkinsUrl={jenkinsUrl}
                showBuildUrl={false}
            />
        </>
    );
}
