import { useMemo, useState, useEffect } from 'react';
import { Steps, Empty, Button } from 'antd';
import StepItem from './step-item';
import { statusMap } from './type';
import { mockData, handleData } from './utils';
import './index.less'

// 判断多环境前面的线条以及环境名是否要变蓝
const changeColor = (data: any, env?: any) => {
    let flag = false;
    if (Array.isArray(env)) {
        for (let i of env) {
            const status = statusMap[data[i][0].status]
            if (data && data[i] && status !== 'wait') {
                return true;
            }
        }
    }
    if (!Array.isArray(env) && data[env]) {
        let res = data[env];
        return statusMap[res[0].status] !== 'wait';
    }
    return flag;
};

// 判断多环境结尾是否要变蓝----后一个节点状态不为wait时
const judgeColor = (data: any, index: number) => {
    let flag = false;
    let nodes = data[index + 1] || [];
    if (nodes.length && Array.isArray(nodes)) {
        let status = statusMap[nodes[0].status];
        if (status && status === 'finish') {
            return true;
        }
    }
    return flag;
};

//单个stepsComp
//连续的单环境是一个单独的stepsComp 遇到多环境 有几个环境就有几个stepComb
const StepsComp = (props: any) => {
    const { items, current, initial, ...other } = props;
    return <Steps initial={initial} className="publish-content-compo__steps">
        {items &&
            items.map((item: any) => (
                <StepItem title={item.name} status={statusMap[item.status]} nodeStatus={item.status} nodeCode={item.code} item={item} {...other} />
            ))}
    </Steps>
};

// 单环境
const SingelEnvSteps = (props: any) => {
    return (
        <div>
            <StepsComp {...props} />
        </div>
    );
};

// 多环境
const MultiEnvSteps = (props: any) => {
    const { initial, item, onCancelDeploy, index, data, envList, ...other } = props;
    let envCodeList = item ? Object.keys(item) : [];
    const findEnvName = (envCode: string) => {
        const envObj = envList.find((item: any) => item?.value === envCode)
        if (envObj && envObj?.label) {
            return envObj.label
        } else {
            return ''
        }
    }
    return (
        <div style={{ margin: '0 15px' }} className={`${judgeColor(data, index) ? 'suject-finish' : ''}`}>
            <div className={`sub_process-wrapper ${changeColor(item, envCodeList) ? 'sub_process-wrapper-active' : ''}`}>
                {envCodeList.map((envKey: any, i: number) => (
                    <div
                        key={envKey}
                        className={`sub_process sub_process-${i} ${changeColor(item, envKey) ? 'sub_process-active' : ''}`}
                    >
                        <span className="sub_process-title">{findEnvName(envKey)}</span>

                        <StepsComp {...other} initial={initial} env={envKey} items={item[envKey]} />
                    </div>
                ))}
            </div>
        </div>
    );
};
export default function NewDeploySteps(props: any) {
    const {
        stepData,
        deployInfo,
        onSpin,
        stopSpin,
        onCancelDeploy,
        envTypeCode,
        isFrontend,
        envList = [],
        ...other
    } = props;
    let { metadata, branchInfo, envInfo, buildInfo } = deployInfo;
    const [data, setData] = useState<any>([]);
    useEffect(() => {
        if (stepData) {
            const data = handleData(stepData);
            setData(data);
        }
        if (!stepData) {
            setData([]);
        }
        // const data = handleData(mockData);
        // setData(data)
    }, [stepData]);

    // 获取每个stepComp的initial值
    const getInitValue = (currentIndex: number) => {
        if (data.length === 0) {
            return;
        }
        let init = 0;
        for (let i = 0; i < currentIndex; i++) {
            let element = data[i];
            if (Array.isArray(element)) {
                init = init + element.length;
            } else {
                const envList = Object.keys(element);
                init = init + element[envList[0]].length;
            }
        }
        return init;
    };

    return (
        <div className="publish-content-compo-wrapper-new" style={{ display: 'flex' }}>
            {data.length !== 0 ? (
                data.map((item: any, index: number) =>
                    !Array.isArray(item) ? (
                        <MultiEnvSteps item={item} data={data} index={index} {...props} initial={getInitValue(index)} />
                    ) : (
                        <SingelEnvSteps items={item} {...props} initial={getInitValue(index)} />
                    ),
                )
            ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ width: '100%' }} />
            )}
        </div>
    );
}
