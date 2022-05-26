import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Steps, Button } from '@cffe/h2o-design';
import CreateTaskStep from '../step-items/create-task';
import MergeReleaseStep from '../step-items/merge-release';
import MergeMasterStep from '../step-items/merge-master';
import BuildingStep from '../step-items/building';
import PushResourceStep from '../step-items/push-resource';
import GrayValidationStep from '../step-items/gray-validation';
import PushVersionStep from '../step-items/push-version';
import DeleteFeatureStep from '../step-items/delete-feature';
import FinishedStep from '../step-items/finished';
import DeployingStep from '../step-items/deploying';
import QualityCheckStep from '../step-items/quality-check';

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
};

export default function StepItem(props: any) {
  const { title, status, nodeCode, ...other } = props;
  let Comp = (props: any) => <Steps.Step {...props} />;
  if (stepMap[nodeCode]) {
    Comp = stepMap[nodeCode];
  }
  return <Comp {...props} icon={status === 'process' && <LoadingOutlined />} />;
}
