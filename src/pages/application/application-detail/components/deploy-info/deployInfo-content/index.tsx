/**
 * DeployInfoContent
 * @description 部署信息内容
 * @author muxi.jth
 * @create 2021-11-11 14:15
 */

import React, { useState, useContext, useCallback, useEffect, useRef, useMemo } from 'react';
import { history } from 'umi';
import { IProps } from '../../application-deploy/deploy-content/components/publish-content/types';
import { Button, Table, message, Popconfirm, Spin, Empty, Select, Tag, Modal, Form, Input } from 'antd';
import DetailContext from '@/pages/application/application-detail/context';
import { useAppDeployInfo, useAppChangeOrder } from '../hooks';
import { postRequest } from '@/utils/request';
import { restartApp, rollbackApplication } from '@/pages/application/service';
import { listContainer, fileDownload } from './service';
// import * as APIS from '@/pages/application/service';
import { useAppEnvCodeData } from '@/pages/application/hooks';
import { useDeployInfoData, useInstanceList, useDownloadLog, useDeleteInstance } from './hook';
import { listAppEnv } from '@/pages/application/service';
import { getRequest } from '@/utils/request';
import RollbackModal from '../components/rollback-modal';
import { listAppEnvType } from '@/common/apis';
import './index.less';
const rootCls = 'deploy-content-compo';

export interface DeployContentProps {
  /** 当前页面是否激活 */
  isActive?: boolean;
  /** 环境参数 */
  envTypeCode: string;
  // deployData:any
  /** 部署下个环境成功回调 */
  onDeployNextEnvSuccess: () => void;
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
  const [downloadLogform] = Form.useForm();
  const [isLogModalVisible, setIsLogModalVisible] = useState<boolean>(false);
  const [formInstance] = Form.useForm();
  const { appData } = useContext(DetailContext);
  const [appEnvCodeData, isLoading] = useAppEnvCodeData(appData?.appCode);
  const [envTypeData, setEnvTypeData] = useState<IOption[]>([]);
  const [envDatas, setEnvDatas] = useState<any[]>([]); //环境
  const [currentEnvData, setCurrentEnvData] = useState<string>(); //当前选中的环境；
  const [queryListContainer, setQueryListContainer] = useState<any[]>([]);
  const { envTypeCode, isActive, onDeployNextEnvSuccess } = props;
  const envList = useMemo(() => appEnvCodeData['prod'] || [], [appEnvCodeData]);
  const [deployData, deployDataLoading, reloadDeployData] = useAppDeployInfo(currentEnvData, appData?.deploymentName);
  const { appCode } = appData || {};
  const [rollbackVisible, setRollbackVisible] = useState(false);
  const [changeOrderData, changeOrderDataLoading, reloadChangeOrderData] = useAppChangeOrder(
    currentEnvData,
    appData?.deploymentName,
  );
  useEffect(() => {
    if (!appCode) return;
  }, [appCode]);
  let initEnvCode = '';

  // 进入页面加载环境和版本信息
  useEffect(() => {
    try {
      selectAppEnv().then((result: any) => {
        const dataSources = result.data?.map((n: any) => ({
          value: n?.envCode,
          label: n?.envName,
          data: n,
        }));

        setEnvDatas(dataSources);
        initEnvCode = dataSources[0]?.value;
        setCurrentEnvData(dataSources[0]?.value);
        formInstance.setFieldsValue({ envCode: initEnvCode });
        loadInfoData(initEnvCode);
        queryInstanceList(appData?.appCode, initEnvCode);
      });
    } catch (error) {
      message.warning(error);
    }
  }, [envTypeCode]);
  const [listEnvClusterData, loadInfoData, deployInfoLoading] = useDeployInfoData(initEnvCode);
  const [deleteInstance] = useDeleteInstance();
  const [downloadLog] = useDownloadLog();
  const [instanceTableData, instanceloading, queryInstanceList] = useInstanceList(appData?.appCode, currentEnvData);
  //通过appCode和env查询环境信息
  const selectAppEnv = () => {
    return getRequest(listAppEnv, { data: { appCode, envTypeCode: envTypeCode } });
  };

  useEffect(() => {
    queryData();
  }, []);
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

