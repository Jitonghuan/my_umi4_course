import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Steps } from 'antd';
import MergeReleaseStep from '../step-items/merge-release';
import MergeMasterStep from '../step-items/merge-master';
import BuildingStep from '../step-items/building';
import DeleteFeatureStep from '../step-items/delete-feature';

const stepMap: any = {
  build: BuildingStep,
  deleteFeature: DeleteFeatureStep,
  mergeMaster: MergeMasterStep,
  merge: MergeReleaseStep,
};

export default function StepItem(props: any) {
  const { title, status, nodeCode, ...other } = props;
  let Comp = (props: any) => <Steps.Step {...props} />;
  if (stepMap[nodeCode]) {
    Comp = stepMap[nodeCode];
  }
  return <Comp {...props} icon={status === 'process' && <LoadingOutlined />} />;
}
