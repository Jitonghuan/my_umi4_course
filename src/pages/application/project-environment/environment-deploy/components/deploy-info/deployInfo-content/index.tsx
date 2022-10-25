/**
 * DeployInfoContent
 * @description 部署信息内容
 * @author muxi.jth
 * @create 2021-11-11 14:15
 */

import React, { useState, useContext, useEffect, useRef, useMemo } from 'react';
import { history } from 'umi';
import moment from 'moment';
import useInterval from '@/pages/application/application-detail/components/application-deploy/deploy-content/useInterval';
import { Button, Table, message, Popconfirm, Spin, Divider, Select, Tag, Modal, Form, Input } from 'antd';
import DetailContext from '../../../context';
import { useAppDeployInfo, useAppChangeOrder } from '../hooks';
import { postRequest } from '@/utils/request';
import { useListDeploymentList } from '../container-info/hook';
import { restartApp, rollbackApplication, restartApplication, queryAppOperate } from '@/pages/application/service';
import { listContainer, fileDownload, listEnvCluster, queryInstanceListApi } from './service';
import { useAppEnvCodeData } from '@/pages/application/hooks';
import { useDeployInfoData, useInstanceList, useDownloadLog, useDeleteInstance } from './hook';
import { getRequest } from '@/utils/request';
import RollbackModal from '../components/rollback-modal';
import { listAppEnvType } from '@/common/apis';
import { LIST_STATUS_TYPE } from './schema';
import DeploymentList from '../components/deployment-list';
import { OPERATE_TYPE } from './schema'
import './index.less';
const rootCls = 'deploy-content-Info';
export interface DeployContentProps {
  /** 当前页面是否激活 */
  isActive?: boolean;
  /** 环境参数 */
  // envTypeCode: string;
  // deployData:any
  /** 部署下个环境成功回调 */
  // onDeployNextEnvSuccess: () => void;
  intervalStop: () => void;
  intervalStart: () => void;
  viewLogEnv: string;
  type: string;
  viewLogEnvType: string;
  projectEnvCode: string;
  projectEnvName: string;
  // viewLogEnvType:string
}
export interface insStatusInfo {
  insName?: string;
  insIP?: string;
  insNode: string;
  image: string;
  insStatus: string;
}
type statusTypeItem = {
  color: string;
  text: string;
};
const STATUS_TYPE: Record<number, statusTypeItem> = {
  0: { text: '健康', color: 'error' },
  1: { text: '不健康', color: 'success' },
};

