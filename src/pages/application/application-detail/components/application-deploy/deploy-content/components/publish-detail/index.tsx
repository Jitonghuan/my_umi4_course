// 发布详情
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/06 20:08

import React, { useState, useContext, useEffect, useMemo } from 'react';
import { Descriptions, Button, Modal, message, Checkbox, Radio, Upload, Form, Select, Typography } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { getRequest } from '@/utils/request';
import { history } from 'umi';
import appConfig from '@/app.config';
import DetailContext from '@/pages/application/application-detail/context';
import { listAppEnv, checkNextEnv } from '@/pages/application/service';
import {
  cancelDeploy,
  deployReuse,
  deployMaster,
  // offlineDeploy,
  feOfflineDeploy,
  restartApp,
  queryProjectEnvList,
  checkOfflineDeploy,
} from '@/pages/application/service';
import { UploadOutlined } from '@ant-design/icons';
import { IProps } from './types';
import { useEnvList } from '@/pages/application/project-environment/hook';
import ServerStatus from '../server-status';
import { getPipelineUrl } from '@/pages/application/service';
import { useMasterBranchList } from '@/pages/application/application-detail/components/branch-manage/hook';
import './index.less';

const rootCls = 'publish-detail-compo';
const { Paragraph } = Typography;
export default function PublishDetail(props: IProps) {
  const [envProjectForm] = Form.useForm();
  let { deployInfo, envTypeCode, onOperate, appStatusInfo, nextTab, pipelineCode } = props;
  let { metadata, branchInfo, envInfo, buildInfo, status } = deployInfo || {};
  const { buildUrl } = buildInfo || {};
  const { appData } = useContext(DetailContext);
  const { appCategoryCode } = appData || {};
  const [loading, envDataSource] = useEnvList();
  const [deployNextEnvVisible, setDeployNextEnvVisible] = useState(false);
  const [deployMasterVisible, setDeployMasterVisible] = useState(false);
  const [envProjectVisible, setEnvProjectVisible] = useState(false);
  const [listLoading, setListLoading] = useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [projectEnvCodeOptions, setProjectEnvCodeOptions] = useState<any>([]);
  const [projectEnvName, setProjectEnvName] = useState<string>('');
  const [offlineEnvData, setOffLineEnvData] = useState<any>([]); //支持离线部署的环境
  const [deployEnv, setDeployEnv] = useState<string[]>();
  const [restartEnv, setRestartEnv] = useState<string[]>([]); //重启时获取到的环境值
  const [deployMasterEnv, setDeployMasterEnv] = useState<string[]>();
  const [deployNextEnv, setDeployNextEnv] = useState<string[]>();
  const [envDataList, setEnvDataList] = useState<IOption[]>([]);
  const [nextEnvDataList, setNextEnvDataList] = useState<IOption[]>([]);
  const [deployVisible, setDeployVisible] = useState(false);
  const [restartVisible, setRestartVisible] = useState(false);
  const [masterBranchOptions, setMasterBranchOptions] = useState<any>([]);
  const [pipelineOptions, setPipelineOptions] = useState<any>([]);
  const [selectPipeline, setSelectPipeline] = useState<any>('');
  const [selectMaster, setSelectMaster] = useState<any>('');
  const [beforeUploadInfo, setBeforeUploadInfo] = useState<boolean>(true);
  const [masterListData] = useMasterBranchList({ branchType: 'master', appCode: appData?.appCode || '' });

  let newNextEnvTypeCode = '';
  useEffect(() => {
    if (!appCategoryCode || !appData) return;
    // 所有环境
    getEnvList({ envTypeCode: envTypeCode, appCode: appData?.appCode, proEnvType: 'benchmark' });
    // 项目环境
    getEnvList({ envTypeCode: envTypeCode, appCode: appData?.appCode, proEnvType: 'project' });
    // 支持离线部署的环境
    getEnvList({
      envTypeCode: envTypeCode,
      appCode: appData?.appCode,
      proEnvType: 'benchmark',
      clusterName: 'private-cluster',
    });

    if (metadata?.id !== undefined) {
      getRequest(checkNextEnv, {
        data: {
          id: metadata?.id,
        },
      }).then((response) => {
        if (response?.success) {
          newNextEnvTypeCode = response?.data;
          getNextEnv(newNextEnvTypeCode).then((resp) => {
            if (resp?.success) {
              let envSelect: any = [];
              resp?.data?.map((item: any) => {
                envSelect.push({ label: item.envName, value: item.envCode });
              });
              setNextEnvDataList(envSelect);
            }
          });
        }
      });
    }
  }, [appCategoryCode, envTypeCode, metadata?.id]);

  useEffect(() => {
    if (masterListData.length !== 0) {
      const option = masterListData.map((item: any) => ({ value: item.branchName, label: item.branchName }));
      setMasterBranchOptions(option);
      const initValue = option.find((item: any) => item.label === 'master');
      setSelectMaster(initValue?.value);
    }
  }, [masterListData]);

  useEffect(() => {
    if (nextTab) {
      getRequest(getPipelineUrl, {
        data: { appCode: appData?.appCode, envTypeCode: nextTab, pageIndex: -1, size: -1 },
      }).then((res) => {
        if (res?.success) {
          let data = res?.data?.dataSource;
          const pipelineOptionData = data.map((item: any) => ({ value: item.pipelineCode, label: item.pipelineName }));
          setPipelineOptions(pipelineOptionData);
        } else {
          setPipelineOptions([]);
        }
      });
    }
  }, [nextTab]);

  // 获取环境列表
  const getEnvList = (params: any) => {
    getRequest(listAppEnv, {
      data: {
        ...params,
      },
    }).then((result) => {
      let envs: any = [];
      if (result?.success) {
        result?.data?.map((item: any) => {
          envs.push({ label: item.envName, value: item.envCode });
        });
        if (params.clusterName) {
          setOffLineEnvData(envs);
        }
        if (params.proEnvType === 'benchmark' && !params?.clusterName) {
          setEnvDataList(envs);
        }
        if (params.proEnvType === 'project') {
          setProjectEnvCodeOptions(envs);
        }
      }
    });
  };
  // 下一个部署环境
  const getNextEnv = (envTypeCode: string) => {
    return getRequest(listAppEnv, {
      data: {
        envTypeCode: newNextEnvTypeCode,
        appCode: appData?.appCode,
      },
    });
  };
  // 取消发布
  const handleCancelPublish = () => {
    onOperate('cancelDeployStart');

    Modal.confirm({
      title: '确定要取消当前发布吗？',
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        return cancelDeploy({
          id: metadata?.id,
          envCode: '',
        }).then(() => {
          onOperate('cancelDeployEnd');
        });
      },
      onCancel() {
        onOperate('cancelDeployEnd');
      },
    });
  };

  // 部署到下一个环境
  const deployNext = () => {
    onOperate('deployNextEnvStart');
    setDeployNextEnvVisible(true);
  };
  // 放弃部署到下一个环境
  const cancelDeployNext = () => {
    onOperate('deployNextEnvEnd');
    setDeployNextEnvVisible(false);
    setConfirmLoading(false);
  };
  // 确认发布操作
  const confirmPublishNext = async () => {
    if (!selectPipeline) {
      message.error('请选择要发布的流水线！');
      return;
    }
    setConfirmLoading(true);
    try {
      const res = await deployReuse({
        envCodes: deployNextEnv,
        pipelineCode: selectPipeline,
        reusePipelineCode: pipelineCode,
      });
      if (res?.success) {
        message.success('操作成功，正在部署中...');
        setDeployNextEnvVisible(false);
        onOperate('deployNextEnvSuccess');
      }
    } finally {
      setConfirmLoading(false);
    }
  };

  // 部署 master
  const deployToMaster = () => {
    onOperate('deployMasterStart');
    setDeployMasterVisible(true);
  };
  // 放弃部署 master
  const cancelDeployToMaster = () => {
    onOperate('deployMasterEnd');
    setDeployMasterVisible(false);
    setConfirmLoading(false);
  };
  const getBuildType = () => {
    let { appType, isClient } = appData || {};
    if (appType === 'frontend') {
      return 'feMultiBuild';
    } else {
      return isClient ? 'beClientBuild' : 'beServerBuild';
    }
  };

  // 确认发布操master作
  const confirmPublishToMaster = async () => {
    setConfirmLoading(true);
    try {
      const res = await deployMaster({
        pipelineCode,
        envCodes: deployMasterEnv,
        buildType: getBuildType(),
        masterBranch: selectMaster, //主干分支
      });
      if (res?.success) {
        message.success('操作成功，正在部署中...');
        setDeployMasterVisible(false);
        setDeployMasterEnv([]);
        onOperate('deployMasterEnd');
      }
    } finally {
      setConfirmLoading(false);
    }
  };

  // 发布环境
  let I = 0;
  const envNames = useMemo(() => {
    const { deployEnvs } = envInfo || {};
    return (
      envDataList
        .filter((envItem) => {
          return (deployEnvs || []).includes(envItem.value);
        })
        .map((envItem) => envItem.label)
        // .map((envItem) => `${envItem.label}(${envItem.value})`)
        .join(',')
    );
  }, [envDataList, deployInfo]);

  const uploadImages = () => {
    return `${feOfflineDeploy}?pipelineCode=${pipelineCode}&envCodes=${deployEnv}`;
  };
  const beforeUploadAction = (envCode: string) => {
    // setBeforeUploadInfo(true);
    getRequest(checkOfflineDeploy, { data: { appCode: appData?.appCode, envCode } }).then((res) => {
      if (res.success) {
        setBeforeUploadInfo(false);
      } else {
        setBeforeUploadInfo(true);
      }
    });
  };

  // 上传按钮 message.error(info.file.response?.errorMsg) ||
  const uploadProps = {
    name: 'file',
    action: uploadImages,
    maxCount: 1,
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 3,
      format: (percent: any) => `${parseFloat(percent.toFixed(2))}%`,
      showInfo: '上传中请不要关闭弹窗',
    },

    beforeUpload: (file: any, fileList: any) => {
      return new Promise((resolve, reject) => {
        Modal.confirm({
          title: '操作提示',
          content: `确定要上传文件：${file.name}进行离线部署吗？`,
          onOk: () => {
            return resolve(file);
          },
          onCancel: () => {
            return reject(false);
          },
        });
      });
    },
    onChange: (info: any) => {
      if (info.file.status === 'uploading') {
      }
      if (info.file.status === 'done' && info.file?.response.success) {
        message.success(`${info.file.name} 上传成功`);
        setDeployVisible(false);
        setDeployEnv([]);
        onOperate('uploadImageEnd');
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败`);
      } else if (info.file?.response?.success === false) {
        message.error(info.file.response?.errorMsg);
      } else if (info.file.status === 'removed') {
        message.warning('上传取消！');
      }
    },
  };

  const handleCancel = () => {
    setDeployVisible(false);
    setDeployEnv([]);
    onOperate('uploadImageEnd');
  };
  const queryProjectEnv = async (benchmarkEnvCode: any) => {
    setListLoading(true);
    await getRequest(queryProjectEnvList, { data: { benchmarkEnvCode, pageSize: 9999, pageIndex: 1 } })
      .then((res) => {
        if (res?.success) {
          let data = res.data.dataSource;
          let option = (data || []).map((item: any) => ({
            label: item.envName,
            value: item.envCode,
          }));
          setProjectEnvCodeOptions(option);
        }
      })
      .finally(() => {
        setListLoading(false);
      });
  };
  const selectEnvProject = (value: string, option: any) => {
    queryProjectEnv(value);
  };

  const selectProjectEnv = (value: string, option: any) => {
    setProjectEnvName(option.label);
  };
  const ensureProjectEnv = () => {
    envProjectForm.validateFields().then((value) => {
      history.push({
        pathname: `/matrix/application/environment-deploy/appDeploy`,
        query: {
          appCode: appData.appCode,
          id: appData.id + '',
          projectEnvCode: value.envCode,
          projectEnvName: projectEnvName,
        },
      });
    });
  };

  //重启确认
  const { confirm } = Modal;
  const ensureRestart = () => {
    confirm({
      title: '确定要重启应用吗？',
      icon: <ExclamationCircleOutlined />,
      onOk: () => {
        restartApp({
          appCode: appData?.appCode,
          // envCode: restartEnv?.[0],
          envCode: restartEnv,
          appCategoryCode: appData?.appCategoryCode,
        })
          .then((resp) => {
            if (resp.success) {
              message.success('操作成功！');
            }
          })
          .finally(() => {
            setRestartVisible(false);
            setRestartEnv([]);
          });
      },
      onCancel() {},
    });
  };
  let envDataOption: any = []; //重启时选择环境option
  envDataList?.map((item) => {
    if (item?.value === 'tt-his') {
      envDataOption.push({ label: item.label, value: item.value });
    }
    if (item?.value === 'tt-health') {
      envDataOption.push({ label: item.label, value: item.value });
    }
    if (item?.value === 'seenew-health') {
      envDataOption.push({ label: item.label, value: item.value });
    }
    if (item?.value === 'tt-his-clusterb') {
      envDataOption.push({ label: item.label, value: item.value });
    }
  });

  // let deployErrInfo: any[] = [];
  // try {
  //   if (status && status.deployErrInfo) {
  //     Object.keys(status.deployErrInfo).forEach((item) => {
  //       deployErrInfo.push({ item: status.deployErrorInfo[item] })
  //     })
  //   }
  // } catch (e) {
  //   if (status && status.deployErrInfo) {
  //     const data = Object.keys(deployErrInfo)
  //     deployErrInfo = [
  //       {
  //         subErrInfo: status.deployErrInfo,
  //         envCode: envInfo.deployEnvs,
  //       },
  //     ];
  //   }
  // }

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
    // try {
    //   // jenkinsUrl = deployInfo.jenkinsUrl ? JSON.parse(deployInfo.jenkinsUrl) : [];
    //   jenkinsUrl = buildInfo.buildUrl ? JSON.parse(buildInfo.buildUrl) : [];
    // } catch (e) {
    //   if (buildInfo.buildUrl) {
    //     jenkinsUrl = [
    //       {
    //         subJenkinsUrl: buildInfo.buildUrl,
    //         envCode: envInfo.deployEnvs,
    //       },
    //     ];
    //   }
    // }
    // const data = jenkinsUrl.find((val) => val.envCode === item.key);
    // if (data && data.subJenkinsUrl) {
    //   window.open(data.subJenkinsUrl, '_blank');
    // }
  }

  const handleChange = (v: string) => {
    setSelectMaster(v);
  };

  const pipelineChange = (v: string) => {
    setSelectPipeline(v);
  };

  return (
    <div className={rootCls}>
      <div className={`${rootCls}__right-top-btns`}>
        {/* {appData?.appType === 'backend' && envTypeCode === 'prod' && deployEnv?.indexOf('tt-his') !== -1 && (
          <Button type="primary" onClick={() => setRestartVisible(true)}>
            重启应用
          </Button>
        )} */}
        {/* {envTypeCode === 'prod' && appConfig.PRIVATE_METHODS === 'private' && ( */}

        <Button
          type="primary"
          onClick={() => {
            setDeployVisible(true);
            setDeployEnv([]);
            setBeforeUploadInfo(true);
          }}
          icon={<UploadOutlined />}
        >
          离线部署
        </Button>
        {/* )}  */}

        {/* {envTypeCode === 'prod' ? (
          <Button type="default" disabled={!deployInfo.deployedEnvs} danger onClick={() => setRollbackVisible(true)}>
            发布回滚
          </Button>
        ) : null} */}
        {envTypeCode !== 'prod' && (
          <Button
            type="primary"
            onClick={() => {
              setEnvProjectVisible(true);
            }}
          >
            项目环境部署
          </Button>
        )}
        {envTypeCode !== 'prod' && (
          <Button type="primary" onClick={deployToMaster}>
            部署主干分支
          </Button>
        )}

        {envTypeCode !== 'prod' && (
          <Button type="primary" onClick={deployNext}>
            部署到下个环境
          </Button>
        )}

        {/* {envTypeCode === 'prod' && appData?.appType === 'backend' && (
          <Button type="primary" danger onClick={handleCancelPublish}>
            取消发布
          </Button>
        )} */}
      </div>

      <Descriptions
        title="发布详情"
        labelStyle={{ color: '#5F677A', textAlign: 'right', whiteSpace: 'nowrap' }}
        contentStyle={{ color: '#000' }}
        column={4}
        bordered
      >
        <Descriptions.Item label="CRID" contentStyle={{ whiteSpace: 'nowrap' }}>
          {/* {deployInfo?.id || '--'} */}
          {metadata?.id || '--'}
        </Descriptions.Item>
        <Descriptions.Item label="部署分支" span={appData?.appType === 'frontend' ? 1 : 2}>
          {branchInfo?.releaseBranch ? <Paragraph copyable>{branchInfo?.releaseBranch}</Paragraph> : '---'}
          {/* <Paragraph copyable>{deployInfo?.releaseBranch || '--'}</Paragraph> */}
        </Descriptions.Item>
        {appData?.appType === 'frontend' && (
          <Descriptions.Item label="部署版本" contentStyle={{ whiteSpace: 'nowrap' }}>
            {buildInfo?.buildResultInfo?.version ? (
              <Paragraph copyable>{buildInfo?.buildResultInfo?.version}</Paragraph>
            ) : (
              '---'
            )}
            {/* <Paragraph copyable>{deployInfo?.version || '--'}</Paragraph> */}
          </Descriptions.Item>
        )}
        <Descriptions.Item label="发布环境">{envNames || '--'}</Descriptions.Item>
        <Descriptions.Item label="冲突分支" span={4}>
          {branchInfo?.conflictFeature || '--'}
        </Descriptions.Item>
        <Descriptions.Item label="主干分支" span={4}>
          {branchInfo?.masterBranch || '--'}
        </Descriptions.Item>
        <Descriptions.Item label="合并分支" span={4}>
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
      {envTypeCode === 'prod' && appStatusInfo?.length ? (
        <ServerStatus onOperate={onOperate} appStatusInfo={appStatusInfo} />
      ) : null}

      {/* --------------------- modals --------------------- */}

      {/* 部署到 下一个环境 */}
      <Modal
        key="deployNext"
        title="选择发布环境"
        visible={deployNextEnvVisible}
        confirmLoading={confirmLoading}
        onOk={confirmPublishNext}
        maskClosable={false}
        onCancel={cancelDeployNext}
      >
        <div>
          <div style={{ marginBottom: '15px' }}>
            <span>选择流水线：</span>
            <Select
              options={pipelineOptions}
              value={selectPipeline}
              style={{ width: '240px', marginRight: '20px' }}
              onChange={pipelineChange}
              showSearch
              size="small"
              optionFilterProp="label"
              // labelInValue
              filterOption={(input, option) => {
                return option?.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0;
              }}
            ></Select>
          </div>
          <span>发布环境：</span>
          {/* <Radio.Group value={type} onChange={handleTypeChange}> */}
          {/* <Radio.Group  value={deployNextEnv} onChange={(v: any) => setDeployNextEnv(v)} options={nextEnvDataList}></Radio.Group> */}
          <Checkbox.Group value={deployNextEnv} onChange={(v: any) => setDeployNextEnv(v)} options={nextEnvDataList} />
        </div>
      </Modal>

      {/* 部署到主干分支 */}
      <Modal
        key="deployMaster"
        title="选择发布环境"
        visible={deployMasterVisible}
        confirmLoading={confirmLoading}
        onOk={confirmPublishToMaster}
        maskClosable={false}
        onCancel={cancelDeployToMaster}
      >
        <div>
          <div style={{ marginBottom: '10px' }}>
            <span>主干分支：</span>
            <Select
              options={masterBranchOptions}
              value={selectMaster}
              style={{ width: '200px', marginRight: '20px' }}
              onChange={handleChange}
              showSearch
              size="small"
              optionFilterProp="label"
              // labelInValue
              filterOption={(input, option) => {
                return option?.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0;
              }}
            ></Select>
          </div>
          <span>发布环境：</span>
          <Checkbox.Group value={deployMasterEnv} onChange={(v: any) => setDeployMasterEnv(v)} options={envDataList} />
        </div>
      </Modal>

      {/* 离线部署 */}
      <Modal
        key="deployOffline"
        title="选择部署环境"
        visible={deployVisible}
        footer={null}
        onCancel={handleCancel}
        maskClosable={false}
      >
        <div>
          <span>发布环境：</span>
          <Radio.Group
            onChange={(e: any) => {
              onOperate('uploadImageStart');
              setDeployEnv(e.target.value);
              beforeUploadAction(e.target.value);
              console.log('e.target.value', e.target.value);
            }}
            value={deployEnv}
            options={offlineEnvData || []}
          ></Radio.Group>
          {/* <Checkbox.Group
            value={deployEnv}
            onChange={(v: any) => {
              onOperate('uploadImageStart');
              setDeployEnv(v);
            }}
            options={envDataList || []}
          /> */}
        </div>

        <div style={{ display: 'flex', marginTop: '12px' }} key={Math.random()}>
          <span>配置文件：</span>
          <Upload {...uploadProps} accept=".tgz,.gz">
            <Button icon={<UploadOutlined />} type="primary" ghost disabled={beforeUploadInfo}>
              离线部署
            </Button>
          </Upload>
        </div>
      </Modal>

      {/* 重启按钮 */}
      <Modal
        key="deployRestart"
        title="选择重启环境"
        visible={restartVisible}
        onCancel={() => {
          setRestartVisible(false);
          setRestartEnv([]);
        }}
        onOk={ensureRestart}
        maskClosable={false}
      >
        <div>
          <span>发布环境：</span>
          {envDataOption.length > 0 && (
            <Radio.Group
              value={restartEnv}
              onChange={(v: any) => setRestartEnv(v.target.value)}
              options={envDataOption}
            ></Radio.Group>
          )}
        </div>
      </Modal>
      {/* 跳转项目环境信息页面按钮 */}
      <Modal
        key="envProjectDetail"
        title="选择环境"
        visible={envProjectVisible}
        onCancel={() => {
          setEnvProjectVisible(false);
        }}
        onOk={ensureProjectEnv}
        maskClosable={false}
      >
        <div>
          <Form form={envProjectForm}>
            {/* <Form.Item
              label="基准环境:"
              name="benchmarkEnvCode"
              rules={[{ required: true, message: '请选择基准环境' }]}
            >
              <Select
                options={envDataSource}
                allowClear
                showSearch
                loading={loading}
                style={{ width: 180 }}
                onChange={selectEnvProject}
              ></Select>
            </Form.Item> */}
            <Form.Item label="项目环境:" name="envCode" rules={[{ required: true, message: '请选择项目环境' }]}>
              <Select
                style={{ width: 180 }}
                allowClear
                showSearch
                loading={listLoading}
                options={projectEnvCodeOptions}
                onChange={selectProjectEnv}
              ></Select>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
}
