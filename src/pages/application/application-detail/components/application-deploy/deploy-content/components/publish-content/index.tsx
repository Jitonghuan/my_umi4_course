// 发布内容
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/05 22:57

import React, { useState, useContext } from 'react';
import { Modal, Button, Table, Tag, Tooltip } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import DetailContext from '@/pages/application/application-detail/context';
import { Fullscreen } from '@cffe/internal-icon';
import { datetimeCellRender } from '@/utils';
import { cancelDeploy, createDeploy, updateFeatures } from '@/pages/application/service';
import { IProps } from './types';
import BackendDevEnvSteps from './backend-steps/dev';
import BackendTestEnvSteps from './backend-steps/test';
import BackendPreEnvSteps from './backend-steps/pre';
import BackendProdEnvSteps from './backend-steps/prod';
import FrontendDevEnvSteps from './frontend-steps/dev';
import FrontendTestEnvSteps from './frontend-steps/test';
import FrontendPreEnvSteps from './frontend-steps/pre';
import FrontendProdEnvSteps from './frontend-steps/prod';
import DeploySteps from './steps';
import './index.less';

const rootCls = 'publish-content-compo';

const backendStepsMapping: Record<string, typeof BackendDevEnvSteps> = {
  dev: BackendDevEnvSteps,
  test: BackendTestEnvSteps,
  pre: BackendPreEnvSteps,
  prod: BackendProdEnvSteps,
};
const frontendStepsMapping: Record<string, typeof FrontendDevEnvSteps> = {
  dev: FrontendDevEnvSteps,
  test: FrontendTestEnvSteps,
  pre: FrontendPreEnvSteps,
  prod: FrontendProdEnvSteps,
};

