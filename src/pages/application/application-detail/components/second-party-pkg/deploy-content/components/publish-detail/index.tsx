/**
 * PublishDetail
 * @description 发布详情
 * @author moting.nq
 * @create 2021-04-15 10:11
 */

import React, { useState, useContext, useEffect, useMemo } from 'react';
import { Descriptions, Button, Modal, message, Checkbox } from 'antd';
import { getRequest } from '@/utils/request';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import DetailContext from '@/pages/application/application-detail/context';
import { cancelDeploy, deployReuse, queryEnvsReq,newDeployReuse } from '@/pages/application/service';
import { IProps } from './types';
import { history } from 'umi';
import { getPipelineUrl } from '@/pages/application/service';
import './index.less';

const rootCls = 'publish-detail-compo';
const { confirm } = Modal;

const PublishDetail = ({ deployInfo, env, onOperate, pipelineCode,newPublish }: IProps) => {
  const { appData } = useContext(DetailContext);
  let { metadata, branchInfo, envInfo, buildInfo, status } = deployInfo || {};
  const { buildUrl } = buildInfo || {};
  const { appCategoryCode } = appData || {};
  const [deployVisible, setDeployVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [deployEnv, setDeployEnv] = useState<any[]>();
  const [envDataList, setEnvDataList] = useState<any>([]);
  const [nextPipeline, setNextPipeline] = useState<any>('');

  useEffect(() => {
    if (!appCategoryCode) return;
    queryEnvsReq({
      categoryCode: appCategoryCode as string,
      envTypeCode: env,
      appCode: appData?.appCode,
    }).then((data) => {
      let envSelect: any = [];
      data?.list?.map((item: any) => {
        envSelect.push({ label: item.envName, value: item.envCode });
      });
      setEnvDataList(envSelect);
    });
  }, [appCategoryCode, env]);

  const envNames = useMemo(() => {
    const { deployEnvs } = envInfo || {};

    const namesArr: any[] = [];
    return envDataList
      .filter((envItem: any) => {
        return (deployEnvs || []).includes(envItem.value);
      })
      .map((envItem: any) => `${envItem.label}`)
      .join(',');
    // return (envDataList as any).find((v: any) => v.envCode === deployEnvs[0])?.envName;
  }, [envDataList, deployInfo]);

  useEffect(() => {
    getRequest(getPipelineUrl, {
      data: { appCode: appData?.appCode, envTypeCode: 'cProd', pageIndex: -1, size: -1 },
    }).then((res: any) => {
      if (res?.success) {
        let data = res?.data?.dataSource;
        setNextPipeline(data[0]?.pipelineCode);
      } else {
        setNextPipeline('');
      }
    });
  }, []);

  let errorInfo: any[] = [];
  if (status && status.deployErrInfo) {
    Object.keys(status.deployErrInfo).forEach((item) => {
      if (status.deployErrInfo[item]) {
        errorInfo.push({ key: item, errorMessage: status.deployErrInfo[item] });
      }
    });
  }

  function goToJenkins(item: any) {
    let jenkinsUrl: any[] = [];
    if (buildUrl && item?.key) {
      const data = buildUrl[item?.key] || '';
      if (data) {
        window.open(data, '_blank');
      }
    }
  }

  return (
    <div className={rootCls}>
      <div className={`${rootCls}__right-top-btns`}>
        {env === 'cDev' && (
          <Button
            type="primary"
            onClick={() => {
              onOperate('deployNextEnvStart');
              confirm({
                title: '确定要把当前部署分支发布到下一个环境中？',
                icon: <ExclamationCircleOutlined />,
                onOk: () => {
                  const deploy = newPublish ? newDeployReuse : deployReuse;
                  return deploy({
                    envCodes: [],
                    pipelineCode: nextPipeline,
                    reusePipelineCode: pipelineCode,
                  }).then((res) => {
                    if (res.success) {
                      message.success('操作成功，正在部署中...');
                      onOperate('deployNextEnvSuccess');
                      return;
                    }
                  });
                },
                onCancel() {
                  onOperate('deployNextEnvEnd');
                },
              });
            }}
          >
            部署到下个环境
          </Button>
        )}

        {/* <Button
          type="primary"
          danger
          onClick={() => {
            onOperate('cancelDeployStart');

            confirm({
              title: '确定要取消当前发布吗？',
              icon: <ExclamationCircleOutlined />,
              onOk() {
                return cancelDeploy({
                  id: metadata.id,
                  envCode: '',
                }).then(() => {
                  onOperate('cancelDeployEnd');
                });
              },
              onCancel() {
                onOperate('cancelDeployEnd');
              },
            });
          }}
        >
          取消发布
        </Button> */}
      </div>

      <Descriptions
        title="发布详情"
        labelStyle={{ color: '#5F677A', textAlign: 'right' }}
        contentStyle={{ color: '#000' }}
        column={2}
        bordered
      >
        <Descriptions.Item label="CRID">{metadata?.id || '--'}</Descriptions.Item>
        <Descriptions.Item label="部署分支">{branchInfo?.releaseBranch || '--'}</Descriptions.Item>
        <Descriptions.Item label="发布环境">{envNames || '--'}</Descriptions.Item>
        <Descriptions.Item label="主干分支">{branchInfo?.masterBranch || '--'}</Descriptions.Item>
        {!newPublish &&
         <Descriptions.Item label="冲突分支" span={2}>
         {branchInfo?.conflictFeature || '--'}
       </Descriptions.Item>}
       

        <Descriptions.Item label="合并分支" span={2}>
          {branchInfo?.features.join(',') || '--'}
        </Descriptions.Item>
        {status?.deployErrInfo && errorInfo.length && (
          <Descriptions.Item label="部署错误信息" span={4} contentStyle={{ color: 'red' }}>
            <div>
              {errorInfo.map((err) => (
                <div>
                  <span style={{ color: 'black' }}> {err?.errorMessage ? `${err?.key}：` : ''}</span>
                  <a
                    style={{ color: 'red', textDecoration: 'underline' }}
                    onClick={() => {
                      if (err?.errorMessage.indexOf('请查看jenkins详情') !== -1) {
                        goToJenkins(err);
                      }
                      if (err?.errorMessage.indexOf('请查看jenkins详情') === -1 && appData?.appType !== 'frontend') {
                        localStorage.setItem('__init_env_tab__', metadata?.envTypeCode);
                        history.push(
                          `/matrix/application/detail/deployInfo?appCode=${metadata?.appCode}&id=${appData?.id}`,
                        );
                      }
                    }}
                  >
                    {err?.errorMessage}
                  </a>
                  {appData?.appType !== 'frontend' && envInfo?.depoloyEnvs?.includes(err.key) && (
                    <span style={{ color: 'gray' }}> {err?.errorMessage ? '（点击跳转）' : ''}</span>
                  )}
                </div>
              ))}
            </div>
          </Descriptions.Item>
        )}
      </Descriptions>

      <Modal
        title="选择发布环境"
        visible={deployVisible}
        confirmLoading={confirmLoading}
        onOk={() => {
          setConfirmLoading(true);

          return deployReuse({ id: metadata.id })
            .then((res) => {
              if (res.success) {
                message.success('操作成功，正在部署中...');
                setDeployVisible(false);
                onOperate('deployNextEnvEnd');
              }
            })
            .finally(() => setConfirmLoading(false));
        }}
        onCancel={() => {
          setDeployVisible(false);
          setConfirmLoading(false);
          onOperate('deployNextEnvEnd');
        }}
      >
        <div>
          <span>发布环境：</span>
          <Checkbox.Group value={deployEnv} onChange={(v) => setDeployEnv(v)} options={envDataList || []} />
        </div>
      </Modal>
    </div>
  );
};

// PublishDetail.defaultProps = {};

export default PublishDetail;
