/**
 * DeployInfoContent
 * @description 部署信息内容
 * @author muxi.jth
 * @create 2021-11-11 14:15
 */

import React, { useState, useContext, useEffect, useRef} from 'react';
import { history } from 'umi';
import moment from 'moment';
import useInterval from '@/pages/application/application-detail/components/application-deploy/deploy-content/useInterval';
import { Button, Table, message, Popconfirm, Spin, Select, Tag, Modal, Form, Input, Divider } from 'antd';
import DetailContext from '@/pages/application/application-detail/context';
import { postRequest } from '@/utils/request';
import { restartApp, restartApplication, queryAppOperate } from '@/pages/application/service';
import { getDeploymentEventListMethods } from '../container-info/hook';
import { listContainer, fileDownload, listEnvCluster, queryInstanceListApi} from './service';
import { useAppEnvCodeData } from '@/pages/application/hooks';
import { useDeleteInstance } from './hook';
import { listAppEnv } from '@/pages/application/service';
import { getRequest } from '@/utils/request';
import RollbackModal from '../components/rollback-modal';
import { LIST_STATUS_TYPE } from './schema';
import DeploymentList from '../components/deployment-list';
import { DeployContentProps } from './type';
import {OPERATE_TYPE} from './schema'
import './index.less';
const rootCls = 'deploy-content-compo';

