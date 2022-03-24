import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Steps } from 'antd';
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

// title和旧的步骤组件的映射关系 如果返回的title在这个对象中能找到 就用之前旧的组件 否则用默认的
const stepMap: any = {
  构建: BuildingStep,
  创建任务: CreateTaskStep,
  删除feature: DeleteFeatureStep,
  部署: DeployingStep,
  完成: FinishedStep,
  灰度验证: GrayValidationStep,
  合并master: MergeMasterStep,
  合并release: MergeReleaseStep,
  推送资源: PushResourceStep,
  推送版本: PushVersionStep,
  质量卡点: QualityCheckStep,
};

export default function StepItem(props: any) {
  const { title, status, ...other } = props;
  let Comp = (props: any) => <Steps.Step {...props} />;
  if (stepMap[title]) {
    Comp = stepMap[title];
  }
  return <Comp {...props} icon={status === 'process' && <LoadingOutlined />} />;
}
