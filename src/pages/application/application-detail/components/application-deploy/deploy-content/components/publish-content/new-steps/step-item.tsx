import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Steps, Button } from 'antd';
import CreateTaskStep from './single-item/create-task';
import MergeReleaseStep from './single-item/merge-release';
import MergeMasterStep from './single-item/merge-master';
import BuildingStep from './single-item/building';
import PushResourceStep from './single-item/push-resource';
import GrayValidationStep from './single-item/gray-validation';
import PushVersionStep from './single-item/push-version';
import DeleteFeatureStep from './single-item/delete-feature';
import FinishedStep from './single-item/finished';
import DeployingStep from './single-item/deploying';
import QualityCheckStep from './single-item/quality-check';
import DependencyCheckStep from './single-item/dependency-check';

// nodeCode和旧的步骤组件的映射关系 如果返回的title在这个对象中能找到 就用之前旧的组件 否则用默认的
const stepMap: any = {
    build: BuildingStep,
    deleteFeature: DeleteFeatureStep,
    deploy: DeployingStep,
    // end: FinishedStep,
    verify: GrayValidationStep,
    mergeMaster: MergeMasterStep,
    merge: MergeReleaseStep,
    pushResource: PushResourceStep,
    pushVersion: PushVersionStep,
    qualityCheck: QualityCheckStep,
    dependencyCheck: DependencyCheckStep,
};

export default function StepItem(props: any) {
    const { title, status, nodeCode, ...other } = props;
    let Comp = (props: any) => <Steps.Step {...props} />;
    if (stepMap[nodeCode]) {
        Comp = stepMap[nodeCode];
    }
    return <Comp {...props} icon={status === 'process' && <LoadingOutlined />} />;
}
