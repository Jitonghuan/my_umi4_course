/**
 * PublishContent
 * @description 发布内容
 * @author moting.nq
 * @create 2021-04-15 10:22
 */

import React, { useState,useEffect } from 'react';
import { Modal, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import HulkTable from '@cffe/vc-hulk-table';
import ProdSteps from './prod-steps';
import OtherEnvSteps from './other-env-steps';
import { createTableSchema } from './schema';
import { cancelDeploy, reCommit, withdrawFeatures ,newReCommit,newWithdrawFeatures} from '@/pages/application/service';
import { IProps } from './types';
import DeploySteps from '@/pages/application/application-detail/components/application-deploy/deploy-content/components/publish-content/steps';
import './index.less';
import NewDeploySteps from '@/pages/application/application-detail/components/application-deploy/deploy-content/components/publish-content/new-steps';
import PipeLineManage from '../../../../application-deploy/pipelineManage';

const rootCls = 'publish-content-compo';
const { confirm } = Modal;

const PublishContent = ({
  appCode,
  envTypeCode,
  deployedList,
  deployInfo,
  pipelineCode,
  onSpin,
  stopSpin,
  onOperate,
  newPublish,
  appData
}: IProps) => {
  const isProd = envTypeCode === 'cProd';
  let { metadata, status, envInfo } = deployInfo || {};
  const { deployNodes } = status || {};
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [stepData, setStepData] = useState<any>([]);

  useEffect(() => {
    if (newPublish) {
      setStepData(deployInfo?.pipelineInfo?.tasks || [])
    } else {
      setStepData(deployInfo?.status?.deployNodes || [])
    }
  }, [newPublish, deployInfo])

  function getItemByKey(obj: any, envCode: string) {
    try {
      if (obj) {
        const keyList = Object.keys(obj) || [];
        if (keyList.length !== 0 && envCode) {
          return obj[envCode];
        } else {
          return '';
        }
      }
    } catch {
      return '';
    }
  }

  function onCancelDeploy(envCode?: string) {
    Modal.confirm({
      title: '确定要取消当前发布吗？',
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        return cancelDeploy({
          id: metadata?.id,
          envCode: envTypeCode,
        }).then(() => {});
      },
    });
  }

  return (
    <div className={rootCls}>
      <div className={`${rootCls}__title`}>发布内容</div>
      <div className={`${rootCls}__right-top-btns`}>
        {deployNodes?.length !== 0 &&!newPublish && stepData?.length !== 0 && (
          <Button
            danger
            onClick={() => {
              onCancelDeploy();
            }}
          >
            取消发布
          </Button>
        )}
      </div>
      {newPublish ?
        <NewDeploySteps
          stepData={stepData}
          deployInfo={deployInfo}
          onOperate={onOperate}
          isFrontend={appData?.appType==="backend"?false:true}
          envTypeCode={envTypeCode}
          appData={appData}
          onCancelDeploy={onCancelDeploy}
          stopSpin={stopSpin}
          onSpin={onSpin}
          deployedList={deployedList}
          getItemByKey={getItemByKey}
          pipelineCode={pipelineCode}
          // envList={envList}
        /> :
      <DeploySteps
        stepData={deployNodes}
        deployInfo={deployInfo}
        pipelineCode={pipelineCode}
        appCode={appCode}
        onSpin={onSpin}
        stopSpin={stopSpin}
        onOperate={onOperate}
        isFrontend={appData?.appType==="backend"?false:true}
        envTypeCode={envTypeCode}
        deployedList={deployedList}
        getItemByKey={getItemByKey}
        isSecondPage={true}
      />}

      <div className={`${rootCls}__list-wrap`}>
        <div className={`${rootCls}__list-header`}>
          <span className={`${rootCls}__list-header-text`}>内容列表</span>
          <div className={`${rootCls}__list-header-btns`}>
            {!isProd && (
              <Button
                type="primary"
                disabled={!selectedRowKeys.length}
                onClick={() => {
                  onOperate('retryDeployStart');

                  confirm({
                    title: '确定要重新提交吗?',
                    icon: <ExclamationCircleOutlined />,
                    onOk() {
                      const recommit: any = newPublish ? newReCommit : reCommit;
                      const filter = deployedList
                        .filter((el) => selectedRowKeys.includes(el.id))
                        .map((el) => el.branchName);
                      return recommit({
                        id: metadata.id,
                        features: filter,
                      }).then(() => {
                        onOperate('retryDeployEnd');
                      });
                    },
                    onCancel() {
                      onOperate('retryDeployEnd');
                    },
                  });
                }}
              >
                重新提交
              </Button>
            )}
            <Button
              type="primary"
              disabled={!selectedRowKeys.length}
              onClick={() => {
                onOperate('batchExitStart');

                confirm({
                  title: '确定要批量退出吗?',
                  icon: <ExclamationCircleOutlined />,
                  onOk() {
                    const withdraw: any = newPublish ? newWithdrawFeatures : withdrawFeatures;
                    return withdraw({
                      // appCode,
                      // envTypeCode,
                      features: deployedList
                        .filter((item) => selectedRowKeys.includes(item.id))
                        .map((item) => item.branchName),
                      // isClient: true,
                      id: metadata?.id,
                    }).then((res:any) => {
                      if(res?.code===1001){
                        Modal.error({
                          title: '退出分支出错！',
                          content: res?.errorMsg,
                        });
                      }
                      onOperate('batchExitEnd');
                    });
                  },
                  onCancel() {
                    onOperate('batchExitEnd');
                  },
                });
              }}
            >
              退出分支
            </Button>
          </div>
        </div>

        <HulkTable
          rowKey="id"
          className={`${rootCls}__list-table`}
          dataSource={deployedList}
          pagination={false}
          bordered
          scroll={{ x: '100%' }}
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys,
            onChange: (selectedRowKeys: React.Key[]) => {
              setSelectedRowKeys(selectedRowKeys as any);
            },
          }}
          columns={createTableSchema() as any}
        />
      </div>
    </div>
  );
};

PublishContent.defaultProps = {};

export default PublishContent;