export default function PublishContent(props: IProps) {
  const { appCode, envTypeCode, deployedList, deployInfo, onOperate, onSpin, stopSpin, pipelineCode } = props;
  let { metadata, status, envInfo } = deployInfo;
  const { deployNodes } = status || {}; //步骤条数据
  const { deployEnvs } = envInfo || [];
  const { appData } = useContext(DetailContext);
  const { id } = appData || {};
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const isProd = envTypeCode === 'prod';
  const [fullScreeVisible, setFullScreeVisible] = useState(false);

  type reviewStatusTypeItem = {
    color: string;
    text: string;
  };

  const STATUS_TYPE: Record<number, reviewStatusTypeItem> = {
    1: { text: '未创建', color: 'default' },
    2: { text: '审核中', color: 'blue' },
    3: { text: '已关闭', color: 'orange' },
    4: { text: '未通过', color: 'red' },
    5: { text: '已删除', color: 'gray' },
    6: { text: '已通过', color: 'green' },
  };

  // 重新部署
  const handleReDeploy = () => {
    onOperate('retryDeployStart');

    Modal.confirm({
      title: '确定要重新部署吗?',
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        const features = deployedList.filter((el) => selectedRowKeys.includes(el.id)).map((el) => el.branchName);

        return updateFeatures({
          id: metadata.id,
          features,
        }).then(() => {
          onOperate('retryDeployEnd');
        });
      },
      onCancel() {
        onOperate('retryDeployEnd');
      },
    });
  };

  // 批量退出
  const handleBatchExit = () => {
    onOperate('batchExitStart');

    Modal.confirm({
      title: '确定要批量退出吗?',
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        const features = deployedList
          .filter((item) => !selectedRowKeys.includes(item.id))
          .map((item) => item.branchName);

        return createDeploy({
          appCode,
          envTypeCode,
          features,
          isClient: false,
        }).then(() => {
          onOperate('batchExitEnd');
        });
      },
      onCancel() {
        onOperate('batchExitEnd');
      },
    });
  };

  const isFrontend = appData?.appType === 'frontend';
  const CurrSteps = isFrontend ? frontendStepsMapping[envTypeCode] : backendStepsMapping[envTypeCode];

  const branchNameRender = (branchName: string, record: any) => {
    return (
      <div>
        <Link to={'/matrix/application/detail/branch?' + 'appCode=' + appCode + '&' + 'id=' + id}>{branchName}</Link>
      </div>
    );
  };

  function onCancelDeploy(envCode?: string) {
    Modal.confirm({
      title: '确定要取消当前发布吗？',
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        return cancelDeploy({
          id: metadata?.id,
          envCode,
        }).then(() => {});
      },
    });
  }

  function getItemByKey(listStr: string, envCode: string) {
    try {
      const list = listStr ? JSON.parse(listStr) : [];
      const item = list.find((val: any) => val.envCode === envCode);
      return item || {};
    } catch (e) {
      return listStr
        ? {
            subJenkinsUrl: listStr,
          }
        : {};
    }
  }

  return (
    <div className={rootCls}>
      <div className={`${rootCls}__title`}>发布内容</div>
      <div className={`${rootCls}__right-top-btns`}>
        {deployEnvs && deployEnvs.length === 1 && deployNodes.length !== 0 && (
          <Button
            danger
            onClick={() => {
              onCancelDeploy(deployEnvs[0]);
            }}
          >
            取消发布
          </Button>
        )}
      </div>

      {/* <CurrSteps
        deployInfo={deployInfo}
        onOperate={onOperate}
        isFrontend={isFrontend}
        appData={appData}
        onCancelDeploy={onCancelDeploy}
        stopSpin={stopSpin}
        onSpin={onSpin}
        deployedList={deployedList}
        getItemByKey={getItemByKey}
      /> */}
      <DeploySteps
        stepData={deployNodes}
        deployInfo={deployInfo}
        onOperate={onOperate}
        isFrontend={isFrontend}
        envTypeCode={envTypeCode}
        appData={appData}
        onCancelDeploy={onCancelDeploy}
        stopSpin={stopSpin}
        onSpin={onSpin}
        deployedList={deployedList}
        getItemByKey={getItemByKey}
        pipelineCode={pipelineCode}
      />
      <div className="full-scree-icon">
        <Fullscreen onClick={() => setFullScreeVisible(true)} />
      </div>

      <div className="table-caption" style={{ marginTop: 16 }}>
        <h4>内容列表</h4>
        <div className="caption-right">
          {!isProd && (
            <Button type="primary" disabled={!selectedRowKeys.length} onClick={handleReDeploy}>
              重新提交
            </Button>
          )}
          {!isProd || isFrontend ? (
            <Button type="primary" disabled={!selectedRowKeys.length} onClick={handleBatchExit}>
              退出分支
            </Button>
          ) : null}
          {/* {!isFrontend && !isProd && (
            <Popconfirm
              title="确定要重启应用吗？"
              onConfirm={async () => {
                await restartApp({
                  appCode,
                  envCode: deployInfo.envs,
                  appCategoryCode: appData?.appCategoryCode,
                });
                message.success('操作成功！');
              }}
            >
              <Button>重启</Button>
            </Popconfirm>
          )} */}
        </div>
      </div>

      <Table
        rowKey="id"
        dataSource={deployedList}
        pagination={false}
        bordered
        scroll={{ x: '100%' }}
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys,
          onChange: (selectedRowKeys: React.Key[]) => {
            setSelectedRowKeys(selectedRowKeys as string[]);
          },
        }}
      >
        <Table.Column dataIndex="branchName" title="分支名" fixed="left" render={branchNameRender} width={320} />
        <Table.Column
          dataIndex="desc"
          title="变更原因"
          width={200}
          ellipsis={{
            showTitle: false,
          }}
          render={(value) => (
            <Tooltip placement="topLeft" title={value}>
              {value}
            </Tooltip>
          )}
        />
        <Table.Column dataIndex="id" title="ID" width={80} />
        <Table.Column
          dataIndex="status"
          width={120}
          align="center"
          title="分支review状态"
          render={(text: number) => (
            <Tag color={STATUS_TYPE[text]?.color || 'red'}>{STATUS_TYPE[text]?.text || '---'}</Tag>
          )}
        />
        <Table.Column dataIndex="gmtCreate" title="创建时间" width={160} render={datetimeCellRender} />
        <Table.Column dataIndex="createUser" title="创建人" width={100} />
        {appData?.appType === 'frontend' ? (
          <Table.Column
            fixed="right"
            title="和master对比"
            align="center"
            width={110}
            render={(item) => (
              <a
                target="_blank"
                href={`${appData?.gitAddress.replace('.git', '')}/-/compare/master...${item.branchName}?view=parallel`}
              >
                查看
              </a>
            )}
          />
        ) : null}
      </Table>
      <Modal
        title="发布流程"
        footer={null}
        width="98%"
        className="full-scree-modal"
        visible={fullScreeVisible}
        onCancel={() => setFullScreeVisible(false)}
      >
        {/* <CurrSteps
          deployInfo={deployInfo}
          onOperate={onOperate}
          onCancelDeploy={onCancelDeploy}
          stopSpin={stopSpin}
          onSpin={onSpin}
          deployedList={deployedList}
          getItemByKey={getItemByKey}
        /> */}
        <DeploySteps
          deployInfo={deployInfo}
          onOperate={onOperate}
          isFrontend={isFrontend}
          appData={appData}
          onCancelDeploy={onCancelDeploy}
          stopSpin={stopSpin}
          onSpin={onSpin}
          deployedList={deployedList}
          getItemByKey={getItemByKey}
        />
      </Modal>
    </div>
  );
}
