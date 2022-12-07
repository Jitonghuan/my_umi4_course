// 质量卡点结果
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/19 10:57

import React, { useState, useCallback, useContext } from 'react';
import { Popover, Spin, Tag } from 'antd';
import { getRequest } from '@/utils/request';
import DetailContext from '@/pages/application/application-detail/context';
import * as APIS from '@/pages/application/service';
import { DeployInfoVO } from '@/pages/application/application-detail/types';
import './index.less';

export interface QualityCheckResultProps {
    deployInfo: DeployInfoVO;
    visible?: boolean;
}

const getParents = (node: HTMLElement, selector: string): HTMLElement => {
    if (node === document.body) return node;
    if (node.matches(selector)) return node;
    return getParents(node.parentNode as HTMLElement, selector);
};

const resultMapping = {
    uc: {
        '0': '代码未配置pom',
        '1': '检测通过',
        '-1': '检测不通过',
    } as any,
    qc: {
        '0': 'sonar未配置',
        '1': '检测通过',
        '-1': '检测不通过',
    } as any,
};

const resultColor: any = {
    '0': 'default',
    '1': 'success',
    '-1': 'error',
};

export default function QualityCheckResult(props: QualityCheckResultProps) {
    const { visible, deployInfo } = props;
    const { metadata, branchInfo, envInfo, buildInfo } = deployInfo || {};
    const { appData } = useContext(DetailContext);
    const [loading, setLoading] = useState(false);
    const [detail, setDetail] = useState<any>();

    const handleVisibleChange = useCallback(
        async (nextVisible: boolean) => {
            if (!nextVisible) return;

            setLoading(true);
            try {
                const result = await getRequest(APIS.qualityGuardInfo, {
                    data: {
                        categoryCode: appData?.appCategoryCode,
                        appCode: appData?.appCode,
                        branchName: branchInfo.releaseBranch,
                    },
                });

                setDetail(result.data || {});
            } finally {
                setLoading(false);
            }
        },
        [deployInfo, appData],
    );

    if (!visible) return null;

    const result_uc = detail?.result_uc || {};
    const result_qc = detail?.result_qc || {};

    return (
        <Popover
            title="查看详情"
            trigger="click"
            overlayStyle={{ width: 320 }}
            overlayInnerStyle={{ width: 320 }}
            onVisibleChange={handleVisibleChange}
            content={
                <Spin spinning={loading}>
                    <div className="quality-check-result">
                        <p>
                            <span>单测覆盖检测：</span>
                            <div>
                                <Tag color={resultColor[result_uc.result] || 'red'}>
                                    {resultMapping.uc[result_uc.result] || '未知状态'}
                                </Tag>
                                {result_uc.report_url ? (
                                    <a href={result_uc.report_url} target="_blank">
                                        查看报告
                                    </a>
                                ) : null}
                            </div>
                        </p>
                        <p>
                            <span>代码质量检测：</span>
                            <div>
                                <Tag color={resultColor[result_qc.result] || 'red'}>
                                    {resultMapping.qc[result_qc.result] || '未知状态'}
                                </Tag>
                                {result_qc.report_url ? (
                                    <a href={result_qc.report_url} target="_blank">
                                        查看报告
                                    </a>
                                ) : null}
                            </div>
                        </p>
                    </div>
                </Spin>
            }
            getPopupContainer={() =>
                getParents(document.querySelector('#J_quality_check_detail_trigger')!, '.publish-content-compo')
            }
        >
            <a id="J_quality_check_detail_trigger">查看详情</a>
        </Popover>
    );
}
