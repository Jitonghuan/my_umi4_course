// 发布内容
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/05 22:57

import React, { useState, useContext, useImperativeHandle } from 'react';
import { Modal, Button, Table, Tag, Tooltip } from '@cffe/h2o-design';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import DetailContext from '../../../../../context';
import { Fullscreen } from '@cffe/internal-icon';
import { datetimeCellRender } from '@/utils';
import { cancelDeploy, withdrawFeatures, reCommit } from '@/pages/application/service';
import { IProps } from './types';
import BackendDevEnvSteps from './backend-steps/dev';
import FrontendDevEnvSteps from './frontend-steps/dev';
import DeploySteps from './steps';
import './index.less';

const rootCls = 'publish-content-compo';

const backendStepsMapping: Record<string, typeof BackendDevEnvSteps> = {
  dev: BackendDevEnvSteps,
};
const frontendStepsMapping: Record<string, typeof FrontendDevEnvSteps> = {
  dev: FrontendDevEnvSteps,
};

const PublishContent = React.forwardRef((props: IProps, ref) => {
  const { appCode, envTypeCode, deployedList, deployInfo, onOperate, onSpin, stopSpin, pipelineCode } = props;
  let { metadata, status, envInfo } = deployInfo;
  const { deployNodes } = status || {}; //步骤条数据
  const { deployEnvs } = envInfo || [];
  const { appData, projectEnvCode } = useContext(DetailContext);
  const { id } = appData || {};
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const isProd = envTypeCode === 'prod';
  const [fullScreeVisible, setFullScreeVisible] = useState(false);
  const [isShow, setIsShow] = useState(true);
  useImperativeHandle(ref, () => ({}));

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

  // 重新提交
  const handleReDeploy = () => {
    onOperate('retryDeployStart');

    Modal.confirm({
      title: '确定要重新提交吗?',
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        const features = deployedList.filter((el) => selectedRowKeys.includes(el.id)).map((el) => el.branchName);

        return reCommit({
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
          .filter((item) => selectedRowKeys.includes(item.id))
          .map((item) => item.branchName);

        return withdrawFeatures({
          // appCode,
          // envTypeCode,
          // envCodes:[envTypeCode],
          features,
          id: metadata?.id,
          // isClient: false,
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
  const CurrSteps = isFrontend ? frontendStepsMapping['dev'] : backendStepsMapping['dev'];

  const branchNameRender = (branchName: string, record: any) => {
    return (
      <div>
        <Link to={'/matrix/application/environment-deploy/branch?' + 'appCode=' + appCode + '&' + 'id=' + id}>
          {branchName}
        </Link>
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
          envCode: envTypeCode,
        }).then(() => {});
      },
    });
  }

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

  const showCancel = () => {
    setIsShow(true);
  };

  const notShowCancel = () => {
    setIsShow(false);
  };

  return (
    <div className={rootCls}>
      <div className={`${rootCls}__title`}>发布内容</div>
      <div className={`${rootCls}__right-top-btns`}>
        {isShow && deployNodes?.length !== 0 && (
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

      {/* <CurrSteps
        deployInfo={deployInfo}
        onOperate={onOperate}
        onCancelDeploy={onCancelDeploy}
        stopSpin={stopSpin}
        onSpin={onSpin}
        deployedList={deployedList}
        getItemByKey={getItemByKey}
        projectEnvCode={projectEnvCode}
      /> */}
      <DeploySteps
        stepData={deployNodes}
        deployInfo={deployInfo}
        onOperate={onOperate}
        onCancelDeploy={onCancelDeploy}
        isFrontend={isFrontend}
        envTypeCode={envTypeCode}
        stopSpin={stopSpin}
        onSpin={onSpin}
        deployedList={deployedList}
        notShowCancel={notShowCancel}
        showCancel={showCancel}
        getItemByKey={getItemByKey}
        projectEnvCode={projectEnvCode}
        pipelineCode={pipelineCode}
      />
      {/* <div className="full-scree-icon">
        <Fullscreen onClick={() => setFullScreeVisible(true)} />
      </div> */}

      <div className="table-caption" style={{ marginTop: 16 }}>
        <h4>内容列表</h4>
        <div className="caption-right">
          {!isProd && (
            <Button type="primary" disabled={!selectedRowKeys.length} onClick={handleReDeploy}>
              重新提交
            </Button>
          )}
          <Button type="primary" disabled={!selectedRowKeys.length} onClick={handleBatchExit}>
            退出分支
          </Button>
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
          render={(text: number) => <Tag color={STATUS_TYPE[text]?.color}>{STATUS_TYPE[text]?.text}</Tag>}
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
          getItemByKey={getItemByKey}
          onCancelDeploy={onCancelDeploy}
        /> */}
        <DeploySteps
          stepData={deployNodes}
          deployInfo={deployInfo}
          getItemByKey={getItemByKey}
          onCancelDeploy={onCancelDeploy}
        />
      </Modal>
    </div>
  );
});

export default PublishContent;