  //改变环境下拉选择后查询结果
  //   let getEnvCode: any;
  const changeEnvCode = (getEnvCodes: string) => {
    // getEnvCode = getEnvCodes;
    setCurrentEnvData(getEnvCodes);
    loadInfoData(getEnvCodes);
    queryInstanceList(appData?.appCode, getEnvCodes);
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

  const downLogFile = (values: any) => {
    console.log('currentInstName', currentInstName);

    downloadLog(appData?.appCode, currentEnvData, currentInstName, values?.containerName, values?.filePath);
    setIsLogModalVisible(false);
  };

  //

  // 确认回滚
  const handleRollbackSubmit = () => {
    postRequest(rollbackApplication, {
      data: {
        appCode: appData?.appCode,
        envCode: currentEnvData,
      },
    })
      .then((res: any) => {
        if (res.sucess) {
          message.success('应用回滚完成！');
        }
      })
      .finally(() => {
        setRollbackVisible(false);
      });
    //  postRequest(rollbackApplication, {
    //   data: {
    //     appCode: appData?.appCode,
    //     envCode: props.envCode,
    //     image: versionItem?.image,
    //     appId: versionItem?.appId,
    //     packageVersion: versionItem?.packageVersion,
    //     packageVersionId: versionItem?.packageVersionId,
    //     owner: appData?.owner,
  };

  return (
    <div className={rootCls}>
      <div className={`${rootCls}-body`}>
        <div className="chooseEnv">
          <Form form={formInstance} layout="inline">
            <h3>选择环境：</h3>
            <Form.Item name="envCode">
              <Select placeholder="请选择" style={{ width: 140 }} options={envDatas} onChange={changeEnvCode} />
            </Form.Item>
          </Form>
        </div>
        {/* <Divider>分割线</Divider> */}
        <div className="tab-content section-group">
          <section className="section-left">
            <div className="section-clusterInfo">
              <Spin spinning={deployInfoLoading}>
                <div className="clusterInfo">
                  <h3>集群信息</h3>{' '}
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
              </Spin>
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
                <Popconfirm
                  title={`确定重启 ${appData?.appName}吗？`}
                  onConfirm={async () => {
                    await restartApp({
                      appCode,
                      envCode: currentEnvData,
                      appCategoryCode: appData?.appCategoryCode,
                    });
                    message.success('操作成功！');
                  }}
                >
                  <Button type="primary" ghost>
                    重启
                  </Button>
                </Popconfirm>
                <Button
                  type="default"
                  danger
                  onClick={() => {
                    setRollbackVisible(true);
                  }}
                >
                  发布回滚
                </Button>
              </div>
            </div>

            <Table
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
                render={(v, record) => <span style={{ fontSize: 10 }}>{v}</span>}
              />
              <Table.Column
                title="IP"
                dataIndex="instIP"
                width={100}
                render={(v, record) => <span style={{ fontSize: 10 }}>{v}</span>}
              />
              <Table.Column
                title="状态"
                dataIndex="instStatus"
                width={100}
                render={(status, record) => {
                  return status === 'Running' ? (
                    <Tag color="green">Running</Tag>
                  ) : status === 'Initialization' ? (
                    <Tag color="volcano">Initialization</Tag>
                  ) : null;
                }}
              />
              <Table.Column
                title="镜像"
                dataIndex="image"
                width={260}
                render={(v, record) => <span style={{ fontSize: 10 }}>{v}</span>}
              />
              <Table.Column
                title="节点IP"
                dataIndex="instNode"
                width={100}
                render={(v, record) => <span style={{ fontSize: 10 }}>{v}</span>}
              />
              <Table.Column
                width={330}
                title="操作"
                fixed="right"
                render={(_, record: any) => (
                  <div className="action-cell">
                    <Button
                      size="small"
                      type="primary"
                      onClick={() => {
                        window.open(
                          `/matrix/application/detail/viewLog?appCode=${appData?.appCode}&envCode=${currentEnvData}&instName=${record?.instName}`,
                        );
                      }}
                    >
                      查看日志
                    </Button>
                    <Button
                      size="small"
                      type="primary"
                      onClick={() => {
                        window.open(
                          `/matrix/application/detail/loginShell?appCode=${appData?.appCode}&envCode=${currentEnvData}&instName=${record?.instName}`,
                        );
                      }}
                    >
                      登陆shell
                    </Button>
                    {/* downloadLog */}
                    <Button
                      size="small"
                      type="primary"
                      onClick={() => {
                        setIsLogModalVisible(true);
                        setCurrentInstName(record?.instName);
                        getContainerData(appData?.appCode, currentEnvData, record?.instName);
                      }}
                    >
                      文件下载
                    </Button>
                    <Popconfirm
                      title="确定要删除该信息吗？"
                      onConfirm={() => {
                        deleteInstance(appData?.appCode, currentEnvData, record.instName);
                      }}
                    >
                      <Button size="small" type="default" danger style={{ color: 'red' }}>
                        删除
                      </Button>
                    </Popconfirm>
                  </div>
                )}
              />
            </Table>
          </section>
          <section className="section-right1">
            <h3>操作记录</h3>
            <div className="section-inner">
              {changeOrderDataLoading ? (
                <div className="block-loading">
                  <Spin />
                </div>
              ) : null}
              {changeOrderData.map((item, index) => (
                <div className="change-order-item" key={index}>
                  <p>
                    <span>时间：</span>
                    <b>{item.createTime}</b>
                  </p>
                  <p>
                    <span>操作人：</span>
                    <b>{item.finishTime}</b>
                  </p>
                  <p>
                    <span>操作类型：</span>
                    <b>{item.coType}</b>
                  </p>
                  <p>
                    <span>操作结果：</span>
                    <b>{item.changeOrderDescription}</b>
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
        <Modal
          title="下载日志文件"
          visible={isLogModalVisible}
          footer={null}
          onCancel={() => setIsLogModalVisible(false)}
        >
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
                // target="_blank"
                onClick={() => {
                  setCurrentFilePath(downloadLogform.getFieldValue('filePath'));
                  message.info('日志开始下载');
                }}
                href={`${fileDownload}?appCode=${appData?.appCode}&envCode=${currentEnvData}&instName=${currentInstName}&containerName=${currentContainerName}&filePath=${currentFilePath}`}
              >
                提交
              </Button>
            </Form.Item>
          </Form>
        </Modal>
        <RollbackModal
          visible={rollbackVisible}
          envCode={currentEnvData}
          onClose={() => setRollbackVisible(false)}
          onSave={() => {
            reloadChangeOrderData(); //刷新操作记录信息
            queryInstanceList(appData?.appCode, currentEnvData); //刷新表格信息
            handleRollbackSubmit(); //回滚走的接口
            // reloadDeployData();
          }}
        />
      </div>
    </div>
  );
}
