import { useMemo, useState, useEffect } from 'react';
import { Steps, Empty, Button } from 'antd';
import StepItem from './step-item';
// import './index.less'

// 判断多环境前面的线条以及环境名是否要变蓝
const changeColor = (data: any, env?: any) => {
    let flag = false;
    if (Array.isArray(env)) {
        for (let i of env) {
            if (data.nodes && data.nodes[i] && data.nodes[i][0].nodeStatus !== 'wait') {
                return true;
            }
        }
    }
    if (!Array.isArray(env) && data[env]) {
        let res = data[env];
        return res[0].nodeStatus !== 'wait';
    }
    return flag;
};

// 判断多环境的取消发布按钮是否要出现以及结尾是否要变蓝----前（后）一个节点状态不为wait时
const judgeColor = (data: any, index: number, type: string, notShowCancel?: any, showCancel?: any) => {
    let flag = false;
    let nodes = [];
    if (type === 'cancel') {
        nodes = data[index - 1];
    } else {
        nodes = data[index + 1] || [];
    }
    if (nodes && Array.isArray(nodes)) {
        let status = type === 'cancel' ? nodes[nodes.length - 1].nodeStatus : nodes[0].nodeStatus;
        if (status && status === 'finish') {
            if (notShowCancel) {
                notShowCancel();
            }
            return true;
        }
        if (showCancel) {
            showCancel();
        }
    }
    return flag;
};

//单个stepsComp
//连续的单环境是一个单独的stepsComp 遇到多环境节点 有几个环境就有几个stepComb
const StepsComp = ({ items, current, initial, ...other }: any) => (
    <Steps initial={initial} className="publish-content-compo__steps">
        {items &&
            items.map((item: any) => (
                <StepItem title={item.nodeName} status={item.nodeStatus} nodeCode={item.nodeCode} item={item} {...other} />
            ))}
    </Steps>
);

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
    const { initial, item, onCancelDeploy, index, data, notShowCancel, showCancel, envList, ...other } = props;

    let envCodeList = item.nodes ? Object.keys(item.nodes) : [];
    const findEnvName = (envCode: string) => {
        const envObj = envList.find((item: any) => item?.value === envCode)
        if (envObj && envObj?.label) {
            return envObj.label
        } else {
            return ''
        }
    }
    return (
        <div style={{ margin: '0 15px' }} className={`${judgeColor(data, index, 'finish') ? 'suject-finish' : ''}`}>
            <div className={`sub_process-wrapper ${changeColor(item, envCodeList) ? 'sub_process-wrapper-active' : ''}`}>
                {envCodeList.map((envKey: any, i: number) => (
                    <div
                        key={envKey}
                        className={`sub_process sub_process-${i} ${changeColor(item.nodes, envKey) ? 'sub_process-active' : ''}`}
                    >
                        <span className="sub_process-title">{findEnvName(envKey)}</span>

                        <StepsComp {...other} initial={initial} env={envKey} items={item.nodes[envKey]} />
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
        notShowCancel = () => { },
        showCancel = () => { },
        isFrontend,
        envList = [],
        ...other
    } = props;
    let { metadata, branchInfo, envInfo, buildInfo } = deployInfo;
    const [data, setData] = useState<any>([]);
    useEffect(() => {
        if (stepData && stepData.length !== 0) {
            const data = handleData(stepData);
            setData(data);
        }
        if (!stepData) {
            setData([]);
        }
    }, [stepData]);

    // 处理数据 将拿到的一维数组处理成二维数组 连续单个节点的合成一个二维数组 多环境的直接是对象
    // [{单},{单},{多},{多},{单},{单}]=>[[{单},{单}],{多},{多},[{单},{单}]]
    const handleData = (value: any) => {
        let res: any = [];
        for (var index = 0; index < value.length; index++) {
            const element = value[index];
            if (element.nodeType === 'single') {
                const curr = res[res.length - 1];
                if (curr && Array.isArray(curr)) {
                    curr.push(element);
                } else {
                    res.push([element]);
                }
            } else {
                res.push(element);
            }
        }
        return res;
    };

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
                const envList = Object.keys(element.nodes);
                init = init + element.nodes[envList[0]].length;
            }
        }
        return init;
    };

    return (
        <div className="publish-content-compo-wrapper" style={{ display: 'flex' }}>
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