export default function DeployContent(props: DeployContentProps) {
  const { viewLogEnv, type, viewLogEnvType } = props;
  const { envTypeCode, intervalStop, intervalStart } = props;
  const [downloadLogform] = Form.useForm();
  const [isLogModalVisible, setIsLogModalVisible] = useState<boolean>(false);
  const [formInstance] = Form.useForm();
  const { appData } = useContext(DetailContext);
  const [appEnvCodeData, isLoading] = useAppEnvCodeData(appData?.appCode);
  const [envDatas, setEnvDatas] = useState<any[]>([]); //环境
  const [deploymentSource, setDeploymentSource] = useState<any[]>([]);
  const [currentEnvData, setCurrentEnvData] = useState<string>(''); //当前选中的环境；
  const [currentContainerName, setCurrentContainerName] = useState<string>('');
  const [currentInstName, setCurrentInstName] = useState<string>('');
  const [currentFilePath, setCurrentFilePath] = useState<string>('');
  const [listEnvClusterData, setListEnvClusterData] = useState<any>();
  const [queryListContainer, setQueryListContainer] = useState<any[]>([]);
  const initEnvCode = useRef<string>('');
  const [deleteInstance] = useDeleteInstance();
  const [instanceTableData, setInstanceTableData] = useState<any>();
  const [instanceloading, setInstanceLoading] = useState<boolean>(false);
  const envClusterData = useRef();
  envClusterData.current = listEnvClusterData;
  const { appCode } = appData || {};
  const [appOperateLog, setAppOperateLog] = useState<any>([]);
  const [appOperateLoading, setAppOperateLoading] = useState<boolean>(false);
  const [rollbackVisible, setRollbackVisible] = useState(false);
  const [deploymentLoading, setDeploymentLoading] = useState(false);
  const queryAppOperateLog = (envCodeParam: any) => {
    getRequest(queryAppOperate, { data: { appCode, envCode: envCodeParam } })
      .then((resp) => {
        setAppOperateLoading(true);
        if (resp.success) {
          setAppOperateLog(resp?.data);
        }
      })
      .finally(() => {
        setAppOperateLoading(false);
      });
  };
  useEffect(() => {
    if (!appCode) return;
  }, [appCode]);

  const getDeploymentEventListInfo = (params: { appCode: any; envCode: string }) => {
    setDeploymentLoading(true);
    getDeploymentEventListMethods(params)
      .then((res) => {
        setDeploymentSource(res);
        if (res.length == 0) {
          getDeploymentTimerHandler('stop');
        }
      })
      .finally(() => {
        setDeploymentLoading(false);
      });
  };

  const queryInstanceList = async (appCode: any, envCode: any) => {
    getRequest(queryInstanceListApi, { data: { appCode, envCode } })
      .then((result) => {
        if (result.success) {
          setInstanceLoading(true);
          let data = result.data;
          setInstanceTableData(data);
        } else {
          timerHandler('stop');
          return;
        }
      })
      .finally(() => {
        setInstanceLoading(false);
      });
  };
  //定义定时器方法
  const intervalFunc = () => {
    if (initEnvCode.current) {
      loadInfoData(initEnvCode.current)
        .then(() => {
          queryInstanceList(appData?.appCode, initEnvCode.current);
        })
        .catch((e: any) => {
          console.log('error happend in intervalFunc:', e);
        });
    }
  };

  const deploymentIntervalFunc = () => {
    if (initEnvCode.current) {
      getDeploymentEventListInfo({ appCode, envCode: initEnvCode.current });
    }
  };

  //引用定时器
  const { getStatus: getTimerStatus, handle: timerHandler } = useInterval(intervalFunc, 3000, {
    immediate: false,
  });
  //引用定时器
  const { getStatus: getDeploymentStatus, handle: getDeploymentTimerHandler } = useInterval(
    deploymentIntervalFunc,
    10000,
    {
      immediate: false,
    },
  );

  // 进入页面加载环境和版本信息
  useEffect(() => {
    try {
      if (type === 'viewLog_goBack' && viewLogEnvType == envTypeCode) {
        selectAppEnv().then((result: any) => {
          if (result.success) {
            if (result.data.length === 0) {
              return;
            }
            const dataSources = result.data?.map((n: any) => ({
              value: n?.envCode,
              label: n?.envName,
              data: n,
            }));
            setEnvDatas(dataSources);
            formInstance.setFieldsValue({ envCode: viewLogEnv });
            initEnvCode.current = viewLogEnv;
            setCurrentEnvData(viewLogEnv);
            if (!viewLogEnv) {
              getDeploymentTimerHandler('stop');
            }

            if (viewLogEnv) {
              loadInfoData(viewLogEnv).then(() => {
                queryAppOperateLog(viewLogEnv);
                getRequest(queryInstanceListApi, { data: { appCode: appData?.appCode, envCode: initEnvCode.current } })
                  .then((result) => {
                    if (result.success) {
                      setInstanceLoading(true);
                      let data = result.data;
                      setInstanceTableData(data);

                      if (result.data !== undefined && result.data.length !== 0 && result.data !== '') {
                        getDeploymentEventListInfo({ appCode, envCode: initEnvCode.current });
                        timerHandler('do', true);
                      } else {
                        timerHandler('stop');

                        getDeploymentTimerHandler('stop');
                      }
                    } else {
                      timerHandler('stop');
                      getDeploymentTimerHandler('stop');
                      return;
                    }
                  })
                  .finally(() => {
                    setInstanceLoading(false);
                  });
              });
            }
          } else {
            message.warning('环境获取失败！');
            return;
          }
        });
      } else {
        selectAppEnv().then((result: any) => {
          if (result.success) {
            if (result.data.length === 0) {
              return;
            }
            const dataSources = result.data?.map((n: any) => ({
              value: n?.envCode,
              label: n?.envName,
              data: n,
            }));
            setEnvDatas(dataSources);
            initEnvCode.current = dataSources[0]?.value;
            setCurrentEnvData(dataSources[0]?.value);
            formInstance.setFieldsValue({ envCode: initEnvCode.current });

            if (!initEnvCode.current) {
              getDeploymentTimerHandler('stop');
            }
            if (initEnvCode.current) {
              let initLoadInfoData: any = [];
              // getDeploymentEventListInfo({ appCode, envCode: initEnvCode.current });
              getRequest(listEnvCluster, { data: { envCode: initEnvCode.current } })
                .then((result) => {
                  if (result.success) {
                    initLoadInfoData = result.data;
                    setListEnvClusterData(initLoadInfoData);
                  }
                })
                .then(() => {
                  if (initLoadInfoData?.length !== 0) {
                    queryAppOperateLog(initEnvCode.current);
                    getRequest(queryInstanceListApi, {
                      data: { appCode: appData?.appCode, envCode: initEnvCode.current },
                    })
                      .then((result) => {
                        if (result.success) {
                          setInstanceLoading(true);
                          let data = result.data;
                          setInstanceTableData(data);

                          if (result.data !== undefined && result.data.length !== 0 && result.data !== '') {
                            getDeploymentEventListInfo({ appCode, envCode: initEnvCode.current });
                            timerHandler('do', true);
                          } else {
                            timerHandler('stop');
                            getDeploymentTimerHandler('stop');
                          }
                        } else {
                          timerHandler('stop');
                          getDeploymentTimerHandler('stop');
                          return;
                        }
                      })
                      .finally(() => {
                        setInstanceLoading(false);
                      });
                  } else {
                    timerHandler('stop');
                    getDeploymentTimerHandler('stop');
                  }
                });
            }
          } else {
            message.warning('环境获取失败！');
            return;
          }
        });
      }
    } catch (error) {
      message.warning(error);
    }
  }, []);

  //通过appCode和env查询环境信息
  const selectAppEnv = () => {
    return getRequest(listAppEnv, {
      data: { appCode, envTypeCode: envTypeCode, proEnvType: 'benchmark', envModel: 'currency-deploy' },
    });
  };
  const loadInfoData = async (envCode: any, operateType?: boolean) => {
    await getRequest(listEnvCluster, { data: { envCode: envCode } }).then((result) => {
      if (result.success) {
        let data = result.data;
        setListEnvClusterData(data);
        if (!data.clusterType || !data.clusterName) {
          return;
        }
      } else {
        return;
      }
    });
  };
  //改变环境下拉选择后查询结果
  let clusterInfoData: any;
  const changeEnvCode = async (envCode: string) => {
    timerHandler('stop');
    setCurrentEnvData(envCode);
    initEnvCode.current = envCode;
    setListEnvClusterData({});
    await getRequest(listEnvCluster, { data: { envCode: envCode } })
      .then((result) => {
        if (result.success) {
          clusterInfoData = result.data;
          setListEnvClusterData(clusterInfoData);
        }
      })
      .then(() => {
        setInstanceTableData([]); //重置实例列表数据
        setDeploymentSource([]);
        if (clusterInfoData) {
          getRequest(queryInstanceListApi, { data: { appCode: appData?.appCode, envCode: envCode } })
            .then((result) => {
              if (result.success) {
                setInstanceLoading(true);
                let data = result.data;
                setInstanceTableData(data);

                if (result.data !== undefined && result.data.length !== 0) {
                  getDeploymentEventListInfo({ appCode, envCode: initEnvCode.current });
                  timerHandler('do', true);
                } else {
                  timerHandler('stop');
                }
                if (initEnvCode.current !== '') {
                  queryAppOperateLog(initEnvCode.current);
                  // getDeploymentEventListInfo({ appCode, envCode: initEnvCode.current });
                }
              } else {
                timerHandler('stop');
                return;
              }
            })
            .finally(() => {
              setInstanceLoading(false);
            })
            .catch(() => {
              setInstanceTableData([]);
              setDeploymentSource([]);
            });
        }
      })
      .catch(() => {
        setListEnvClusterData([]);
        setInstanceTableData([]);
        setDeploymentSource([]);
      });
  };
  //加载容器信息

  const getContainerData = async (appCode: any, envCode: any, instName: string) => {
    getRequest(listContainer, { data: { appCode, envCode, instName } }).then((result) => {
      let data = result.data;
      if (result.success) {
        const listContainer = data.map((item: any) => ({
          value: item?.containerName,
          label: item?.containerName,
        }));
        setQueryListContainer(listContainer);
      }
    });
  };
  const selectListContainer = (getContainer: string) => {
    setCurrentContainerName(getContainer);
  };

  const restartEnsure = async () => {
    if (listEnvClusterData?.clusterType === 'k8s') {
      await restartApp({
        appCode,
        envCode: currentEnvData,
        appCategoryCode: appData?.appCategoryCode,
      }).then((res) => {
        if (res.success) {
          message.success('操作成功！');
        }
        queryAppOperateLog(currentEnvData);
        timerHandler('do', true);
      });
    } else if (listEnvClusterData?.clusterType === 'vm') {
      await postRequest(restartApplication, {
        data: {
          deploymentName: appData?.deploymentName,
          envCode: currentEnvData,
          // eccid: record?.eccid,
          appCode,
          owner: appData?.owner,
        },
      }).then(() => {
        message.success('操作成功！');
        // reloadDeployData();
        queryAppOperateLog(currentEnvData);
        timerHandler('do', true);
      });
    } else {
      message.info('不存在集群类型！');
    }
  };

  return (
    <div className={rootCls}>
      <div className={`${rootCls}-body`}>
        <div className="chooseEnv">
          <Form form={formInstance} layout="inline">
            <h3>选择环境：</h3>
            <Form.Item name="envCode">
              <Select placeholder="请选择" style={{ width: 240 }} options={envDatas} onChange={changeEnvCode} />
            </Form.Item>
          </Form>
        </div>

        <div className="tab-content section-group">
          <section className="section-left">
            <div className="section-clusterInfo">
              <div className="clusterInfo">
                <h3>集群信息</h3>
              </div>
              <div className="clusterInfo">
                <span>
                  集群类型:<Tag>{listEnvClusterData?.clusterType}</Tag>
                </span>
                <span style={{ paddingLeft: 20 }}>
                  集群名称：<Tag>{listEnvClusterData?.clusterName}</Tag>
                </span>
                <span style={{ paddingLeft: 20 }}>
                  集群状态：
                  {listEnvClusterData?.clusterStatus === 'health' ? (
                    <Tag color="success">健康</Tag>
                  ) : listEnvClusterData?.clusterStatus === 'unhealth' ? (
                    <Tag color="error">不健康</Tag>
                  ) : null}
                </span>
              </div>
            </div>
            <div className="table-caption">
              <div className="caption-left">
                <h3>实例列表：</h3>
              </div>
              {/* <Popconfirm title={`确定重启 ${record.ip} 吗？`} onConfirm={() => handleRestartItem(record)}>
                         <Button size="small" type="primary" ghost loading={record.taskState === 1}>
                           重启
                         </Button>
                       </Popconfirm> */}
              <div className="caption-right">
                <Popconfirm title={`确定重启 ${appData?.appName}吗？`} onConfirm={restartEnsure}>
                  <Button >
                    重启
                  </Button>
                </Popconfirm>
                {currentEnvData && currentEnvData !== 'zy-prd' && (
                  <Button
                    type="default"
                    danger
                    onClick={() => {
                      setRollbackVisible(true);
                      intervalStop();
                      timerHandler('stop');
                    }}
                  >
                    发布回滚
                  </Button>
                )}
              </div>
            </div>

            <Table
              className="deploy-info-table"
              dataSource={instanceTableData}
              loading={instanceloading}
              bordered
              pagination={false}
              scroll={{ y: window.innerHeight - 340 }}
            >
              <Table.Column
                title="名称"
                dataIndex="instName"
                width={140}
                render={(v, record) => (
                  <a
                    onClick={() => {
                      history.push({
                          pathname: 'container-info',
                          search:`appCode=${appCode}&envCode=${currentEnvData}&viewLogEnvType=${envTypeCode}`
                      },{
                        infoRecord:{ appCode: appCode,
                          envCode: currentEnvData,
                          viewLogEnvType: envTypeCode,
                          infoRecord: record,
                          id: appData?.id,
                       } });
                    }}
                  >
                    {v}
                  </a>
                )}
              />
              <Table.Column
                title="IP"
                dataIndex="instIP"
                width={100}
                render={(v, record) => <span>{v || '--'}</span>}
              />
              {/* 状态枚举  Pending Running Succeeded Failed Initializing NotReady Unavailable  Scheduling Removing*/}
              <Table.Column
                title="状态"
                dataIndex="instStatus"
                width={100}
                render={(status, record) => {
                  return (
                    <Tag color={LIST_STATUS_TYPE[status]?.color || 'default'}>
                      {LIST_STATUS_TYPE[status]?.text || status}
                    </Tag>
                  );
                }}
              />
              <Table.Column
                title="重启次数"
                dataIndex="restartCount"
                width={100}
                render={(v, record) => <span>{v || '0'}</span>}
              />
              {listEnvClusterData?.clusterType !== 'vm' ? (
                <Table.Column
                  title="镜像"
                  dataIndex="image"
                  width={260}
                  render={(v, record) => <span style={{ fontSize: 10 }}>{v}</span>}
                />
              ) : null}

              <Table.Column
                title="节点IP"
                dataIndex="instNode"
                width={100}
                render={(v, record) => <span>{v || '--'}</span>}
              />
              {listEnvClusterData?.clusterType !== 'vm' ? (
                <Table.Column
                  title="创建时间"
                  dataIndex="createTime"
                  width={110}
                  render={(v, record) => <span>{v}</span>}
                />
              ) : null}

              {listEnvClusterData?.clusterType !== 'vm' ? (
                <Table.Column
                  width={260}
                  title="操作"
                  fixed="right"
                  render={(_, record: any) => (
                    <div className="action-cell">
                      <a
                        onClick={() =>
                          history.push(
                            {
                              pathname: '/matrix/application/detail/viewLog',
                              search:`appCode=${appData?.appCode}&envCode=${currentEnvData}&instName=${record?.instName}&viewLogEnvType=${envTypeCode}&optType=deployInfo&deploymentName=${appData?.deploymentName}`},
                              {
                                infoRecord: record,
                              }
                          )
                        }
                      >
                        查看日志
                      </a>
                      <a
                        onClick={() => {
                          history.push(
                            `/matrix/application/detail/loginShell?appCode=${appData?.appCode}&envCode=${currentEnvData}&viewLogEnvType=${envTypeCode}&instName=${record?.instName}&optType=deployInfo&deploymentName=${appData?.deploymentName}`,
                            {
                              infoRecord: record,
                            }
                          );
                        }}
                      >
                        登陆shell
                      </a>
                      <a
                        onClick={() => {
                          setIsLogModalVisible(true);
                          downloadLogform.setFieldsValue({ containerName: '', filePath: '' });
                          setCurrentInstName(record?.instName);
                          getContainerData(appData?.appCode, currentEnvData, record?.instName);
                        }}
                      >
                        文件下载
                      </a>
                      <Popconfirm
                        title="确定要删除该信息吗？"
                        onConfirm={() => {
                          deleteInstance(appData?.appCode, currentEnvData, record.instName).then(()=>{
                            queryInstanceList(appData?.appCode, currentEnvData);
                            queryAppOperateLog(currentEnvData);
                          });
                          
                        }}
                      >
                        <a style={{color:"red"}}>
                          删除
                        </a>
                      </Popconfirm>
                    </div>
                  )}
                />
              ) : null}
            </Table>

            <Divider />
            <DeploymentList dataSource={deploymentSource} loading={deploymentLoading} />
          </section>
          <section className="section-right1">
            <h3>操作记录</h3>

            <div className="section-inner">
              {appOperateLoading ? (
                <div className="block-loading">
                  <Spin />
                </div>
              ) : null}
              {appOperateLog?.map((item: any, index: any) => (
                <div className="change-order-item" key={index}>
                  <p>
                    <span>时间：</span>
                    <b>{moment(item?.operateTime).format('YYYY-MM-DD HH:mm:ss')}</b>
                  </p>
                  <p>
                    <span>操作人：</span>
                    <b>{item?.operator}</b>
                  </p>
                  {/* <p>
                     <span>操作类型：</span>
                     <b>{item.operateType}</b>
                   </p> */}

                  <p>
                    <span>操作事件：</span>
                    <b>
                      <Tag color= {OPERATE_TYPE[item.operateEvent?.toLowerCase()]?.color||"default"}>
                        {OPERATE_TYPE[item.operateEvent?.toLowerCase()]?.tagText||"--"}
                      </Tag>
                    </b>
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
      <Modal title="下载文件" visible={isLogModalVisible} footer={null} onCancel={() => setIsLogModalVisible(false)}>
        <Form form={downloadLogform} labelCol={{ flex: '120px' }}>
          <Form.Item label="容器：" name="containerName" rules={[{ required: true, message: '这是必填项' }]}>
            <Select style={{ width: 140 }} options={queryListContainer} onChange={selectListContainer}></Select>
          </Form.Item>
          <Form.Item label="文件路径：" name="filePath" rules={[{ required: true, message: '这是必填项' }]}>
            <Input placeholder="请输入文件绝对路径" style={{ width: 200 }}></Input>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6 }}>
            <Button
              type="primary"
              htmlType="submit"
              className="downloadButton"
              onClick={() => {
                setCurrentFilePath(downloadLogform.getFieldValue('filePath'));
                message.info('文件开始下载');
                setTimeout(() => {
                  setIsLogModalVisible(false);
                }, 100);
              }}
              href={`${fileDownload}?appCode=${appData?.appCode}&envCode=${currentEnvData}&instName=${currentInstName}&containerName=${currentContainerName}&filePath=${currentFilePath}`}
            >
              下载
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <RollbackModal
        visible={rollbackVisible}
        envCode={currentEnvData}
        onClose={() => {
          setRollbackVisible(false);
          timerHandler('do', true);
          intervalStart();
        }}
        onSave={() => {
          queryInstanceList(appData?.appCode, currentEnvData); //刷新表格信息
          setRollbackVisible(false);
          queryAppOperateLog(currentEnvData);
          timerHandler('do', true);
        }}
      />
    </div>
  );
}
