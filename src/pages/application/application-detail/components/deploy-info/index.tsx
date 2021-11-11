// 部署信息
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/18 09:45

import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useRef,
  useLayoutEffect,
  useMemo,
  ReactNode,
} from 'react';
import { Tabs, Button, Table, message, Popconfirm, Spin, Empty, Select } from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import DetailContext from '@/pages/application/application-detail/context';
import { postRequest } from '@/utils/request';
import { IStatusInfoProps } from '@/pages/application/application-detail/types';
import * as APIS from '@/pages/application/service';
import { useAppDeployInfo, useAppChangeOrder } from './hooks';
import { useAppEnvCodeData } from '@/pages/application/hooks';
import RollbackModal from './components/rollback-modal';
import { listAppEnvType } from '@/common/apis';
import { getRequest } from '@/utils/request';
import './index.less';

const { TabPane } = Tabs;
const getStatusClazz = (text: string) => {
  return /成功|正常/.test(text) ? 'text-success' : /失败|错误|异常/.test(text) ? 'text-error' : '';
};
const [tabActive, setTabActive] = useState(sessionStorage.getItem('__init_env_tab__') || 'dev');

useLayoutEffect(() => {
  sessionStorage.setItem('__init_env_tab__', tabActive);
}, [tabActive]);

export default function AppDeployInfo() {
  const { appData } = useContext(DetailContext);
  const [appEnvCodeData, isLoading] = useAppEnvCodeData(appData?.appCode);
  const [envDatas, setEnvDatas] = useState<any[]>([]); //环境
  const [envTypeData, setEnvTypeData] = useState<IOption[]>([]); //环境大类
  const [currEnvCode, setCurrEnv] = useState<string>();
  const [deployData, deployDataLoading, reloadDeployData] = useAppDeployInfo(currEnvCode, appData?.deploymentName);
  const [changeOrderData, changeOrderDataLoading, reloadChangeOrderData] = useAppChangeOrder(
    currEnvCode,
    appData?.deploymentName,
  );
  const [rollbackVisible, setRollbackVisible] = useState(false);
  const intervalRef = useRef<any>();
  // const envList = useMemo(() => appEnvCodeData['prod'] || [], [appEnvCodeData]);

  const handleTabActiveChange = (next: string) => {
    sessionStorage.setItem('__init_env_tab__', next);
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
  // useEffect(() => {
  //   if (envList.length && !currEnvCode) {
  //     setCurrEnv(envList[0].envCode);
  //   }
  // }, [envList]);
  //改变环境下拉选择后查询结果
  let getEnvCode: any;
  const changeEnvCode = (getEnvCodes: string) => {
    getEnvCode = getEnvCodes;
  };
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      reloadDeployData(false);
      reloadChangeOrderData(false);
    }, 3000);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [currEnvCode, appData]);

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
    [appData, currEnvCode],
  );

  if (isLoading) {
    return (
      <div className="block-loading">
        <Spin tip="正在获取环境信息" />
      </div>
    );
  }
  // if (!envList.length) {
  //   return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="该应用没有可使用的环境" />;
  // }

  return (
    <ContentCard noPadding>
      <Tabs onChange={(v) => setTabActive(v)} activeKey={tabActive} type="card">
        {envTypeData?.map((item) => (
          <TabPane tab={item.label} key={item.value}>
            {/* <DeployContent
              isActive={item.value === tabActive}
              envTypeCode={item.value}
              onDeployNextEnvSuccess={() => {
                const i = envTypeData.findIndex((item) => item.value === tabActive);
                setTabActive(envTypeData[i + 1]?.value);
              }}
            /> */}
            11111
          </TabPane>
        ))}
      </Tabs>
      <div>
        {' '}
        <Select placeholder="请选择" style={{ width: 140 }} options={envDatas} onChange={changeEnvCode} />
      </div>
      <div className="tab-content section-group">
        <section className="section-left">
          <div className="table-caption">
            <div className="caption-left">
              <Popconfirm title={`确定重启吗？`}>
                <Button size="small" type="primary" ghost>
                  重启
                </Button>
              </Popconfirm>
            </div>
            <div className="caption-right">
              <Button type="default" danger onClick={() => setRollbackVisible(true)}>
                发布回滚
              </Button>
            </div>
          </div>
          <Table
            dataSource={deployData}
            loading={deployDataLoading}
            bordered
            pagination={false}
            scroll={{ y: window.innerHeight - 340 }}
          >
            <Table.Column title="名称" dataIndex="envName" />
            <Table.Column title="IP" dataIndex="ip" />
            <Table.Column
              title="节点"
              dataIndex="appStateName"
              render={(v: string) => <span className={getStatusClazz(v)}>{v}</span>}
            />
            <Table.Column
              title="镜像"
              dataIndex="taskStateName"
              render={(v: string) => <span className={getStatusClazz(v)}>{v}</span>}
            />
            <Table.Column title="状态" dataIndex="ip" />
            <Table.Column
              title="操作"
              render={(_, record: IStatusInfoProps) => (
                <div className="action-cell">
                  <Popconfirm title={`确定重启 ${record.ip} 吗？`} onConfirm={() => handleRestartItem(record)}>
                    <Button size="small" type="primary" ghost loading={record.taskState === 1}>
                      重启
                    </Button>
                  </Popconfirm>
                  <Button size="small" type="primary" ghost loading={record.taskState === 1}>
                    文件下载
                  </Button>
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
        envCode={currEnvCode}
        onClose={() => setRollbackVisible(false)}
        onSave={() => {
          setRollbackVisible(false);
          reloadChangeOrderData();
          reloadDeployData();
        }}
      />
    </ContentCard>
  );
}