export default function DeployContent(props: DeployContentProps) {
  const { viewLogEnv, type, viewLogEnvType } = props;
  const [downloadLogform] = Form.useForm();
  const [isLogModalVisible, setIsLogModalVisible] = useState<boolean>(false);
  const [formInstance] = Form.useForm();
  const { appData, projectEnvCode, projectEnvName, benchmarkEnvCode } = useContext(DetailContext);
  const [appEnvCodeData, isLoading] = useAppEnvCodeData(appData?.appCode);
  const [envTypeData, setEnvTypeData] = useState<IOption[]>([]);
  const [envDatas, setEnvDatas] = useState<any[]>([]); //环境
  const [currentEnvData, setCurrentEnvData] = useState<string>(); //当前选中的环境；
  const [listEnvClusterData, setListEnvClusterData] = useState<any>();
  // const [isSucess, setIsSucess] = useState<boolean>(false);
  const [queryListContainer, setQueryListContainer] = useState<any[]>([]);
  const [deploymentLoading, deploymentSource, setDeploymentSource, getDeploymentEventList] = useListDeploymentList();
  const { intervalStop, intervalStart } = props;
  const envList = useMemo(() => appEnvCodeData['prod'] || [], [appEnvCodeData]);
  const [deployData, deployDataLoading, reloadDeployData] = useAppDeployInfo(currentEnvData, appData?.deploymentName);
  const { appCode } = appData || {};
  const [appOperateLog, setAppOperateLog] = useState<any>([]);

  const [appOperateLoading, setAppOperateLoading] = useState<boolean>(false);
  const [rollbackVisible, setRollbackVisible] = useState(false);
  const [changeOrderData, changeOrderDataLoading, reloadChangeOrderData] = useAppChangeOrder(
    currentEnvData,
    appData?.deploymentName,
  );
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
    queryData();
  }, [appCode]);
  const initEnvCode = useRef<any>('');
  const [deleteInstance] = useDeleteInstance();
  const [downloadLog] = useDownloadLog();
  const [instanceTableData, instanceloading, queryInstanceList, setInstanceTableData, setInstanceLoading] =
    useInstanceList(appData?.appCode, currentEnvData);

  const envClusterData = useRef();
  envClusterData.current = listEnvClusterData;

  //定义定时器方法
  const intervalFunc = () => {
    loadInfoData(initEnvCode.current)
      .then(() => {
        queryInstanceList(appData?.appCode, initEnvCode.current);
        getDeploymentEventList({ appCode, envCode: initEnvCode.current });
      })
      .catch((e: any) => {
        console.log('error happend in intervalFunc:', e);
      });
  };

  //引用定时器
  const { getStatus: getTimerStatus, handle: timerHandler } = useInterval(intervalFunc, 3000, {
    immediate: false,
  });

  // 进入页面加载环境和版本信息
  useEffect(() => {
    try {
      // if (type === 'viewLog_goBack') {
      //   setCurrentEnvData(viewLogEnv);
      //   initEnvCode.current = viewLogEnv;
      // } else {
      setCurrentEnvData(projectEnvCode);
      initEnvCode.current = projectEnvCode;
      // }
      // initEnvCode.current = projectEnvCode;

      formInstance.setFieldsValue({ envCode: initEnvCode.current });
      if (initEnvCode.current !== '') {
        let initLoadInfoData: any = [];
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
                    getDeploymentEventList({ appCode, envCode: initEnvCode.current });

                    if (result.data !== undefined && result.data.length !== 0 && result.data !== '') {
                      timerHandler('do', true);
                    } else {
                      timerHandler('stop');
                    }
                  }
                })
                .finally(() => {
                  setInstanceLoading(false);
                });
            } else {
              timerHandler('stop');
            }
          });
      }
      // });
    } catch (error) {
      message.warning(error);
    }
  }, []);

  //通过appCode和env查询环境信息
  // const selectAppEnv = () => {
  //   return getRequest(listAppEnv, { data: { appCode, envTypeCode: envTypeCode } });
  // };

  const queryData = () => {
    getRequest(listAppEnvType, {
      data: { appCode: appData?.appCode, isClient: false },
    }).then((result) => {
      const { data } = result || [];
      let next: any = [];
      (data || []).map((el: any) => {
        if (el?.typeCode === 'dev') {
          next.push({ ...el, label: el?.typeName, value: el?.typeCode, sortType: 1 });
        }
        if (el?.typeCode === 'test') {
          next.push({ ...el, label: el?.typeName, value: el?.typeCode, sortType: 2 });
        }
        if (el?.typeCode === 'pre') {
          next.push({ ...el, label: el?.typeName, value: el?.typeCode, sortType: 3 });
        }
        if (el?.typeCode === 'prod') {
          next.push({ ...el, label: el?.typeName, value: el?.typeCode, sortType: 4 });
        }
      });
      next.sort((a: any, b: any) => {
        return a.sortType - b.sortType;
      }); //升序
      setEnvTypeData(next);
    });
  };

  const loadInfoData = async (envCode: any, operateType?: boolean) => {
    await getRequest(listEnvCluster, { data: { envCode: envCode } }).then((result) => {
      if (result.success) {
        let data = result.data;
        setListEnvClusterData(data);
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
                getDeploymentEventList({ appCode, envCode: initEnvCode.current });
                if (result.data !== undefined && result.data.length !== 0) {
                  timerHandler('do', true);
                } else {
                  timerHandler('stop');
                }
                if (initEnvCode.current !== '') {
                  queryAppOperateLog(initEnvCode.current);
                }
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
  const [currentContainerName, setCurrentContainerName] = useState<string>('');
  const [currentInstName, setCurrentInstName] = useState<string>('');
  const [currentFilePath, setCurrentFilePath] = useState<string>('');
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
    // <ContentCard>
    <div className={rootCls}>
      <div className={`${rootCls}-body`}>
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
              scroll={{ y: window.innerHeight - 300 }}
            >
              <Table.Column
                title="名称"
                dataIndex="instName"
                width={140}
                render={(v, record) => (
                  <a
                    onClick={() => {
                      history.replace({
                        pathname: 'container-info',
                        search: `appCode=${appCode}&projectEnvCode=${currentEnvData}&projectEnvName=${projectEnvName}&benchmarkEnvCode=${benchmarkEnvCode}`
                        // query: {
                        //   appCode: appCode,
                        //   // envCode: currentEnvData,
                        //   projectEnvCode: currentEnvData,
                        //   projectEnvName: projectEnvName,
                        //   // viewLogEnvType: envTypeCode,
                        //   // initRecord:JSON.stringify(record)
                        // },
                      }, {
                        infoRecord: {
                          appCode: appCode,
                          // envCode: currentEnvData,
                          projectEnvName: projectEnvName,
                          projectEnvCode: currentEnvData,
                          // viewLogEnvType: envTypeCode,
                          infoRecord: record,
                          id: appData?.id,
                          benchmarkEnvCode: benchmarkEnvCode
                        }
                      });
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
                  width={330}
                  title="操作"
                  fixed="right"
                  render={(_, record: any) => (
                    <div className="action-cell">
                      <Button
                        size="small"
                        type="primary"
                        onClick={() =>
                          history.push(
                            {
                              pathname: '/matrix/application/environment-deploy/viewLog',
                              search: `appCode=${appData?.appCode}&projectEnvCode=${currentEnvData}&instName=${record?.instName}&projectEnvName=${projectEnvName}&optType=deployInfo&deploymentName=${appData?.deploymentName}&benchmarkEnvCode=${benchmarkEnvCode}`

                            }, {
                            infoRecord: record,
                          },


                          )
                        }
                      >
                        查看日志
                      </Button>
                      <Button
                        size="small"
                        type="primary"
                        onClick={() => {
                          history.push(
                            `/matrix/application/environment-deploy/loginShell?appCode=${appData?.appCode}&projectEnvCode=${currentEnvData}&instName=${record?.instName}&projectEnvName=${projectEnvName}&optType=deployInfo&deploymentName=${appData?.deploymentName}&benchmarkEnvCode=${benchmarkEnvCode}`,
                          );
                        }}
                      >
                        登陆shell
                      </Button>
                      <Button
                        size="small"
                        type="primary"
                        onClick={() => {
                          setIsLogModalVisible(true);
                          downloadLogform.setFieldsValue({ containerName: '', filePath: '' });
                          setCurrentInstName(record?.instName);
                          getContainerData(appData?.appCode, currentEnvData, record?.instName);
                        }}
                      >
                        文件下载
                      </Button>
                      <Popconfirm
                        title="确定要删除该信息吗？"
                        onConfirm={() => {
                          deleteInstance(appData?.appCode, currentEnvData, record.instName).then(() => {
                            queryInstanceList(appData?.appCode, currentEnvData);
                            queryAppOperateLog(currentEnvData);
                          });

                        }}
                      >
                        <Button size="small" type="default" >
                          删除
                        </Button>
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
                    <b>{item.operator}</b>
                  </p>
                  {/* <p>
                      <span>操作类型：</span>
                      <b>{item.operateType}</b>
                    </p> */}

                  <p>
                    <span>操作事件：</span>
                    <b>
                      <Tag color={OPERATE_TYPE[item.operateEvent?.toLowerCase()]?.color || "default"}>
                        {OPERATE_TYPE[item.operateEvent?.toLowerCase()]?.tagText || "--"}
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
                // window.open(`${fileDownload}?appCode=${appData?.appCode}&envCode=${currentEnvData}&instName=${currentInstName}&containerName=${currentContainerName}&filePath=${currentFilePath}`)
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

          // handleRollbackSubmit(); //回滚走的接口
          // reloadDeployData();
        }}
      />
    </div>
    // </ContentCard>
  );
}
