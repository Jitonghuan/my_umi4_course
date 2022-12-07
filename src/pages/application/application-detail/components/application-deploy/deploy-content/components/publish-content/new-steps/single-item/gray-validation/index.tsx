// grey validate step
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/06 21:40
// TODO 灰度验证的时候，如果发布的是多个环境，需要确认验证是的哪一个环境，只有所有环境都验证通过，才能进入到下一步

import React from 'react';
import { LoadingOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Steps, Button, Modal } from 'antd';
import { fePublishVerify } from '@/pages/application/service';
import { StepItemProps } from '../../types';

/** 灰度验证 */
export default function GrayValidationStep(props: StepItemProps) {
    const { deployInfo, deployStatus, onOperate, envTypeCode, env = '', status, ...others } = props;
    const { metadata } = deployInfo || {};
    const isLoading = status === 'process';
    const isError = status === 'error';

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

    return (
        <Steps.Step
            {...others}
            title="灰度验证"
            icon={isLoading && <LoadingOutlined />}
            status={status}
            description={
                isLoading && (
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
        />
    );
}
