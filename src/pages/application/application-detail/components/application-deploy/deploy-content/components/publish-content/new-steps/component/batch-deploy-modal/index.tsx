/**
 * DeployModal
 * @description 部署-弹窗
 * @author moting.nq
 * @create 2021-04-24 11:46
 */

import React, { useMemo, useState, useEffect, useContext } from 'react';
import { Modal, Radio, Spin, message, Select, Tag } from 'antd';
import { LoadingOutlined, FileTextOutlined } from '@ant-design/icons';
import DetailContext from '@/pages/application/application-detail/context';
import { newConfirmDeploy, queryEnvsReq, applyHaveNoUpPlanList } from '@/pages/application/service';
// import { IProps } from './types';
import { getRequest, postRequest } from '@/utils/request';

export default function BatchDeployModal({
    envTypeCode,
    env,
    envs,
    nodeStatus,
    status,
    visible,
    deployInfo,
    onCancel,
    onOperate,
    deployingBatch,
    id,
    taskCode,
    openViewLogModal,
    jenkinsUrl,
    showBuildUrl = false,
}: any) {
    const { appData } = useContext(DetailContext);
    const { appCategoryCode, appCode } = appData || {};
    const [envDataList, setEnvDataList] = useState<any>([]);
    const [deployBatch, setDeployBatch] = useState(1);
    const [deployApplyOptions, setDeployApplyOptions] = useState<any>();
    const [currentAppIds, setCurrentAppIds] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);
    // 是否在等待用户点击继续部署第二批
    const isPaused = nodeStatus && nodeStatus === 'Paused';

    useEffect(() => {
        if (!appCategoryCode) return;
        // 获取该应用的所有环境列表
        queryEnvsReq({
            envTypeCode,
            appCode: appData?.appCode,
        }).then((data) => {
            let envSelect = [];
            data?.list?.map((item: any) => {
                envSelect.push({ label: item.envName, value: item.envCode });
            });
            setEnvDataList(data.list);
        });
    }, [appCategoryCode, envTypeCode]);

    useEffect(() => {
        if (!visible) return;
        if (env) {
            deployApply(env);
        }
    }, [visible]);

    useEffect(() => {
        let batch = localStorage.DEPLOYBATCH ? localStorage.DEPLOYBATCH : 1;
        let applyIdsData;
        if (localStorage.APPLY_IDS) {
            applyIdsData = JSON.parse(localStorage.APPLY_IDS);
        } else {
            applyIdsData = [];
        }
        setDeployBatch(parseInt(batch));
        setCurrentAppIds(applyIdsData);
    }, []);

    // 发布申请数据
    const deployApply = async (env: any) => {
        await getRequest(applyHaveNoUpPlanList, { data: { appCode, envCode: env } }).then((res) => {
            if (res?.success) {
                let dataArry: any = [];
                let dataSource = res.data || [];
                dataSource?.map((item: any) => {
                    dataArry.push({ label: item?.ApplyTitle, value: item?.ApplyId });
                });
                setDeployApplyOptions(dataArry);
                if (res.data === null) {
                    setDeployApplyOptions(null);
                }
            }
        });
    };

    // 获取当前环境名
    const envName = useMemo(() => {
        let namesArr = '';
        if (env) {
            envDataList?.forEach((item: any) => {
                if (item?.envCode === env) {
                    namesArr = item.envName || '';
                }
            });
        }
        return namesArr;
    }, [envDataList, deployInfo]);

    const detail = useMemo(() => {
        let text1 = null;
        let text2 = null;
        if (status === 'finish') {
            localStorage.removeItem('DEPLOYBATCH');
            localStorage.removeItem('APPLY_IDS');
        }
        if (isPaused) {
            text2 = <span>第一批已部署完成，点击继续按钮发布第二批</span>;
        } else if (deployingBatch && deployingBatch === 1) {
            text2 = <span>第一批正在部署中,请等待.....</span>;
        } else if (deployingBatch && deployingBatch === 2) {
            text2 = <span>第二批正在部署中,请等待.....</span>;
        }
        return (
            <>
                <div>
                    <Spin spinning />
                    {text1}
                    {text2}
                    <a style={{ marginLeft: 10 }} onClick={openViewLogModal}>
                        <FileTextOutlined />
                        {/* 查看日志 */}
                    </a>
                </div>
            </>
        );
    }, [deployInfo, deployingBatch]);

    const changeDeployApply = (value: any) => {
        // let appIds = value;
        setCurrentAppIds(value);
        localStorage.APPLY_IDS = JSON.stringify(value || []);
    };

    const handleOk = () => {
        setLoading(true);
        const currentDeployBatch = isPaused ? 2 : deployBatch;
        newConfirmDeploy({ batch: currentDeployBatch, applyIds: currentAppIds, taskCode, envCode: env, id })
            .then((res) => {
                if (res && res.success) {
                    setLoading(false);
                    onOperate('deployEnd');
                    if (currentDeployBatch === 0) {
                        onCancel();
                    }
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <Modal
            title="分批部署"
            visible={visible}
            confirmLoading={([1, 2].includes(deployingBatch) && !isPaused) || loading}
            okText={isPaused ? '继续' : '确认'}
            onOk={handleOk}
            onCancel={onCancel}
        >
            <div>
                <span>
                    发布环境：<Tag color="blue">{envName}</Tag>
                </span>
            </div>
            <div style={{ marginTop: 8 }}>
                <span>发布批次：</span>
                <Radio.Group
                    disabled={[1, 2].includes(deployingBatch) || isPaused}
                    value={deployBatch}
                    onChange={(v) => {
                        setDeployBatch(v.target.value);
                        localStorage.DEPLOYBATCH = v.target.value;
                    }}
                    options={[
                        { label: '分批', value: 1 },
                        { label: '不分批', value: 0 },
                    ]}
                />
            </div>
            {deployApplyOptions !== undefined && deployApplyOptions !== null && (
                <div style={{ marginTop: 8 }}>
                    <span>发布申请：</span>
                    <Select
                        disabled={false}
                        style={{ width: 220 }}
                        mode="multiple"
                        options={deployApplyOptions}
                        onChange={changeDeployApply}
                        value={currentAppIds}
                    ></Select>
                </div>
            )}

            <h3 style={{ marginTop: 20 }}>发布详情</h3>
            {([1, 2].includes(deployingBatch) || isPaused) ? detail : ''}
        </Modal>
    );
}
