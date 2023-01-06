import React, { useState, useContext } from 'react';
import { Modal, Button, Table, Tooltip } from 'antd';
import { ExclamationCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';

import DeploySteps from './steps';
import SelectVersion from '../select-version';

import DetailContext from '@/pages/npm-manage/detail/context';
import { datetimeCellRender } from '@/utils';
import { postRequest } from '@/utils/request';
import { cancelDeploy, reCommit, withdrawFeatures } from '@/pages/npm-manage/detail/server';
import { IProps } from './types';
import './index.less';

const rootCls = 'publish-content-compo';

export default function PublishContent(props: IProps) {
  const { envTypeCode, deployedList, deployInfo, onOperate, onSpin, stopSpin, envList, pipelineCode } = props;
  let { metadata, status } = deployInfo;
  const { deployNodes, deployStatus } = status || {}; //步骤条数据
  const { npmData } = useContext(DetailContext);
  const { gitAddress } = npmData || {};
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const isProd = envTypeCode === 'prod';
  const [isShow, setIsShow] = useState(false);
  const [deployVisible, setDeployVisible] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  // 重新提交分支
  const handleReDeploy = () => {
    setDeployVisible(true);
  };

  const onReSubmit = async (params: any) => {
    setLoading(true);
    const features = deployedList.filter((el) => selectedRowKeys.includes(el.id)).map((el) => el.branchName);
    await postRequest(reCommit, {
      data: {
        id: metadata.id,
        features,
        ...(params || {}),
      },
    });
    setLoading(false);
    setDeployVisible(false);
  };

  // 批量退出分支
  const handleBatchExit = () => {
    onOperate('batchExitStart');
    Modal.confirm({
      title: '确定要批量退出吗?',
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        const features = deployedList
          .filter((item) => selectedRowKeys.includes(item.id))
          .map((item) => item.branchName);

        return postRequest(withdrawFeatures, {
          data: {
            features,
            id: metadata?.id,
          },
        }).then((res) => {
          onOperate('batchExitEnd');
        });
      },
      onCancel() {
        onOperate('batchExitEnd');
      },
    });
  };

  function onCancelDeploy(envCode?: string) {
    Modal.confirm({
      title: '确定要取消当前发布吗？',
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        return postRequest(cancelDeploy, {
          data: {
            id: metadata?.id,
            envCode,
          },
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

  let resubmitText =
    '重新提交选择的分支，会将选中的分支最新的提交追加合并到部署分支（release分支）上，未选中的分支则不会合并';
  let exitBranch = '分支会全部退出，退出之后在选择要发布的分支重新发布';

  return (
    <div className={rootCls}>
      <div className={`${rootCls}__title`}>发布内容</div>
      <div className={`${rootCls}__right-top-btns`}>
        {deployStatus === 'process' && (
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

      <DeploySteps
        stepData={deployNodes}
        deployInfo={deployInfo}
        onOperate={onOperate}
        envTypeCode={envTypeCode}
        appData={npmData}
        pipelineCode={pipelineCode}
        onCancelDeploy={onCancelDeploy}
        stopSpin={stopSpin}
        notShowCancel={notShowCancel}
        showCancel={showCancel}
        onSpin={onSpin}
        deployedList={deployedList}
        getItemByKey={getItemByKey}
        envList={envList}
      />

      <div className="table-caption" style={{ marginTop: 16 }}>
        <h4>内容列表</h4>
        <div className="caption-right">
          {!isProd && (
            <span style={{ marginRight: 14 }}>
              <Button type="primary" disabled={!selectedRowKeys.length} onClick={handleReDeploy}>
                重新提交
                <Tooltip placement="topRight" title={resubmitText}>
                  <QuestionCircleOutlined />
                </Tooltip>
              </Button>
            </span>
          )}

          <Button type="primary" disabled={!selectedRowKeys.length} onClick={handleBatchExit}>
            退出分支
            <Tooltip placement="topRight" title={exitBranch}>
              <QuestionCircleOutlined />
            </Tooltip>
          </Button>
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
        <Table.Column dataIndex="branchName" title="分支名" fixed="left" width={320} />
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
        <Table.Column dataIndex="gmtCreate" title="创建时间" width={160} render={datetimeCellRender} />
        <Table.Column dataIndex="createUser" title="创建人" width={100} />
        <Table.Column
          fixed="right"
          title="和master对比"
          align="center"
          width={110}
          render={(item) => (
            <a
              target="_blank"
              href={`${gitAddress?.replace('.git', '')}/-/compare/master...${item.branchName}?view=parallel`}
            >
              查看
            </a>
          )}
        />
      </Table>
      <SelectVersion
        loading={loading}
        onConfirm={(params) => {
          void onReSubmit(params);
        }}
        visible={deployVisible}
        onClose={() => setDeployVisible(false)}
      />
    </div>
  );
}
