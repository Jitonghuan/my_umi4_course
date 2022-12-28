// 发布内容
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/05 22:57

import React, { useState, useContext, useEffect } from 'react';
import { Modal, Button, Table, Tag, Tooltip, message } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ExclamationCircleOutlined, QuestionCircleOutlined, CopyOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import DetailContext from '@/pages/application/application-detail/context';
import { Fullscreen } from '@cffe/internal-icon';
import { datetimeCellRender } from '@/utils';
import { cancelDeploy, reCommit, withdrawFeatures, newWithdrawFeatures, newReCommit, newCancelDeploy } from '@/pages/application/service';
import { IProps } from './types';
import DeploySteps from './steps';
import NewDeploySteps from './new-steps';
import './index.less';
const rootCls = 'publish-content-compo';

export default function PublishContent(props: IProps) {
  const { appCode, envTypeCode, deployedList, deployInfo, onOperate, onSpin, stopSpin, pipelineCode, envList, loading, newPublish } = props;
  let { metadata, envInfo } = deployInfo || {};
  // const { deployNodes } = status || {}; //步骤条数据
  const [stepData, setStepData] = useState<any>([]);
  const { deployEnvs } = envInfo || [];
  const { appData } = useContext(DetailContext);
  const { id } = appData || {};
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const isProd = envTypeCode === 'prod';
  const [fullScreeVisible, setFullScreeVisible] = useState(false);
  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    if (newPublish) {
      setStepData(deployInfo?.pipelineInfo?.tasks || [])
    } else {
      setStepData(deployInfo?.status?.deployNodes || [])
    }
  }, [newPublish, deployInfo])

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

  // 重新提交分支
  const handleReDeploy = () => {
    onOperate('retryDeployStart');
    const recommit: any = newPublish ? newReCommit : reCommit;
    Modal.confirm({
      title: '确定要重新提交吗?',
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        const features = deployedList.filter((el) => selectedRowKeys.includes(el.id)).map((el) => el.branchName);
        return recommit({
          id: metadata.id,
          features,
        }).then(() => {
          onOperate('retryDeployEnd');
          // refreshList();
        });
      },
      onCancel() {
        onOperate('retryDeployEnd');
      },
    });
  };

  // 批量退出分支
  const handleBatchExit = () => {
    onOperate('batchExitStart');
    if (!metadata?.id) {
      message.error('未检测到部署单！');
      return;
    }
    if (envTypeCode === 'version' && selectedRowKeys?.length !== deployedList?.length) {
      message.error('版本发布退出分支必须选中所有分支退出！')
    }
    const withdraw: any = newPublish ? newWithdrawFeatures : withdrawFeatures;
    Modal.confirm({
      title: '确定要批量退出吗?',
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        const features = deployedList
          .filter((item) => selectedRowKeys.includes(item.id))
          .map((item) => item.branchName);

        return withdraw({
          // appCode,
          // envTypeCode,
          features,
          id: metadata?.id,
          // isClient: false,
          // pipelineCode,
        }).then((res: any) => {
          if (res?.code === 1001) {
            Modal.error({
              title: '退出分支出错！',
              content: res?.errorMsg,
            });
          }
          onOperate('batchExitEnd');
          // refreshList();
        });
      },
      onCancel() {
        onOperate('batchExitEnd');
      },
    });
  };

  const isFrontend = appData?.appType === 'frontend';

  const branchNameRender = (branchName: string, record: any) => {
    return (
      <div>
        <Link to={'/matrix/application/detail/branch?' + 'appCode=' + appCode + '&' + 'id=' + id}>{branchName}</Link>
        <span style={{ marginLeft: 8, color: '#3591ff' }}>
          <CopyToClipboard text={branchName} onCopy={() => message.success('复制成功！')}>
            <CopyOutlined />
          </CopyToClipboard>
        </span>
      </div>
    );
  };

  function onCancelDeploy(envCode?: string) {
    Modal.confirm({
      title: '确定要取消当前发布吗？',
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        return cancelDeploy({ id: metadata?.id, envCode }).then(() => { });
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

  let resubmitText =
    '重新提交选择的分支，会将选中的分支最新的提交追加合并到部署分支（release分支）上，未选中的分支则不会合并';
  let exitBranch = '将选中的分支从部署分支（release分支）中退出，则会将剩下的分支重新合并到新的部署分支中';

  return (
    <div className={rootCls}>
      <div className={`${rootCls}__title`}>发布内容</div>
      <div className={`${rootCls}__right-top-btns`}>
        {isShow && !newPublish && stepData?.length !== 0 && (
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
          isFrontend={isFrontend}
          envTypeCode={envTypeCode}
          appData={appData}
          onCancelDeploy={onCancelDeploy}
          stopSpin={stopSpin}
          onSpin={onSpin}
          deployedList={deployedList}
          getItemByKey={getItemByKey}
          pipelineCode={pipelineCode}
          envList={envList}
        /> :
        <DeploySteps
          // stepData={deployNodes}
          stepData={stepData}
          deployInfo={deployInfo}
          onOperate={onOperate}
          isFrontend={isFrontend}
          envTypeCode={envTypeCode}
          appData={appData}
          onCancelDeploy={onCancelDeploy}
          stopSpin={stopSpin}
          notShowCancel={notShowCancel}
          showCancel={showCancel}
          onSpin={onSpin}
          deployedList={deployedList}
          getItemByKey={getItemByKey}
          pipelineCode={pipelineCode}
          envList={envList}
        />}
      {/* <div className="full-scree-icon">
        <Fullscreen onClick={() => setFullScreeVisible(true)} />
      </div> */}

      <div className="table-caption" style={{ marginTop: 16 }}>
        <h4>内容列表</h4>
        <div className="caption-right">
          {!isProd && (
            <span style={{ marginRight: 14 }}>
              {appData?.deployModel === 'online' && envTypeCode !== "version" && (
                <Button type="primary" disabled={!selectedRowKeys.length || !deployedList?.length} onClick={handleReDeploy} style={{ marginLeft: '10px' }}>
                  重新提交
                  <Tooltip placement="topRight" title={resubmitText}>
                    <QuestionCircleOutlined />
                  </Tooltip>
                </Button>
              )}
            </span>
          )}
          {appData?.deployModel === 'online' && (
            <Button type="primary" disabled={!selectedRowKeys.length || !deployedList?.length} onClick={handleBatchExit}>
              退出分支
              <Tooltip placement="topRight" title={exitBranch}>
                <QuestionCircleOutlined />
              </Tooltip>
            </Button>
          )}
        </div>
      </div>

      <Table
        rowKey="id"
        dataSource={deployedList}
        pagination={false}
        loading={loading}
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
        {envTypeCode === 'prod' && (
          <Table.Column
            dataIndex={['relationStatus', 'statusList']}
            width={220}
            align="center"
            title="关联需求状态"
            render={(value: any) => (
              Array.isArray(value) && value.length ? (
                value.map((item: any) => (
                  <div className='demand-cell'>
                    <Tooltip title={item.title}><a target="_blank" href={item.url}>{item.title}</a></Tooltip>
                    <Tag color={item.status === '待发布' ? '#87d068' : '#59a6ed'}>{item.status}</Tag>
                  </div>
                ))
              ) : null
            )}
          />
        )}
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
