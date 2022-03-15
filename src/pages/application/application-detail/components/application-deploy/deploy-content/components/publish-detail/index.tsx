// 发布详情
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/06 20:08

import React, { useState, useContext, useEffect, useMemo } from 'react';
import { Descriptions, Button, Modal, message, Checkbox, Radio, Upload, Form, Select, Popconfirm } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { getRequest, postRequest } from '@/utils/request';
import { history } from 'umi';

import axios from 'axios';

import DetailContext from '@/pages/application/application-detail/context';
import { listAppEnv, checkNextEnv } from '@/pages/application/service';
import {
  cancelDeploy,
  deployReuse,
  deployMaster,
  offlineDeploy,
  restartApp,
  queryProjectEnvList,
} from '@/pages/application/service';
import { UploadOutlined } from '@ant-design/icons';
import { IProps } from './types';
import { useEnvList } from '@/pages/application/project-environment/hook';
import ServerStatus from '../server-status';
import './index.less';

const rootCls = 'publish-detail-compo';

export default function PublishDetail(props: IProps) {
  const [envProjectForm] = Form.useForm();
  let { deployInfo, envTypeCode, onOperate, appStatusInfo } = props;
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
  // const [envDataList, setEnvDataList] = useState([]);
  const [deployEnv, setDeployEnv] = useState<string[]>();
  const [restartEnv, setRestartEnv] = useState<string[]>([]); //重启时获取到的环境值
  const [deployMasterEnv, setDeployMasterEnv] = useState<string[]>();
  const [deployNextEnv, setDeployNextEnv] = useState<string[]>();
  const [envDataList, setEnvDataList] = useState<IOption[]>([]);
  const [nextEnvDataList, setNextEnvDataList] = useState<IOption[]>([]);
  const [deployVisible, setDeployVisible] = useState(false);
  const [restartVisible, setRestartVisible] = useState(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [filelist, setfileList] = useState<any[]>([]);
  let newNextEnvTypeCode = '';
  useEffect(() => {
    if (!appCategoryCode || !appData) return;

    // 当前部署环境
    getRequest(listAppEnv, {
      data: {
        envTypeCode: envTypeCode,
        appCode: appData?.appCode,
      },
    }).then((result) => {
      let envSelect: any = [];
      if (result?.success) {
        result?.data?.map((item: any) => {
          envSelect.push({ label: item.envName, value: item.envCode });
        });
        setEnvDataList(envSelect);
      }
      // setEnvDataList(data.list);
    });

    if (deployInfo.id !== undefined) {
      getRequest(checkNextEnv, {
        data: {
          id: deployInfo.id,
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
  }, [appCategoryCode, envTypeCode, deployInfo.id]);
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
          id: deployInfo.id,
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
    setConfirmLoading(true);
    try {
      await deployReuse({ id: deployInfo.id, envs: deployNextEnv });
      message.success('操作成功，正在部署中...');
      setDeployNextEnvVisible(false);
      onOperate('deployNextEnvSuccess');
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
  // 确认发布操master作
  const confirmPublishToMaster = async () => {
    setConfirmLoading(true);
    try {
      await deployMaster({
        appCode: appData?.appCode,
        envTypeCode: envTypeCode,
        envCodes: deployMasterEnv,
        isClient: appData?.isClient === 1,
      });
      message.success('操作成功，正在部署中...');
      setDeployMasterVisible(false);
      setDeployMasterEnv([]);
      onOperate('deployMasterEnd');
    } finally {
      setConfirmLoading(false);
    }
  };

  // 发布环境
  let I = 0;
  const envNames = useMemo(() => {
    const { envs } = deployInfo;
    const envList = envs?.split(',') || [];
    return envDataList
      .filter((envItem) => {
        return envList.includes(envItem.value);
      })
      .map((envItem) => `${envItem.label}(${envItem.value})`)
      .join(',');
  }, [envDataList, deployInfo]);

  const uploadImages = () => {
    return `${offlineDeploy}?appCode=${appData?.appCode}&envTypeCode=${props.envTypeCode}&envs=${deployEnv}&isClient=${appData?.isClient}`;
  };

  // 上传按钮 message.error(info.file.response?.errorMsg) ||
  const uploadProps = {
    name: 'image',
    action: uploadImages,
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 3,
      format: (percent: any) => `${parseFloat(percent.toFixed(2))}%`,
    },

    beforeUpload: (file: any, fileList: any) => {
      return new Promise((resolve, reject) => {
        Modal.confirm({
          title: '操作提示',
          content: `确定要上传文件：${file.name}进行离线部署吗？`,
          onOk: () => {
            // return resolve(file);
            // fileList[0].percent = 0;
            setfileList([...fileList]);
            return resolve(fileList);
            // return  reject(false);
          },
          onCancel: () => {
            //  return reject(file);
            return reject(false);
          },
        });
      });
    },
    customRequest: (option: any) => {
      console.log(option);
      const formData = new FormData();
      formData.append('image', option.file);
      const fileUrl = uploadImages();
      axios.request({
        url: fileUrl,
        method: 'post',
        data: formData,
        onUploadProgress: (progressEvent) => {
          const complete = ((progressEvent.loaded / progressEvent.total) * 100) | 0;
          // filelist[0].percent = complete
          setfileList([filelist]);
        },
      });
      // postRequest(fileUrl,{data:formData}).then(res=>{
      //   debugger
      // })
    },
  };

  const handleCancel = () => {
    setDeployVisible(false);
    setDeployEnv([]);
    onOperate('uploadImageEnd');
  };
  const queryProjectEnv = async (benchmarkEnvCode: any) => {
    setListLoading(true);
    await getRequest(queryProjectEnvList, { data: { benchmarkEnvCode, pageIndex: -1 } })
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

  let deployErrInfo: any[] = [];
  try {
    deployErrInfo = deployInfo.deployErrInfo ? JSON.parse(deployInfo.deployErrInfo) : [];
  } catch (e) {
    if (deployInfo.deployErrInfo) {
      deployErrInfo = [
        {
          subErrInfo: deployInfo.deployErrInfo,
          envCode: deployInfo.envs,
        },
      ];
    }
  }

  function goToJenkins(item: any) {
    let jenkinsUrl: any[] = [];
    try {
      jenkinsUrl = deployInfo.jenkinsUrl ? JSON.parse(deployInfo.jenkinsUrl) : [];
    } catch (e) {
      if (deployInfo.jenkinsUrl) {
        jenkinsUrl = [
          {
            subJenkinsUrl: deployInfo.jenkinsUrl,
            envCode: deployInfo.envs,
          },
        ];
      }
    }
    const data = jenkinsUrl.find((val) => val.envCode === item.envCode);
    if (data && data.subJenkinsUrl) {
      window.open(data.subJenkinsUrl, '_blank');
    }
  }

  return (
    <div className={rootCls}>
      <div className={`${rootCls}__right-top-btns`}>
        {/* {appData?.appType === 'backend' && envTypeCode === 'prod' && deployEnv?.indexOf('tt-his') !== -1 && (
          <Button type="primary" onClick={() => setRestartVisible(true)}>
            重启应用
          </Button>
        )} */}
        {envTypeCode === 'prod' && (
          <Button
            type="primary"
            onClick={() => {
              setDeployVisible(true);
              setUploading(false);
              setDeployEnv([]);
            }}
            icon={<UploadOutlined />}
          >
            离线部署
          </Button>
        )}

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
        {appData?.appType === 'backend' && envTypeCode !== 'prod' && (
          <Button type="primary" onClick={deployToMaster}>
            部署Master
          </Button>
        )}

        {envTypeCode !== 'prod' && (
          <Button type="primary" onClick={deployNext}>
            部署到下个环境
          </Button>
        )}

        {envTypeCode === 'prod' && appData?.appType === 'backend' && (
          <Button type="primary" danger onClick={handleCancelPublish}>
            取消发布
          </Button>
        )}
      </div>

      <Descriptions
        title="发布详情"
        labelStyle={{ color: '#5F677A', textAlign: 'right', whiteSpace: 'nowrap' }}
        contentStyle={{ color: '#000' }}
        column={4}
        bordered
      >
        <Descriptions.Item label="CRID" contentStyle={{ whiteSpace: 'nowrap' }}>
          {deployInfo?.id || '--'}
        </Descriptions.Item>
        <Descriptions.Item label="部署分支" span={appData?.appType === 'frontend' ? 1 : 2}>
          {deployInfo?.releaseBranch || '--'}
        </Descriptions.Item>
        {appData?.appType === 'frontend' && (
          <Descriptions.Item label="部署版本" contentStyle={{ whiteSpace: 'nowrap' }}>
            {deployInfo?.version || '--'}
          </Descriptions.Item>
        )}
        <Descriptions.Item label="发布环境">{envNames || '--'}</Descriptions.Item>
        <Descriptions.Item label="冲突分支" span={4}>
          {deployInfo?.conflictFeature || '--'}
        </Descriptions.Item>
        <Descriptions.Item label="合并分支" span={4}>
          {deployInfo?.features || '--'}
        </Descriptions.Item>
        {deployInfo?.deployErrInfo && deployErrInfo.length && (
          <Descriptions.Item label="部署错误信息" span={4} contentStyle={{ color: 'red' }}>
            <div>
              {deployErrInfo.map((errInfo) => (
                <div>
                  <span style={{ color: 'black' }}> {errInfo?.subErrInfo ? `${errInfo?.envCode}：` : ''}</span>
                  <a
                    style={{ color: 'red', textDecoration: 'underline' }}
                    onClick={() => {
                      if (errInfo?.subErrInfo.indexOf('请查看jenkins详情') !== -1) {
                        goToJenkins(errInfo);
                      }
                      if (errInfo?.subErrInfo.indexOf('请查看jenkins详情') === -1 && appData?.appType !== 'frontend') {
                        localStorage.setItem('__init_env_tab__', deployInfo?.envTypeCode);
                        history.push(
                          `/matrix/application/detail/deployInfo?appCode=${deployInfo?.appCode}&id=${appData?.id}`,
                        );
                      }
                    }}
                  >
                    {errInfo?.subErrInfo}
                  </a>
                  {appData?.appType !== 'frontend' && (
                    <span style={{ color: 'gray' }}> {errInfo?.subErrInfo ? '（点击跳转）' : ''}</span>
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
          <span>发布环境：</span>
          {/* <Radio.Group value={type} onChange={handleTypeChange}> */}
          {/* <Radio.Group  value={deployNextEnv} onChange={(v: any) => setDeployNextEnv(v)} options={nextEnvDataList}></Radio.Group> */}
          <Checkbox.Group value={deployNextEnv} onChange={(v: any) => setDeployNextEnv(v)} options={nextEnvDataList} />

          {/* {nextEnvDataList.map((item,index)=>{
            return(
              <Radio.Group  onChange={(v: any) => setDeployNextEnv(v)}  value={deployNextEnv}>
              <Radio key={index} value={item.value}  autoFocus >{item.label}</Radio>

            </Radio.Group>
            )
          })} */}
        </div>
      </Modal>

      {/* 部署到 master */}
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
          <Checkbox.Group
            value={deployEnv}
            onChange={(v: any) => {
              onOperate('uploadImageStart');
              setDeployEnv(v);
            }}
            options={envDataList || []}
          />
        </div>

        <div style={{ display: 'flex', marginTop: '12px' }} key={Math.random()}>
          <span>配置文件：</span>
          <Upload accept=".tgz" maxCount={1} {...uploadProps} fileList={filelist}>
            <Button icon={<UploadOutlined />} type="primary" ghost disabled={!deployEnv?.length}>
              离线部署
            </Button>
            <p style={{ paddingTop: 8, color: 'gray' }}>{uploading && '正在上传中请勿关闭弹窗...'}</p>
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
          <Form form={envProjectForm} layout="inline">
            <Form.Item
              label="基准环境:"
              name="benchmarkEnvCode"
              rules={[{ required: true, message: '请选择基准环境' }]}
            >
              <Select
                options={envDataSource}
                allowClear
                showSearch
                loading={loading}
                style={{ width: 140 }}
                onChange={selectEnvProject}
              ></Select>
            </Form.Item>
            <Form.Item label="项目环境:" name="envCode" rules={[{ required: true, message: '请选择项目环境' }]}>
              <Select
                style={{ width: 140 }}
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
