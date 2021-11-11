/**
 * DeployInfoContent
 * @description 部署信息内容
 * @author muxi.jth
 * @create 2021-11-11 14:15
 */

import React, { useState, useContext, useCallback, useEffect, useRef, useMemo } from 'react';
import { Tabs, Button, Table, message, Popconfirm, Spin, Empty, Select } from 'antd';
import DetailContext from '@/pages/application/application-detail/context';
import { useAppDeployInfo, useAppChangeOrder } from '../hooks';
import { postRequest } from '@/utils/request';
import * as APIS from '@/pages/application/service';
import { useAppEnvCodeData } from '@/pages/application/hooks';
import { queryDeployList, queryFeatureDeployed, queryApplicationStatus } from '@/pages/application/service';
import { DeployInfoVO, IStatusInfoProps } from '@/pages/application/application-detail/types';
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
  /** 部署下个环境成功回调 */
  onDeployNextEnvSuccess: () => void;
}

export default function DeployContent(props: DeployContentProps) {
  const { appData } = useContext(DetailContext);
  const [appEnvCodeData, isLoading] = useAppEnvCodeData(appData?.appCode);
  const [envTypeData, setEnvTypeData] = useState<IOption[]>([]);
  const [envDatas, setEnvDatas] = useState<any[]>([]); //环境
  const { envTypeCode, isActive, onDeployNextEnvSuccess } = props;
  const envList = useMemo(() => appEnvCodeData['prod'] || [], [appEnvCodeData]);
  const [deployData, deployDataLoading, reloadDeployData] = useAppDeployInfo(
    // currEnvCode,
    appData?.deploymentName,
  );
  const { appCode } = appData || {};
  const [rollbackVisible, setRollbackVisible] = useState(false);
  const [changeOrderData, changeOrderDataLoading, reloadChangeOrderData] = useAppChangeOrder(
    // currEnvCode,
    appData?.deploymentName,
  );

  //   useEffect(() => {
  //     intervalRef.current = setInterval(() => {
  //       reloadDeployData(false);
  //       reloadChangeOrderData(false);
  //     }, 3000);

  //     return () => {
  //       clearInterval(intervalRef.current);
  //     };
  //   }, [currEnvCode, appData]);

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
  // 重启机器
  const handleRestartItem = useCallback(
    async (record: IStatusInfoProps) => {
      await postRequest(APIS.restartApplication, {
        data: {
          deploymentName: appData?.deploymentName,
          envCode: record.envCode,
          eccid: record?.eccid,
          owner: appData?.owner,
        },
      });

      message.success('操作成功！');
      reloadDeployData();
      reloadChangeOrderData();
    },
    [appData], //currEnvCode
  );

  //改变环境下拉选择后查询结果
  let getEnvCode: any;
  const changeEnvCode = (getEnvCodes: string) => {
    getEnvCode = getEnvCodes;
  };
  return (
    <div className={rootCls}>
      <div className={`${rootCls}-body`}>
        <div>
          <Select placeholder="请选择" style={{ width: 140 }} options={envDatas} onChange={changeEnvCode} />
        </div>
        <div className="tab-content section-group">
          <section className="section-left">
            <div className="table-caption">
              <div className="caption-left">
                <h3>实例列表：</h3>
              </div>
              <div className="caption-right">
                <Popconfirm title={`确定重启吗？`}>
                  <Button size="small" type="primary" ghost>
                    重启
                  </Button>
                </Popconfirm>
                <Button type="default" danger onClick={() => setRollbackVisible(true)}>
                  发布回滚
                </Button>
              </div>
            </div>
            <Table
              // dataSource={deployData}
              // loading={deployDataLoading}
              bordered
              pagination={false}
              scroll={{ y: window.innerHeight - 340 }}
            >
              <Table.Column title="名称" dataIndex="envName" />
              <Table.Column title="IP" dataIndex="ip" />
              <Table.Column title="节点" dataIndex="appStateName" />
              <Table.Column title="镜像" dataIndex="appStateName" />
              <Table.Column title="状态" dataIndex="taskStateName" />
              <Table.Column
                title="操作"
                render={(_, record: IStatusInfoProps) => (
                  <div className="action-cell">
                    <Popconfirm title={`确定重启 ${record.ip} 吗？`} onConfirm={() => handleRestartItem(record)}>
                      <Button size="small" type="primary" ghost loading={record.taskState === 1}>
                        重启
                      </Button>
                    </Popconfirm>
                    <Button onClick={() => {}}>文件下载</Button>
                  </div>
                )}
                width={100}
              />
            </Table>
          </section>
          <section className="section-right">
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
        <RollbackModal
          visible={rollbackVisible}
          // envCode={currEnvCode}
          onClose={() => setRollbackVisible(false)}
          // onSave={() => {
          //     setRollbackVisible(false);
          //     reloadChangeOrderData();
          //     reloadDeployData();
          // }}
        />
      </div>
    </div>
  );
}
